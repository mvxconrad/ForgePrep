from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from app.models.models import User, StudySet, Flashcard
from app.schemas.schemas import StudySetCreate, StudySetResponse
from app.routes.auth import get_current_user_from_cookie

router = APIRouter()

@router.get("/", response_model=list[StudySetResponse])
async def get_study_sets(current_user: User = Depends(get_current_user_from_cookie), db: Session = Depends(get_db)):
    """Retrieve all study sets for the authenticated user."""
    study_sets = db.query(StudySet).filter(StudySet.user_id == current_user.id).all()
    return study_sets

@router.post("/", response_model=StudySetResponse)
async def create_study_set(
    study_set: StudySetCreate, 
    current_user: User = Depends(get_current_user_from_cookie), 
    db: Session = Depends(get_db)
):
    """Create a new study set for the authenticated user."""
    new_set = StudySet(
        user_id=current_user.id,
        title=study_set.title,
        description=study_set.description
    )
    db.add(new_set)
    db.commit()
    db.refresh(new_set)
    return new_set

@router.delete("/{id}")
async def delete_study_set(id: int, current_user: User = Depends(get_current_user_from_cookie), db: Session = Depends(get_db)):
    """Delete a study set by ID for the authenticated user."""
    study_set = db.query(StudySet).filter(StudySet.id == id, StudySet.user_id == current_user.id).first()
    if not study_set:
        raise HTTPException(status_code=404, detail="Study set not found")
    db.delete(study_set)
    db.commit()
    return {"message": "Study set deleted successfully"}

@router.post("/generate-test/")
async def generate_test(
    set_id: int,
    num_questions: int,
    difficulty: str,
    category: str,
    current_user: User = Depends(get_current_user_from_cookie),
    db: Session = Depends(get_db)
):
    """Generate a test from a specific study set with filters."""
    study_set = db.query(StudySet).filter(StudySet.id == set_id, StudySet.user_id == current_user.id).first()
    if not study_set:
        raise HTTPException(status_code=404, detail="Study set not found")

    flashcards = db.query(Flashcard).filter(
        Flashcard.set_id == set_id,
        Flashcard.difficulty == difficulty,
        Flashcard.category == category
    ).limit(num_questions).all()

    return {
        "test_questions": [{"question": fc.question, "answer": fc.answer} for fc in flashcards]
    }

@router.get("/users/{user_id}/sets")
async def get_user_sets(user_id: int, db: Session = Depends(get_db)):
    """Fetch all study sets for a specific user (admin-only endpoint)."""
    return db.query(StudySet).filter(StudySet.user_id == user_id).all()

@router.get("/users/{user_id}/sets/{set_id}")
async def get_user_set(user_id: int, set_id: int, db: Session = Depends(get_db)):
    """Fetch a specific study set for a user."""
    study_set = db.query(StudySet).filter(StudySet.user_id == user_id, StudySet.id == set_id).first()
    if not study_set:
        raise HTTPException(status_code=404, detail="Study set not found")
    return study_set
