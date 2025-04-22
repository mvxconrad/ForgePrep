from fastapi import APIRouter, status, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from authlib.integrations.starlette_client import OAuth
from jose import JWTError
from app.models.models import User
from app.schemas.schemas import UserCreate, LoginRequest
from app.security.security import (
    verify_password,
    create_access_token,
    decode_access_token,
    hash_password
)
from database.database import get_db
import os
from dotenv import load_dotenv

router = APIRouter()
load_dotenv()

# JWT config
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"

# OAuth setup
oauth = OAuth()

if os.getenv("GOOGLE_CLIENT_ID"):
    oauth.register(
        name="google",
        client_id=os.getenv("GOOGLE_CLIENT_ID"),
        client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
        authorize_url="https://accounts.google.com/o/oauth2/auth",
        access_token_url="https://oauth2.googleapis.com/token",
        client_kwargs={"scope": "openid email profile"},
    )

if os.getenv("FACEBOOK_CLIENT_ID"):
    oauth.register(
        name="facebook",
        client_id=os.getenv("FACEBOOK_CLIENT_ID"),
        client_secret=os.getenv("FACEBOOK_CLIENT_SECRET"),
        authorize_url="https://www.facebook.com/v12.0/dialog/oauth",
        access_token_url="https://graph.facebook.com/v12.0/oauth/access_token",
        client_kwargs={"scope": "public_profile email"},
    )

if os.getenv("GITHUB_CLIENT_ID"):
    oauth.register(
        name="github",
        client_id=os.getenv("GITHUB_CLIENT_ID"),
        client_secret=os.getenv("GITHUB_CLIENT_SECRET"),
        authorize_url="https://github.com/login/oauth/authorize",
        access_token_url="https://github.com/login/oauth/access_token",
        client_kwargs={"scope": "user:email"},
    )

# ------------------ AUTH ROUTES ------------------ #

@router.post("/register/")
async def register_user(request: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(request.password)
    new_user = User(username=request.username, email=request.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}


@router.post("/login")
async def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token_data = {"id": user.id, "sub": user.email}
    access_token = create_access_token(token_data)

    response = JSONResponse(content={"message": "Login successful"})
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="Lax",
        max_age=86400,
        path="/"
    )
    return response


@router.post("/logout")
def logout():
    response = JSONResponse(content={"message": "Logged out"})
    response.delete_cookie("access_token")
    return response


@router.get("/me")
def get_current_user_info(current_user: User = Depends(lambda: get_current_user_from_cookie())):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email
    }


# ------------------ OAUTH ROUTES ------------------ #

@router.get("/login/{provider}")
async def login_provider(request: Request, provider: str):
    if provider not in oauth:
        raise HTTPException(status_code=400, detail="Unsupported OAuth provider")
    redirect_uri = request.url_for("auth_provider", provider=provider)
    return await oauth.create_client(provider).authorize_redirect(request, redirect_uri)


@router.get("/{provider}")
async def auth_provider(request: Request, provider: str):
    client = oauth.create_client(provider)
    if not client:
        raise HTTPException(status_code=500, detail=f"OAuth provider '{provider}' not configured")

    token = await client.authorize_access_token(request)
    user = (
        await client.parse_id_token(request, token)
        if provider == "google"
        else token
    )
    return {"provider": provider, "user": user}


@router.get("/protected/")
async def protected_route(current_user: User = Depends(lambda: get_current_user_from_cookie())):
    return {"message": f"Hello, {current_user.username}!"}


# ------------------ HELPER ------------------ #

def get_current_user_from_cookie(request: Request = Depends(), db: Session = Depends(get_db)) -> User:
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = decode_access_token(token)
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError as e:
        print("JWT error:", str(e))
        raise HTTPException(status_code=401, detail="Token decoding failed")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user
