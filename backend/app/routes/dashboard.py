from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from database.database import get_db
from app.models.models import User, Test, Goal
from app.security.security import decode_access_token

router = APIRouter()

@router.get("/")
async def get_dashboard(token: str = Query(...), db: Session = Depends(get_db)):
    """Retrieve user dashboard information"""
    user_data = decode_access_token(token)
    print("Decoded user data:", user_data)  # Debugging log

    user = db.query(User).filter(User.email == user_data["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    print("Retrieved user:", user.username)  # Debugging log

    recent_tests = db.query(Test).filter(Test.user_id == user.id).order_by(Test.created_at.desc()).limit(5).all()
    goals = db.query(Goal).filter(Goal.user_id == user.id).all()
    statistics = {
        "average_score": db.query(func.avg(Test.score)).filter(Test.user_id == user.id).scalar() or 0,
        "best_score": db.query(func.max(Test.score)).filter(Test.user_id == user.id).scalar() or 0,
        "worst_score": db.query(func.min(Test.score)).filter(Test.user_id == user.id).scalar() or 0,
    }

    return {
        "username": user.username,
        "recent_tests": [{"id": t.id, "name": t.name, "score": t.score} for t in recent_tests],
        "goals": [{"id": g.id, "title": g.title, "progress": g.progress} for g in goals],
        "statistics": statistics,
    }