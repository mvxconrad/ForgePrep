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
import re

router = APIRouter()

class PromptRequest(BaseModel):
    file_id: int
    prompt: str | None = None
    study_material_id: int | None = None

def parse_raw_mcq(raw_text: str):
    """Parse fallback GPT output for MCQs and extract answer key properly."""
    pattern = re.compile(
        r"(?:\d+\.|\d+\))\s*(.*?)\n\s*a[).]\s*(.*?)\n\s*b[).]\s*(.*?)\n\s*c[).]\s*(.*?)\n\s*d[).]\s*(.*?)(?=\n\d+[).]|$)",
        re.DOTALL | re.IGNORECASE
    )
    matches = pattern.findall(raw_text)
    print(f"🧪 Parsed {len(matches)} fallback questions from raw GPT output.")

    questions = []
    for question, opt1, opt2, opt3, opt4 in matches:
        questions.append({
            "question": question.strip(),
            "options": [opt1.strip(), opt2.strip(), opt3.strip(), opt4.strip()],
            "answer": "Unknown",  # placeholder, will patch next
            "difficulty": "medium"
        })

    # ✅ FIXED: Detect and parse answer key
    answer_block = re.search(r"Answers:\s*((?:\d+\.\s*[a-dA-D]\s*)+)", raw_text, re.IGNORECASE)
    if answer_block:
        print("✅ Answer key detected.")
        answers = re.findall(r"(\d+)\.\s*([a-dA-D])", answer_block.group(1))
        for num_str, letter in answers:
            idx = int(num_str) - 1
            if 0 <= idx < len(questions):
                option_index = ord(letter.lower()) - ord("a")
                if 0 <= option_index < len(questions[idx]["options"]):
                    questions[idx]["answer"] = questions[idx]["options"][option_index]

    return questions

@router.post("/gpt/generate")
async def generate_test(
    request: PromptRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_from_cookie)
):
    try:
        print(f"📥 Generating test for user: {current_user.email} (ID: {current_user.id})")

        file = db.query(FileModel).filter_by(id=request.file_id, user_id=current_user.id).first()
        if not file:
            raise HTTPException(status_code=404, detail="File not found or access denied.")
        if not file.extracted_text or not file.extracted_text.strip():
            raise HTTPException(status_code=400, detail="No extracted text found in file.")

        # Prompt template that expects an answer key at the end
        base_prompt = request.prompt or (
            "You are a helpful assistant for test generation.\n"
            "From the following study material, create exactly 5 multiple-choice questions.\n"
            "Each question must be labeled like this:\n"
            "1) What is ...?\n"
            "a) Option A\nb) Option B\nc) Option C\nd) Option D\n\n"
            "At the end, add:\nAnswers:\n1. b\n2. a...\n\n"
            "No extra comments or explanations. Output ONLY the questions and answers."
        )

        full_prompt = f"{base_prompt}\n\nStudy Material:\n{file.extracted_text[:6000]}"

        openai.api_key = os.getenv("OPENAI_API_KEY")
        if not openai.api_key:
            raise HTTPException(status_code=500, detail="OpenAI API key is not set.")

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": full_prompt}]
        )
        raw_output = response.choices[0].message["content"]
        print("GPT RAW OUTPUT:\n", raw_output)

        # Try parsing as JSON first
        try:
            questions = json.loads(raw_output)
            if not isinstance(questions, list):
                raise ValueError("Expected a list of questions")
        except Exception:
            print("⚠️ GPT returned invalid JSON. Falling back to raw parsing...")
            questions = parse_raw_mcq(raw_output)

        # Clean and validate
        valid_questions = [
            q for q in questions
            if isinstance(q, dict)
            and "question" in q
            and "options" in q
            and isinstance(q["options"], list)
        ]

        if not valid_questions:
            raise HTTPException(status_code=400, detail="No valid questions parsed from GPT output.")

        # Patch missing answers
        for q in valid_questions:
            if not q.get("answer"):
                q["answer"] = "Unknown"

        # Save to DB
        new_test = Test(
            user_id=current_user.id,
            name="Generated Test",
            study_material_id=request.study_material_id,
            test_metadata={"questions": valid_questions},
            created_at=datetime.utcnow()
        )
        db.add(new_test)
        db.commit()
        db.refresh(new_test)

        print(f"✅ Saved test: ID {new_test.id} for user {current_user.email}")
        return {"test_id": new_test.id, "metadata": new_test.test_metadata}

    except openai.error.OpenAIError as oe:
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(oe)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")
