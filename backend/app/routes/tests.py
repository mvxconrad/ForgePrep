from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime

from database.database import get_db
from app.models.models import Test, TestResult, User
from app.routes.auth import get_current_user_from_cookie

router = APIRouter()

# Pydantic request model
class SubmitTestRequest(BaseModel):
    test_id: int
    answers: dict

# Fetch a test by ID
@router.get("/tests/{test_id}")
async def get_test_by_id(
    test_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_from_cookie)
):
    print(f"🔍 Fetching test {test_id} for user {current_user.id} ({current_user.email})")
    
    test = db.query(Test).filter_by(id=test_id, user_id=current_user.id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found or access denied.")

    return {
        "test_id": test.id,
        "study_material_id": test.study_material_id,
        "test_metadata": test.test_metadata,
        "created_at": test.created_at,
    }

# Submit a test, score it, and store the result
@router.post("/tests/submit")
async def submit_test(
    submission: SubmitTestRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_from_cookie)
):
    print(f"✅ Received submission for Test ID {submission.test_id} from {current_user.email}")

    test = db.query(Test).filter_by(id=submission.test_id, user_id=current_user.id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found.")

    questions = test.test_metadata.get("questions", [])
    correct = 0
    total = len(questions)

    for idx, q in enumerate(questions):
        submitted = submission.answers.get(str(idx)) or submission.answers.get(idx)
        correct_answer = q.get("answer")
        if submitted and correct_answer:
            if submitted.strip().lower() == correct_answer.strip().lower():
                correct += 1

    score = round((correct / total) * 100, 2) if total > 0 else 0

    # Save the result in the test_results table
    new_result = TestResult(
        test_id=submission.test_id,
        user_id=current_user.id,
        score=score,
        correct=correct,
        total=total,
        submitted_answers=submission.answers,
        submitted_at=datetime.utcnow(),
    )
    db.add(new_result)
    db.commit()
    db.refresh(new_result)

    return {
        "test_id": submission.test_id,
        "score": score,
        "correct": correct,
        "total": total,
        "submitted_answers": submission.answers
    }

# Optional: Get all results for the current user
@router.get("/tests/results")
async def get_all_results(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_from_cookie)
):
    results = db.query(TestResult).filter_by(user_id=current_user.id).order_by(TestResult.submitted_at.desc()).all()
    return results
