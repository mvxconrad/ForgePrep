from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.context import CryptContext
from database.database import engine, Base, get_db
from app.models.models import User

# Initialize FastAPI app
app = FastAPI()

# Recreate database tables
# Base.metadata.create_all(bind=engine)

# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Create database tables
Base.metadata.create_all(bind=engine)

# Pydantic schemas
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserUpdate(BaseModel):
    username: str = None
    email: str = None

# API Endpoints

@app.get("/")
def root():
    return {"message": "API is running and connected to PostgreSQL!"}

@app.get("/users/")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users

@app.post("/users/")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    hashed_password = hash_password(user.password)
    new_user = User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"error": "User not found"}
    return user

@app.put("/users/{user_id}")
def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        return {"error": "User not found"}
    if user.username:
        db_user.username = user.username
    if user.email:
        db_user.email = user.email
    db.commit()
    db.refresh(db_user)
    return db_user

@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        return {"error": "User not found"}
    db.delete(db_user)
    db.commit()
    return {"message": "User deleted successfully"}
