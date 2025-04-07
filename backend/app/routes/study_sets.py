# In app/routes/study_sets.py

from fastapi import APIRouter, Depends, HTTPException, Security
from sqlalchemy.orm import Session
from database.database import get_db
from app.models.models import User, StudySet
from app.schemas.schemas import StudySetCreate, StudySetResponse
from app.security.security import decode_access_token

router = APIRouter()

@router.post("/", response_model=StudySetResponse)
async def create_study_set(
    study_set: StudySetCreate, 
    token: str = Security(decode_access_token), 
    db: Session = Depends(get_db)
):
    # Decode the token and get user info
    user_data = decode_access_token(token)
    user = db.query(User).filter(User.email == user_data["sub"]).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Create a new study set
    new_set = StudySet(
        title=study_set.title, 
        description=study_set.description, 
        user_id=user.id
    )
    
    db.add(new_set)
    db.commit()
    db.refresh(new_set)
    return new_set

@router.get("/", response_model=list[StudySetResponse])
async def get_study_sets(db: Session = Depends(get_db)):
    # Return all study sets
    return db.query(StudySet).all()

@router.post("/generate-test/")
async def generate_test(set_id: int, num_questions: int, difficulty: str, category: str, token: str = Security(decode_access_token), db: Session = Depends(get_db)):
    user_data = decode_access_token(token)
    user = db.query(User).filter(User.email == user_data["sub"]).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    study_set = db.query(StudySet).filter(StudySet.id == set_id, StudySet.user_id == user.id).first()
    if not study_set:
        raise HTTPException(status_code=404, detail="Study set not found")

    flashcards = db.query(Flashcard).filter(
        Flashcard.set_id == set_id,
        Flashcard.difficulty == difficulty,
        Flashcard.category == category
    ).limit(num_questions).all()

    return {"test_questions": [{"question": fc.question, "answer": fc.answer} for fc in flashcards]}

@router.get("/users/{user_id}/sets")
async def get_user_sets(user_id: int, db: Session = Depends(get_db)):
    """Fetch study sets for a user"""
    return db.query(StudySet).filter(StudySet.user_id == user_id).all()

@router.get("/users/{user_id}/sets/{set_id}")
async def get_user_set(user_id: int, set_id: int, db: Session = Depends(get_db)):
    """Fetch a specific study set for a user"""
    study_set = db.query(StudySet).filter(StudySet.user_id == user_id, StudySet.id == set_id).first()
    if not study_set:
        raise HTTPException(status_code=404, detail="Study set not found")
    return study_set
