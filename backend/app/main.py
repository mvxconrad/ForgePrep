import os
from dotenv import load_dotenv
import jwt
import datetime

from sqlalchemy.orm import Session
from pydantic import BaseModel
from database.database import get_db
from models import User, StudySet, Flashcard
from models import File as FileModel
from enum import Enum

# For OAuth2 password hashing
from fastapi import Security, APIRouter,FastAPI, Depends, HTTPException, status, File, UploadFile
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import StreamingResponse
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from authlib.integrations.starlette_client import OAuth
from starlette.requests import Request

from security import verify_password, create_access_token, decode_access_token, hash_password

# Load environment variables from a .env file
dotenv_path = os.path.join(os.path.dirname(__file__), "config", ".env")
load_dotenv(dotenv_path)

# Initialize router
app = FastAPI()

# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# -------------------   Start OAuth2 Password Management   -------------------

# OAuth client setup
oauth = OAuth()

# OAuth2 token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Register Google OAuth
oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    access_token_url="https://oauth2.googleapis.com/token",
    client_kwargs={"scope": "openid email profile"},
)

# Register Facebook OAuth
oauth.register(
    name="facebook",
    client_id=os.getenv("FACEBOOK_CLIENT_ID"),
    client_secret=os.getenv("FACEBOOK_CLIENT_SECRET"),
    authorize_url="https://www.facebook.com/v12.0/dialog/oauth",
    access_token_url="https://graph.facebook.com/v12.0/oauth/access_token",
    client_kwargs={"scope": "email"},
)

# Register GitHub OAuth
oauth.register(
    name="github",
    client_id=os.getenv("GITHUB_CLIENT_ID"),
    client_secret=os.getenv("GITHUB_CLIENT_SECRET"),
    authorize_url="https://github.com/login/oauth/authorize",
    access_token_url="https://github.com/login/oauth/access_token",
    client_kwargs={"scope": "user:email"},
)

# Unified login route for different providers
@app.get("/login/{provider}")
async def login(request: Request, provider: str):
    if provider not in ["google", "facebook", "github"]:
        return {"error": "Unsupported provider"}
    redirect_uri = request.url_for(f"auth_{provider}")
    return await oauth.create_client(provider).authorize_redirect(request, redirect_uri)

# Unified authentication route for different providers
@app.get("/auth/{provider}")
async def auth_provider(request: Request, provider: str):
    if provider not in ["google", "facebook", "github"]:
        return {"error": "Unsupported provider"}
    
    client = oauth.create_client(provider)
    token = await client.authorize_access_token(request)
    
    if provider == "google":
        user = await client.parse_id_token(request, token)
    elif provider == "facebook":
        resp = await client.get("https://graph.facebook.com/me?fields=id,name,email", token=token)
        user = resp.json()
    elif provider == "github":
        resp = await client.get("https://api.github.com/user", token=token)
        user = resp.json()
    
    return {"provider": provider, "user": user}

# -------------------   End OAuth2 Password Management   -------------------
# ------------------- Start DB Password Management -------------------


# ------------------- End DB Password Management -------------------

# User Registration Route
@app.post("/register/")
async def register_user(username: str, email: str, password: str, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(username=username, email=email, hashed_password=hash_password(password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}

# User Login Route (Returns JWT)
@app.post("/login/")
async def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Generate JWT token
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

# Protected Route (Requires JWT)
@app.get("/protected/")
async def protected_route(token: str = Security(oauth2_scheme)):
    user_data = decode_access_token(token)
    return {"message": f"Hello, {user_data['sub']}!"}

# Create Study Set Route (Protected)
@app.post("/study_sets/")
async def create_study_set(title: str, description: str, token: str = Security(oauth2_scheme), db: Session = Depends(get_db)):
    user_data = decode_access_token(token)
    user = db.query(User).filter(User.email == user_data["sub"]).first()

    new_set = StudySet(title=title, description=description, user_id=user.id)
    db.add(new_set)
    db.commit()
    db.refresh(new_set)
    return new_set

# Get All Study Sets
@app.get("/study_sets/")
async def get_study_sets(db: Session = Depends(get_db)):
    return db.query(StudySet).all()

# Add Flashcard to Study Set (Protected)
@app.post("/study_sets/{set_id}/flashcards/")
async def add_flashcard(set_id: int, question: str, answer: str, token: str = Security(oauth2_scheme), db: Session = Depends(get_db)):
    user_data = decode_access_token(token)
    user = db.query(User).filter(User.email == user_data["sub"]).first()
    
    study_set = db.query(StudySet).filter(StudySet.id == set_id, StudySet.user_id == user.id).first()
    if not study_set:
        raise HTTPException(status_code=404, detail="Study set not found")

    new_card = Flashcard(question=question, answer=answer, set_id=set_id)
    db.add(new_card)
    db.commit()
    db.refresh(new_card)
    return new_card

# For uploading files
@app.post("/upload/")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    file_data = await file.read()  # Read the file as binary

    db_file = FileModel(filename=file.filename, content=file_data)
    db.add(db_file)
    db.commit()
    db.refresh(db_file)

    return {"message": "File uploaded successfully", "file_id": db_file.id}

# For downloading files
@app.get("/files/{file_id}")
async def get_file(file_id: int, db: Session = Depends(get_db)):
    file = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not file:
        return {"error": "File not found"}

    return StreamingResponse(io.BytesIO(file.content), media_type="application/octet-stream",
                             headers={"Content-Disposition": f"attachment; filename={file.filename}"})

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
    return db.query(User).all()

@app.post("/users/")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    hashed_password = hash_password(user.password)
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
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


@app.get("/users/{user_id}/profile")
async def get_user_profile(user_id: int):
    return {"user_id": user_id}

@app.get("/users/{user_id}/sets")
async def get_user_sets(user_id: int):
    return {"user_id": user_id}

@app.get("/users/{user_id}/sets/{set_id}")
async def get_user_set(user_id: int, set_id: int):
    return {"user_id": user_id, "set_id": set_id}

# -------------------   Start FastAPI Testing   -------------------

@app.get("/")
async def root():
    return {"message": "hello from get"}

@app.post("/")
async def root():
    return {"message": "hello from post"}

@app.put("/")
async def root():
    return {"message": "hello from put"}

@app.post("/register/")
async def register_user(username: str, email: str, password: str, db: Session = Depends(get_db)):
    # Check if user exists
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash password and create user
    new_user = User(username=username, email=email, hashed_password=hash_password(password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}

@app.get("/users")
async def list_users():
    return {"message": "list users route"}

@app.get("/users/me")
async def get_me():
    return {"message": "this is the current user"}

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    return {"message": f"get user {user_id}"}

class FoodEnum(str, Enum):
    pizza = "pizza"
    burger = "burger"
    pasta = "pasta"

@app.get("/foods/{food_id}")
async def get_food(food_id: FoodEnum):
    if food_id == FoodEnum.pizza:
        return {"food": "pizza",
                "message": "Pizza is great"}

fake_items_db = [{"item_name": "Foo"}, {"item_name": "Bar"}, {"item_name": "Baz"}]

@app.get("/items")
async def list_items(skip: int = 0, limit: int = 10):
    return fake_items_db[skip: skip + limit]

@app.get("/items/{item_id}")
async def get_item(item_id: str, sample_query_param: str, q: str | None = None, short: bool = False):
    item = {"item_id": item_id, "sample_query_param": sample_query_param}
    if q:
        item.update({"q": q})
    if not short:
        item.update(
            {"description": "This is an amazing item that has a long description"}
        )
    return item

@app.get("/users/{user_id}/items/{item_id}")
async def get_user_item(user_id: int, item_id: str, q: str | None = None, short: bool = False):
    item = {"item_id": item_id, "owner_id": user_id}
    if q:
        item.update({"q": q})
    if not short:
        item.update(
            {"description": "This is an amazing item that has a long description"}
        )
    return item

# -------------------   End FastAPI Testing   -------------------
