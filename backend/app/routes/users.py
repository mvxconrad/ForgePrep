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
