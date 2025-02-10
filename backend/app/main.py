import os
from dotenv import load_dotenv

from fastapi import APIRouter
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database.database import get_db
from user import User
from enum import Enum


# For OAuth2 password hashing
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from authlib.integrations.starlette_client import OAuth
from starlette.requests import Request

# Load environment variables from a .env file
load_dotenv()

# Initialize router
app = FastAPI()

# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# -------------------   Start OAuth2 Password Hashing   -------------------
# OAuth client setup
oauth = OAuth()
oauth.register(
    name='google',
    client_id="GOOGLE_CLIENT_ID",
    client_secret="GOOGLE_CLIENT_SECRET",
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    authorize_params=None,
    access_token_url="https://oauth2.googleapis.com/token",
    access_token_params=None,
    client_kwargs={"scope": "openid email profile"},
)

@app.get("/login/google")
async def login(request: Request):
    redirect_uri = request.url_for("auth_google")
    return await oauth.google.authorize_redirect(request, redirect_uri)

@app.get("/auth/google")
async def auth_google(request: Request):
    token = await oauth.google.authorize_access_token(request)
    user = await oauth.google.parse_id_token(request, token)
    return {"user": user}

#-------------------   End OAuth2 Password Hashing   -------------------

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

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


@app.get("/")
async def root():
    return {"message": "hello from get"}

@app.post("/")
async def root():
    return {"message": "hello from post"}

@app.put("/")
async def root():
    return {"message": "hello from put"}

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

@app.get("/users/{user_id}/profile")
async def get_user_profile(user_id: int):
    return {"user_id": user_id}

@app.get("/users/{user_id}/sets")
async def get_user_sets(user_id: int):
    return {"user_id": user_id}

@app.get("/users/{user_id}/sets/{set_id}")
async def get_user_set(user_id: int, set_id: int):
    return {"user_id": user_id, "set_id": set_id}