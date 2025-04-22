from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from .auth import get_current_user
from database.database import get_db
from app.models import Test
from app.models.models import File as FileModel
import os
import openai
import json
from datetime import datetime

router = APIRouter()

class PromptRequest(BaseModel):
    file_id: int
    topic: str | None = None
    difficulty: str | None = "medium"  # easy, medium, hard
    num_questions: int = 10
    study_material_id: int | None = None
    prompt: str | None = None  # Optional full custom prompt override

@router.post("/gpt/generate")
async def generate_test(
    request: PromptRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    try:
        # Only allow specific admin-level user
        if user.email != "aejense@gmail.com":
            raise HTTPException(status_code=403, detail="Not authorized")

        # Limit number of questions
        if request.num_questions < 1 or request.num_questions > 50:
            raise HTTPException(status_code=400, detail="Number of questions must be between 1 and 50.")

        # Fetch file
        file = db.query(FileModel).filter_by(id=request.file_id, user_id=user.id).first()
        if not file:
            raise HTTPException(status_code=404, detail="File not found or access denied")

        extracted_text = file.extracted_text
        if not extracted_text or len(extracted_text.strip()) == 0:
            raise HTTPException(status_code=400, detail="No extracted text available for this file")

        # Prompt template
        if request.prompt:
            full_prompt = f"{request.prompt}\n\nStudy Material:\n{extracted_text[:10000]}"
        else:
            full_prompt = (
                f"Generate {request.num_questions} multiple-choice questions on the topic of '{request.topic or 'general'}' "
                f"from the study material provided below. Questions should be suitable for a {request.difficulty} level. "
                f"Format the response as JSON, with each item having 'question', 'answer', and 'difficulty'.\n\n"
                f"Study Material:\n{extracted_text[:10000]}"
            )

        openai.api_key = os.environ.get("OPENAI_API_KEY")
        response = openai.ChatCompletion.create(
            model="gpt-4.1-nano",
            messages=[
                {"role": "system", "content": "You are a helpful test generator assistant."},
                {"role": "user", "content": full_prompt}
            ],
            max_tokens=min(request.num_questions * 150, 2000),
            temperature=0.7
        )

        raw_output = response.choices[0].message["content"]

        try:
            questions = json.loads(raw_output)
        except json.JSONDecodeError:
            questions = {"raw_text": raw_output}

        new_test = Test(
            user_id=user.id,
            study_material_id=request.study_material_id,
            test_metadata=questions,
            created_at=datetime.utcnow()
        )
        db.add(new_test)
        db.commit()
        db.refresh(new_test)

        return {"test_id": new_test.id, "metadata": new_test.test_metadata}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
