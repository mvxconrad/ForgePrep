from fastapi import APIRouter, status, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from fastapi.background import BackgroundTasks
from jose import JWTError
from pydantic import BaseModel, EmailStr
import os
from dotenv import load_dotenv
from starlette.responses import RedirectResponse
import smtplib
from email.mime.text import MIMEText
from app.services.email_service import send_verification_email, send_password_reset_email


from app.models.models import User
from app.schemas.schemas import UserCreate, LoginRequest
from app.security.security import (
    verify_password,
    create_access_token,
    create_email_verification_token,
    create_password_reset_token,
    decode_access_token,
    decode_email_token,
    decode_password_reset_token,
    hash_password
)
from database.database import get_db

load_dotenv()
router = APIRouter()

FRONTEND_URL = os.getenv("FRONTEND_URL", "https://forgeprep.net")
EMAIL_VERIFICATION_ENABLED = True # Change to True once Email Server is Set Up

# ------------------ MODELS ------------------ #
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

# ------------------ REGISTER ------------------ #
@router.post("/register/")
async def register_user(request: UserCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == request.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(request.password)
    new_user = User(
        username=request.username,
        email=request.email,
        hashed_password=hashed_password,
        is_verified=not EMAIL_VERIFICATION_ENABLED  # Change when DNS is Set Up / Automatically verify in dev
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    if EMAIL_VERIFICATION_ENABLED:
        token = create_email_verification_token(request.email)
        background_tasks.add_task(send_verification_email, request.email, token)

    return {"message": "User registered. Check your email to verify your account."}

# ------------------ EMAIL VERIFICATION ------------------ #
@router.get("/verify-email/")
async def verify_email(token: str, db: Session = Depends(get_db)):
    try:
        email = decode_email_token(token)
    except HTTPException as e:
        return JSONResponse(status_code=400, content={"error": e.detail})

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_verified = True
    db.commit()
    return RedirectResponse(url=f"{FRONTEND_URL}/login?verified=true")

@router.post("/resend-verification/")
async def resend_verification(request: ForgotPasswordRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or user.is_verified:
        return {"message": "Email already verified or does not exist."}

    token = create_email_verification_token(user.email)
    background_tasks.add_task(send_verification_email, user.email, token)
    return {"message": "A new verification email was sent."}

# ------------------ LOGIN ------------------ #
@router.post("/login")
async def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if EMAIL_VERIFICATION_ENABLED and not user.is_verified:
        raise HTTPException(status_code=403, detail="Please verify your email first.")

    token_data = {"id": user.id, "sub": user.email}
    access_token = create_access_token(token_data)

    response = JSONResponse(content={"message": "Login successful"})
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="None",
        max_age=86400,
        path="/"
    )
    return response

@router.post("/logout")
def logout():
    response = JSONResponse(content={"message": "Logged out"})
    response.delete_cookie("access_token")
    return response

# ------------------ USER INFO ------------------ #
@router.get("/me")
def get_current_user_info(request: Request, db: Session = Depends(get_db)):
    current_user = get_current_user_from_cookie(request, db)
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "is_verified": current_user.is_verified,
    }

# ------------------ PASSWORD RESET FLOW ------------------ #
@router.post("/forgot-password/")
async def forgot_password(request: ForgotPasswordRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        return {"message": "If that email exists, a reset link was sent."}

    token = create_password_reset_token(user.email)
    background_tasks.add_task(send_password_reset_email, user.email, token)

    return {"message": "Reset instructions sent."}

@router.post("/reset-password/")
async def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    try:
        email = decode_password_reset_token(request.token)
    except HTTPException as e:
        raise HTTPException(status_code=400, detail=f"Token error: {e.detail}")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hashed_password = hash_password(request.new_password)
    db.commit()

    return {"message": "✅ Password reset successfully."}

# ------------------ HELPER ------------------ #
def get_current_user_from_cookie(request: Request, db: Session = Depends(get_db)) -> User:
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = decode_access_token(token)
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError as e:
        raise HTTPException(status_code=401, detail="Token decoding failed")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user
