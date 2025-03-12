from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.database import get_db
from app.models.models import User
from app.schemas.schemas import UserCreate, UserUpdate
from app.security.security import hash_password

router = APIRouter()

@router.get("/")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@router.post("/")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    hashed_password = hash_password(user.password)
    new_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.get("/{user_id}/progress")
async def get_user_progress(user_id: int, db: Session = Depends(get_db)):
    """Retrieve user progress"""
    progress_data = db.query(UserProgress).filter(UserProgress.user_id == user_id).all()
    return {"user_id": user_id, "progress": progress_data}

@router.get("/")
def get_users(db: Session = Depends(get_db)):
    """Fetch all users"""
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

@router.put("/{user_id}")
def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    """Update user information"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.username:
        db_user.username = user.username
    if user.email:
        db_user.email = user.email

    db.commit()
    db.refresh(db_user)
    return db_user

@router.get("/{user_id}/profile")
async def get_user_profile(user_id: int):
    """Fetch user profile"""
    return {"user_id": user_id}
