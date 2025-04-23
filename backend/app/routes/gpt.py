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
    try:
        file = db.query(FileModel).filter_by(id=request.file_id, user_id=current_user.id).first()
        if not file:
            raise HTTPException(status_code=404, detail="File not found or access denied.")
        if not file.extracted_text or not file.extracted_text.strip():
            raise HTTPException(status_code=400, detail="No extracted text found in file.")

        # Stronger, enforced prompt
        base_prompt = request.prompt or (
            "You are a helpful assistant for test generation. "
            "From the following study material, create 5 multiple-choice questions. "
            "Each question must be returned in valid JSON format like this:\n\n"
            "[\n"
            "  {\n"
            "    \"question\": \"What is the capital of France?\",\n"
            "    \"options\": [\"Paris\", \"London\", \"Berlin\", \"Rome\"],\n"
            "    \"answer\": \"Paris\",\n"
            "    \"difficulty\": \"easy\"\n"
            "  },\n"
            "  ...\n"
            "]\n\n"
            "Return ONLY the JSON array. Do NOT include any explanations or notes."
        )

        full_prompt = f"{base_prompt}\n\nStudy Material:\n{file.extracted_text[:8000]}"

        # GPT API call
        openai.api_key = os.getenv("OPENAI_API_KEY")
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "user", "content": full_prompt}
            ]
        )
        raw_output = response.choices[0].message["content"]
        print("GPT RAW OUTPUT:", raw_output)

        # Parse JSON
        try:
            questions = json.loads(raw_output)
            if not isinstance(questions, list):
                raise ValueError("Expected a JSON array")
        except Exception as parse_err:
            raise HTTPException(status_code=500, detail=f"Failed to parse GPT response: {str(parse_err)}")

        # Validate structure
        valid_questions = []
        for q in questions:
            if all(k in q for k in ("question", "options", "answer")) and isinstance(q["options"], list):
                valid_questions.append(q)

        if not valid_questions:
            raise HTTPException(status_code=400, detail="No valid questions were parsed from GPT output.")

        # Save to DB
        new_test = Test(
            user_id=current_user.id,
            study_material_id=request.study_material_id,
            test_metadata={"questions": valid_questions},
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
