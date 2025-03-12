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
