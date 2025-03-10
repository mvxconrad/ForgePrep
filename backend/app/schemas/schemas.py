from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# User Creation Schema
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str  # Plaintext password before hashing

# Login Schema
class LoginRequest(BaseModel):
    username: str
    password: str

# User Update Schema (with optional fields)
class UserUpdate(BaseModel):
    username: Optional[str] = None  # Optional fields for update
    email: Optional[EmailStr] = None
    password: Optional[str] = None

# User Response Schema (to serialize the output)
class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True  # Allows conversion from SQLAlchemy models

# Study Set Create Schema
class StudySetCreate(BaseModel):
    title: str
    description: str

# Study Set Response Schema (with additional fields and orm_mode)
class StudySetResponse(StudySetCreate):
    id: int
    title: str
    description: str
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True  # This allows SQLAlchemy models to be converted into Pydantic models
