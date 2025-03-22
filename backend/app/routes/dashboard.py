from fastapi import APIRouter, Security, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from app.models.models import User, StudySet
from app.security.security import decode_access_token

router = APIRouter()

@router.get("/dashboard/")
async def get_dashboard(token: str = Security(decode_access_token), db: Session = Depends(get_db)):
    """Retrieve user dashboard information"""
    user_data = decode_access_token(token)
    user = db.query(User).filter(User.email == user_data["sub"]).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    study_sets = db.query(StudySet).filter(StudySet.user_id == user.id).all()
    return {"username": user.username, "study_sets": study_sets}
