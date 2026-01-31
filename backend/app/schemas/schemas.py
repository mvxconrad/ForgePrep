from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# ---------- USER SCHEMAS ---------- #

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True

# ---------- STUDY SET SCHEMAS ---------- #

class StudySetCreate(BaseModel):
    title: str
    description: str

class StudySetResponse(StudySetCreate):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True
