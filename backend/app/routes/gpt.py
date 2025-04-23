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


@router.get("/tests/{test_id}")
async def get_test_by_id(
    test_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_from_cookie)
):
    """Retrieve a test by ID for the current user."""
    test = db.query(Test).filter_by(id=test_id, user_id=current_user.id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found.")
    
    return {
        "test_id": test.id,
        "study_material_id": test.study_material_id,
        "test_metadata": test.test_metadata,
        "created_at": test.created_at,
    }


@router.post("/gpt/generate")
async def generate_test(
    request: PromptRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_from_cookie)
):
    """Generate a test from study material using GPT."""
    try:
        file = db.query(FileModel).filter_by(id=request.file_id, user_id=current_user.id).first()
        if not file:
            raise HTTPException(status_code=404, detail="File not found or access denied.")

        if not file.extracted_text or not file.extracted_text.strip():
            raise HTTPException(status_code=400, detail="No extracted text found in file.")

        # Build GPT prompt
        base_prompt = request.prompt or (
            "You are provided with study material. Generate a JSON-formatted test. "
            "Each question must include: question text, correct answer, and difficulty (easy, medium, hard)."
        )
        full_prompt = f"{base_prompt}\n\nStudy Material:\n{file.extracted_text[:8000]}"

        # GPT request
        openai.api_key = os.environ.get("OPENAI_API_KEY")
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant for test generation."},
                {"role": "user", "content": full_prompt}
            ]
        )

        raw_output = response.choices[0].message["content"]

        # Attempt to parse JSON
        try:
            parsed = json.loads(raw_output)
            if isinstance(parsed, dict) and "questions" in parsed:
                questions = parsed["questions"]
            elif isinstance(parsed, list):
                questions = parsed
            else:
                raise ValueError("Unexpected structure.")
        except Exception:
            questions = [
                {
                    "id": 1,
                    "text": raw_output.strip(),
                    "answer": "Unstructured GPT response",
                    "difficulty": "unknown"
                }
            ]

        # Save to DB
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
