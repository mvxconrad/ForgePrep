import os
import io
from datetime import datetime, timedelta
from enum import Enum
from dotenv import load_dotenv

from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.security import OAuth2PasswordBearer
from pydantic import EmailStr
from pydantic import BaseModel
from sqlalchemy.orm import Session
from authlib.integrations.starlette_client import OAuth
from starlette.requests import Request

from database.database import get_db
from app.models.models import User, StudySet, Flashcard, UserProgress
from app.models.models import File as FileModel
from app.models.schemas import RegisterRequest
from app.security import verify_password, create_access_token, decode_access_token, hash_password

# Load environment variables
ROOT_PATH = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
dotenv_path = os.path.join(ROOT_PATH, "config", ".env")
load_dotenv(dotenv_path)

# Initialize FastAPI
app = FastAPI()

# CORS Middleware (Allow frontend requests)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development (restrict in production)
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)

# OAuth Setup
oauth = OAuth()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Google OAuth Configuration
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

@app.get("/login/{provider}")
async def login_provider(request: Request, provider: str):
    """OAuth login for Google, Facebook, GitHub"""
    if provider not in ["google", "facebook", "github"]:
        raise HTTPException(status_code=400, detail="Unsupported provider")
    redirect_uri = request.url_for("auth_provider", provider=provider)
    return await oauth.create_client(provider).authorize_redirect(request, redirect_uri)

@app.get("/auth/{provider}")
async def auth_provider(request: Request, provider: str):
    """OAuth authentication callback"""
    client = oauth.create_client(provider)
    token = await client.authorize_access_token(request)
    user = await client.parse_id_token(request, token) if provider == "google" else token
    return {"provider": provider, "user": user}

# -------------------   User Authentication Routes   -------------------

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str

@app.post("/register/")
async def register_user(request: RegisterRequest, db: Session = Depends(get_db)):
    """Handles user registration"""
    if db.query(User).filter(User.email == request.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    if db.query(User).filter(User.username == request.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")

    try:
        #  Hash the password securely
        hashed_password = hash_password(request.password)

        #  Create new user
        new_user = User(
            username=request.username,
            email=request.email,
            hashed_password=hashed_password
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return {"message": "User registered successfully", "user_id": new_user.id}

    except Exception as e:
        db.rollback()  # Rollback on failure
        raise HTTPException(status_code=500, detail="Internal server error")


@app.post("/login/")
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Handles user login and returns a JWT token"""
    user = db.query(User).filter(User.email == request.email).first()

    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user.email}, expires_delta=timedelta(days=1))

    response = JSONResponse(content={"message": "Login successful", "token": access_token})
    response.set_cookie(key="access_token", value=access_token, httponly=True)
    return response

@app.get("/protected/")
async def protected_route(token: str = Security(oauth2_scheme)):
    """A protected route that requires authentication"""
    user_data = decode_access_token(token)
    return {"message": f"Hello, {user_data['sub']}!"}

# -------------------   Study Sets and Flashcards   -------------------

@app.post("/study_sets/")
async def create_study_set(title: str, description: str, token: str = Security(oauth2_scheme), db: Session = Depends(get_db)):
    """Create a new study set"""
    user_data = decode_access_token(token)
    user = db.query(User).filter(User.email == user_data["sub"]).first()

    new_set = StudySet(title=title, description=description, user_id=user.id)
    db.add(new_set)
    db.commit()
    db.refresh(new_set)
    return new_set

@app.get("/study_sets/")
async def get_study_sets(db: Session = Depends(get_db)):
    """Get all study sets"""
    return db.query(StudySet).all()

# -------------------   File Upload & Retrieval   -------------------

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload a file"""
    file_data = await file.read()

    db_file = FileModel(filename=file.filename, content=file_data)
    db.add(db_file)
    db.commit()
    db.refresh(db_file)

    return {"message": "File uploaded successfully", "file_id": db_file.id}

@app.get("/files/{file_id}")
async def get_file(file_id: int, db: Session = Depends(get_db)):
    """Download a file"""
    file = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    return StreamingResponse(io.BytesIO(file.content), media_type="application/octet-stream",
                             headers={"Content-Disposition": f"attachment; filename={file.filename}"})

# -------------------   Utility Routes   -------------------

@app.get("/")
def root():
    """Health check"""
    return {"message": "API is running and connected to PostgreSQL!"}

@app.get("/dashboard/")
async def get_dashboard(token: str = Security(oauth2_scheme), db: Session = Depends(get_db)):
    """Retrieve user dashboard information"""
    user_data = decode_access_token(token)
    user = db.query(User).filter(User.email == user_data["sub"]).first()

    study_sets = db.query(StudySet).filter(StudySet.user_id == user.id).all()
    return {"user": user.username, "study_sets": study_sets}

# -------------------   Testing Routes   -------------------

@app.get("/items")
async def list_items(skip: int = 0, limit: int = 10):
    """Return fake item data"""
    fake_items_db = [{"item_name": "Foo"}, {"item_name": "Bar"}, {"item_name": "Baz"}]
    return fake_items_db[skip: skip + limit]

class FoodEnum(str, Enum):
    pizza = "pizza"
    burger = "burger"
    pasta = "pasta"

@app.get("/foods/{food_id}")
async def get_food(food_id: FoodEnum):
    """Returns info about food items"""
    if food_id == FoodEnum.pizza:
        return {"food": "pizza", "message": "Pizza is great"}

# -------------------   End FastAPI Optimization   -------------------

