from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.routes.auth import get_current_user_from_cookie
from database.database import get_db
from app.models import Test  # SQLAlchemy Test model
from app.models.models import User
from app.models.models import File as FileModel  # SQLAlchemy File model
import os
import openai
import json
from datetime import datetime

# Initialize the router
router = APIRouter()

# Define the request model
class PromptRequest(BaseModel):
    file_id: int  # The ID of the file containing the extracted text
    prompt: str | None = None  # Optional prompt from the user
    study_material_id: int | None = None  # Optional ID for the study material

@router.post("/gpt/generate")
async def generate_test(
    request: PromptRequest,
    db: Session = Depends(get_db),  # Dependency for DB session
    current_user: User = Depends(get_current_user_from_cookie)  # Dependency for current authenticated user
):
    try:
        # Step 1: Check if the current user is authorized (admin-level check)
        if user.email != "aejense@gmail.com":
            raise HTTPException(status_code=403, detail="Not authorized")

        # Step 2: Fetch the file from the database (make sure the file belongs to the current user)
        file = db.query(FileModel).filter_by(id=request.file_id, user_id=user.id).first()
        if not file:
            raise HTTPException(status_code=404, detail="File not found or access denied")

        # Step 3: Extract text from the file and check for validity
        extracted_text = file.extracted_text
        if not extracted_text or len(extracted_text.strip()) == 0:
            raise HTTPException(status_code=400, detail="No extracted text available for this file")

        # Step 4: Construct the prompt (use the user-provided prompt or a default one)
        base_prompt = request.prompt or (
            "You are provided with study material. Generate a test based on this material in JSON format. "
            "Each item should have a question, answer, and difficulty (easy, medium, hard)."
        )
        full_prompt = f"{base_prompt}\n\nStudy Material:\n{extracted_text[:10000]}"  # Limit to 10,000 characters for token safety

        # Step 5: Call OpenAI's API to generate the test
        openai.api_key = os.environ.get("OPENAI_API_KEY")  # Set the API key
        response = openai.ChatCompletion.create(
            model="gpt-4.1-nano",  # Choose the model to use (make sure it is available)
            messages=[
                {"role": "system", "content": "You are a helpful test generator assistant."},
                {"role": "user", "content": full_prompt}
            ]
        )

        # Step 6: Parse the response
        raw_output = response.choices[0].message["content"]

        # Step 7: Try parsing the response as JSON
        try:
            questions = json.loads(raw_output)
        except json.JSONDecodeError:
            questions = {"raw_text": raw_output}  # If parsing fails, return raw text as fallback

        # Step 8: Save the generated test to the database
        new_test = Test(
            user_id=user.id,
            study_material_id=request.study_material_id,
            test_metadata=questions,
            created_at=datetime.utcnow()
        )
        db.add(new_test)
        db.commit()
        db.refresh(new_test)

        # Step 9: Return the result
        return {"test_id": new_test.id, "metadata": new_test.test_metadata}

    except Exception as e:
        # If any error occurs, return a 500 internal server error
        raise HTTPException(status_code=500, detail=str(e))
