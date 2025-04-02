from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from .auth import get_current_user
from database.database import get_db
from app.models import Test  # SQLAlchemy Test model
import openai, os
import json
from datetime import datetime

router = APIRouter()
openai.api_key = os.getenv("OPENAI_API_KEY")

class PromptRequest(BaseModel):
    prompt: str
    study_material_id: int | None = None

@router.post("/gpt/generate")
async def generate_test(request: PromptRequest, db: Session = Depends(get_db), user=Depends(get_current_user)):
    try:
        # GPT call
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You're a helpful AI that generates exam questions in JSON."},
                {"role": "user", "content": request.prompt}
            ]
        )

        raw_output = response.choices[0].message["content"]

        # Optional: force JSON parsing if GPT returns structured content
        try:
            questions = json.loads(raw_output)
        except json.JSONDecodeError:
            questions = {"raw_text": raw_output}

        # Save to DB
        new_test = Test(
            user_id=user.id,
            study_material_id=request.study_material_id if request.study_material_id else None,
            test_metadata=questions,
            created_at=datetime.utcnow()
        )
        db.add(new_test)
        db.commit()
        db.refresh(new_test)

        return {"test_id": new_test.id, "metadata": new_test.test_metadata}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
