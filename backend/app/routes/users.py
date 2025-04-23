from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from app.models.models import User, UserProgress
from app.schemas.schemas import UserCreate, UserUpdate
from app.security.security import hash_password
from app.routes.auth import get_current_user_from_cookie

router = APIRouter()

# ------------------ PUBLIC + ADMIN ROUTES ------------------ #

@router.get("/")
def get_users(db: Session = Depends(get_db)):
    """Fetch all users (admin route?)"""
    return db.query(User).all()

@router.post("/")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """Create a new user"""
    hashed_password = hash_password(user.password)
    new_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    """Fetch a single user by ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/{user_id}/progress")
def get_user_progress(user_id: int, db: Session = Depends(get_db)):
    """Retrieve user progress"""
    progress_data = db.query(UserProgress).filter(UserProgress.user_id == user_id).all()
    return {"user_id": user_id, "progress": progress_data}

@router.put("/{user_id}")
def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    """Update user info by ID (admin-level)"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.username:
        db_user.username = user.username
    if user.email:
        db_user.email = user.email
    if user.password:
        db_user.hashed_password = hash_password(user.password)

    db.commit()
    db.refresh(db_user)
    return db_user

# ------------------ AUTHENTICATED USER ROUTES ------------------ #

@router.get("/profile")
def get_user_profile(current_user: User = Depends(get_current_user_from_cookie)):
    """Fetch profile of the logged-in user"""
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email
    }

@router.put("/profile")
def update_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user_from_cookie),
    db: Session = Depends(get_db)
):
    """Update profile of the authenticated user"""
    if user_update.username:
        current_user.username = user_update.username
    if user_update.email:
        current_user.email = user_update.email
    if user_update.password:
        current_user.hashed_password = hash_password(user_update.password)

    db.commit()
    db.refresh(current_user)
    return {
        "username": current_user.username,
        "email": current_user.email
    }
