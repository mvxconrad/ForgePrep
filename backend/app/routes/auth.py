from fastapi import APIRouter, status, Depends, HTTPException, Security
from sqlalchemy.orm import Session
from app.security.security import verify_password, create_access_token, decode_access_token, hash_password
from database.database import get_db
from fastapi.security import OAuth2PasswordBearer
from app.models.models import User
from app.schemas.schemas import UserCreate, LoginRequest
from authlib.integrations.starlette_client import OAuth
from starlette.requests import Request
from jose import JWTError, jwt
import os

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# OAuth Setup
oauth = OAuth()
oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    access_token_url="https://oauth2.googleapis.com/token",
    client_kwargs={"scope": "openid email profile"},
)

# Facebook OAuth Configuration
oauth.register(
    name="facebook",
    client_id=os.getenv("FACEBOOK_CLIENT_ID"),
    client_secret=os.getenv("FACEBOOK_CLIENT_SECRET"),
    authorize_url="https://www.facebook.com/v12.0/dialog/oauth",
    access_token_url="https://graph.facebook.com/v12.0/oauth/access_token",
    client_kwargs={"scope": "public_profile email"},
)

# GitHub OAuth Configuration
oauth.register(
    name="github",
    client_id=os.getenv("GITHUB_CLIENT_ID"),
    client_secret=os.getenv("GITHUB_CLIENT_SECRET"),
    authorize_url="https://github.com/login/oauth/authorize",
    access_token_url="https://github.com/login/oauth/access_token",
    client_kwargs={"scope": "user:email"},
)

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")  
ALGORITHM = "HS256"

@router.post("/register/")
async def register_user(request: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == request.email).first()

# Debugging output
    if existing_user:
        print(f"DEBUG: Email {request.email} already exists in the database: {existing_user}")
    else:
        print(f"DEBUG: Email {request.email} is NOT found in the database.")

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")


    hashed_password = hash_password(request.password)
    new_user = User(username=request.username, email=request.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}

@router.post("/login")
async def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user or not user.verify_password(password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token_data = {"id": user.id, "sub": user.email}
    access_token = create_access_token(token_data)
    return {"token": access_token}

@router.get("/login/{provider}")
async def login_provider(request: Request, provider: str):
    """OAuth login for Google, Facebook, GitHub"""
    if provider not in ["google", "facebook", "github"]:
        raise HTTPException(status_code=400, detail="Unsupported provider")
    redirect_uri = request.url_for("auth_provider", provider=provider)
    return await oauth.create_client(provider).authorize_redirect(request, redirect_uri)

@router.get("/{provider}")
async def auth_provider(request: Request, provider: str):
    """OAuth authentication callback"""
    client = oauth.create_client(provider)
    token = await client.authorize_access_token(request)
    user = await client.parse_id_token(request, token) if provider == "google" else token
    return {"provider": provider, "user": user}

@router.get("/protected/")
async def protected_route(token: str = Security(oauth2_scheme)):
    """A protected route that requires authentication"""
    user_data = decode_access_token(token)
    return {"message": f"Hello, {user_data['sub']}!"}

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user
