from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.routes.auth import get_current_user_from_cookie
from database.database import get_db
from app.models import Test
from app.models.models import User, File as FileModel
import os
import openai
import json
from datetime import datetime

router = APIRouter()

class PromptRequest(BaseModel):
    file_id: int
    prompt: str | None = None
    study_material_id: int | None = None

@router.post("/gpt/generate")
async def generate_test(
    request: PromptRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_from_cookie)
):
    try:
        # Step 1: Find file
        file = db.query(FileModel).filter_by(id=request.file_id, user_id=current_user.id).first()
        if not file:
            raise HTTPException(status_code=404, detail="File not found or access denied")

        # Step 2: Ensure text exists
        if not file.extracted_text or len(file.extracted_text.strip()) == 0:
            raise HTTPException(status_code=400, detail="No extracted text available for this file")

        # Step 3: Build prompt
        base_prompt = request.prompt or (
            "You are provided with study material. Generate a test based on this material in JSON format. "
            "Each item should have a question, answer, and difficulty (easy, medium, hard)."
        )
        full_prompt = f"{base_prompt}\n\nStudy Material:\n{file.extracted_text[:8000]}"

        # Step 4: OpenAI call
        openai.api_key = os.environ.get("OPENAI_API_KEY")
        response = openai.ChatCompletion.create(
            model="gpt-4",  # use a valid model name, like "gpt-3.5-turbo" or "gpt-4"
            messages=[
                {"role": "system", "content": "You are a helpful test generator assistant."},
                {"role": "user", "content": full_prompt}
            ],
            max_tokens=min(request.num_questions * 150, 2000),
            temperature=0.7
        )

        # Step 5: Parse output
        raw_output = response.choices[0].message["content"]
        try:
            questions = json.loads(raw_output)
        except json.JSONDecodeError:
            questions = {"raw_text": raw_output}

        # Step 6: Save test
        new_test = Test(
            user_id=current_user.id,
            study_material_id=request.study_material_id,
            test_metadata=questions,
            created_at=datetime.utcnow()
        )
        db.add(new_test)
        db.commit()
        db.refresh(new_test)

        return {"test_id": new_test.id, "metadata": new_test.test_metadata}

    except openai.error.OpenAIError as oe:
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(oe)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")
