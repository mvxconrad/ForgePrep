from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.context import CryptContext
from database.database import get_db
from router.models.user import User
from enum import Enum

# Initialize router
router = APIRouter()

# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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

@router.get("/")
def root():
    return {"message": "API is running and connected to PostgreSQL!"}

@router.get("/users/")
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()

@router.post("/users/")
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

@router.get("/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"error": "User not found"}
    return user

@router.put("/users/{user_id}")
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


@router.get("/")
async def root():
    return {"message": "hello from get"}

@router.post("/")
async def root():
    return {"message": "hello from post"}

@router.put("/")
async def root():
    return {"message": "hello from put"}

@router.get("/users")
async def list_users():
    return {"message": "list users route"}

@router.get("/users/me")
async def get_me():
    return {"message": "this is the current user"}

@router.get("/users/{user_id}")
async def get_user(user_id: int):
    return {"message": f"get user {user_id}"}

class FoodEnum(str, Enum):
    pizza = "pizza"
    burger = "burger"
    pasta = "pasta"

@router.get("/foods/{food_id}")
async def get_food(food_id: FoodEnum):
    if food_id == FoodEnum.pizza:
        return {"food": "pizza",
                "message": "Pizza is great"}

fake_items_db = [{"item_name": "Foo"}, {"item_name": "Bar"}, {"item_name": "Baz"}]

@router.get("/items")
async def list_items(skip: int = 0, limit: int = 10):
    return fake_items_db[skip: skip + limit]

@router.get("/items/{item_id}")
async def get_item(item_id: str, sample_query_param: str, q: str | None = None, short: bool = False):
    item = {"item_id": item_id, "sample_query_param": sample_query_param}
    if q:
        item.update({"q": q})
    if not short:
        item.update(
            {"description": "This is an amazing item that has a long description"}
        )
    return item

@router.get("/users/{user_id}/items/{item_id}")
async def get_user_item(user_id: int, item_id: str, q: str | None = None, short: bool = False):
    item = {"item_id": item_id, "owner_id": user_id}
    if q:
        item.update({"q": q})
    if not short:
        item.update(
            {"description": "This is an amazing item that has a long description"}
        )
    return item

@router.get("/users/{user_id}/profile")
async def get_user_profile(user_id: int):
    return {"user_id": user_id}

@router.get("/users/{user_id}/sets")
async def get_user_sets(user_id: int):
    return {"user_id": user_id}

@router.get("/users/{user_id}/sets/{set_id}")
async def get_user_set(user_id: int, set_id: int):
    return {"user_id": user_id, "set_id": set_id}