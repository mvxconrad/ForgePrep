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

    # Example data for recent tests, goals, and statistics
    recent_tests = [
        {"id": 1, "name": "Math Test", "score": 85},
        {"id": 2, "name": "Science Test", "score": 90},
    ]
    goals = [
        {"id": 1, "title": "Complete 5 tests", "progress": 60},
        {"id": 2, "title": "Study Math", "progress": 80},
    ]
    statistics = {
        "averageScore": 87,
        "bestScore": 95,
        "worstScore": 70,
    }

    return {
        "username": user.username,
        "study_sets": study_sets,
        "recentTests": recent_tests,
        "goals": goals,
        "statistics": statistics,
    }
