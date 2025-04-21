from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from .auth import get_current_user
from database.database import get_db
from app.models import Test  # SQLAlchemy Test model
from app.models.models import File as FileModel  # SQLAlchemy File model
import os
from openai import OpenAI
import json
from datetime import datetime

router = APIRouter()
# openai.api_key = os.getenv("OPENAI_API_KEY")

class PromptRequest(BaseModel):
    file_id: int
    prompt: str | None = None
    study_material_id: int | None = None

@router.post("/gpt/generate")
async def generate_test(
    request: PromptRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)  # or require_admin if needed
):
    try:
        # Only allow specific user (admin-level)
        if user.email != "aejense@gmail.com":
            raise HTTPException(status_code=403, detail="Not authorized")

        # Fetch file from DB (only if it belongs to this user)
        file = db.query(FileModel).filter_by(id=request.file_id, user_id=user.id).first()
        if not file:
            raise HTTPException(status_code=404, detail="File not found or access denied")

        extracted_text = file.extracted_text
        if not extracted_text or len(extracted_text.strip()) == 0:
            raise HTTPException(status_code=400, detail="No extracted text available for this file")

        # Combine prompt
        base_prompt = request.prompt or (
            "You are provided with study material. Generate a test based on this material in JSON format. "
            "Each item should have a question, answer, and difficulty (easy, medium, hard)."
        )
        full_prompt = f"{base_prompt}\n\nStudy Material:\n{extracted_text[:10000]}"  # limit for token safety

        client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        response = client.chat.completions.create(
            model="gpt-4.1-nano",
            messages=[
                {"role": "system", "content": "You are a helpful test generator assistant."},
                {"role": "user", "content": full_prompt}
            ]
        )

        raw_output = response.choices[0].message.content

        # Parse JSON if possible
        try:
            questions = json.loads(raw_output)
        except json.JSONDecodeError:
            questions = {"raw_text": raw_output}

        # Save test in DB
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
