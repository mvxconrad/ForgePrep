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
    """Improved parser for GPT outputs that may use 'Question X:' or numbered formats"""
    pattern = re.compile(
        r"(?:\d+\.|Question \d+:)\s*(.*?)\s*a[).]\s*(.*?)\s*b[).]\s*(.*?)\s*c[).]\s*(.*?)\s*d[).]\s*(.*?)(?=\n(?:\d+\.|Question \d+:)|\Z)",
        re.DOTALL | re.IGNORECASE,
    )

    matches = pattern.findall(raw_text)
    print(f"🧪 Parsed {len(matches)} fallback questions from raw GPT output.")

    structured = []
    for question, opt1, opt2, opt3, opt4 in matches:
        structured.append({
            "question": question.strip(),
            "options": [opt1.strip(), opt2.strip(), opt3.strip(), opt4.strip()],
            "answer": None,
            "difficulty": "medium"
        })

    # ✅ Fallback if nothing matched
    if not structured:
        print("⚠️ No valid MCQs parsed. Returning default fallback question.")
        return [{
            "question": "⚠️ Unable to parse structured questions from GPT response.",
            "options": [],
            "answer": None,
            "difficulty": "unknown"
        }]

    return structured

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

        # Prompt definition
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
            "  }\n"
            "]\n\n"
            "Return ONLY the JSON array. Do NOT include explanations."
        )

        full_prompt = f"{base_prompt}\n\nStudy Material:\n{file.extracted_text[:6000]}"

        openai.api_key = os.getenv("OPENAI_API_KEY")
        if not openai.api_key:
            raise HTTPException(status_code=500, detail="OpenAI API key is not set.")

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "user", "content": full_prompt}
            ]
        )
        raw_output = response.choices[0].message["content"]
        print("GPT RAW OUTPUT:\n", raw_output)

        # Attempt to parse as JSON first
        try:
            questions = json.loads(raw_output)
            if not isinstance(questions, list):
                raise ValueError("Expected a list of questions")
        except Exception as parse_err:
            print("⚠️ GPT returned invalid JSON. Falling back to raw parsing...")
            questions = parse_raw_mcq(raw_output)

            # ✅ Extract answers from the footer if they exist
            answer_block = re.search(r"Answers:\s*((?:\d+\.\s*[a-dA-D]\s*)+)", raw_output, re.IGNORECASE | re.DOTALL)
            if answer_block:
                print("✅ Answer key detected in GPT output.")
                answers = re.findall(r"(\d+)\.\s*([a-dA-D])", answer_block.group(1))
                for num_str, letter in answers:
                    idx = int(num_str) - 1
                    if 0 <= idx < len(questions):
                        option_index = ord(letter.lower()) - ord("a")
                        if 0 <= option_index < len(questions[idx]["options"]):
                            questions[idx]["answer"] = questions[idx]["options"][option_index]

        # Validate and clean questions
        valid_questions = [
            q for q in questions
            if isinstance(q, dict)
            and "question" in q
            and "options" in q
            and isinstance(q["options"], list)
        ]

        # ✅ Patch missing answers
        for q in valid_questions:
            if "answer" not in q or not q["answer"]:
                q["answer"] = "Unknown"

        if not valid_questions:
            raise HTTPException(status_code=400, detail="No valid questions parsed from GPT output.")

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
