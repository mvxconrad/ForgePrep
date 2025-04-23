from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from database.database import get_db
from app.models.models import User, Test
from app.routes.auth import get_current_user_from_cookie

router = APIRouter()

@router.get("/")
async def get_dashboard(
    current_user: User = Depends(get_current_user_from_cookie),
    db: Session = Depends(get_db)
):
    print("Authenticated user:", current_user.username)

    # Recent tests
    recent_tests = (
        db.query(Test)
        .filter(Test.user_id == current_user.id)
        .order_by(Test.created_at.desc())
        .limit(5)
        .all()
    )

    # Placeholder goals
    goals = [
        {"id": 1, "title": "Finish Chapter 5", "progress": 60},
        {"id": 2, "title": "Revise Midterms", "progress": 30},
    ]

    # Placeholder notifications
    notifications_query = []  # Replace with db query if needed
    notifications = notifications_query if notifications_query else [
        {"message": "You have no notifications yet."}
    ]

    # Statistics
    statistics_query = (
        db.query(func.avg(Test.score), func.max(Test.score), func.min(Test.score))
        .filter(Test.user_id == current_user.id)
        .first()
    )

    statistics = {
        "average_score": round(statistics_query[0], 2) if statistics_query[0] is not None else None,
        "best_score": statistics_query[1] if statistics_query[1] is not None else None,
        "worst_score": statistics_query[2] if statistics_query[2] is not None else None,
        "image": "/assets/statistics.png"
    }

    return {
        "username": current_user.username,
        "recent_tests": [
            {"id": t.id, "name": t.name, "score": t.score} for t in recent_tests
        ] if recent_tests else [],
        "goals": goals,
        "notifications": notifications,
        "statistics": statistics,
        "background_image": "/assets/background_abstract2.png"
    }
