from fastapi import FastAPI, Depends
# from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.context import CryptContext
# from database.database import engine, Base, get_db
# from app.models.models import User
from enum import Enum

# Initialize FastAPI app
app = FastAPI()

# Recreate database tables
# Base.metadata.create_all(bind=engine)

# Password hashing setup
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# def hash_password(password: str) -> str:
#     return pwd_context.hash(password)

# # Create database tables
# Base.metadata.create_all(bind=engine)

# # Pydantic schemas
# class UserCreate(BaseModel):
#     username: str
#     email: str
#     password: str

# class UserUpdate(BaseModel):
#     username: str = None
#     email: str = None

# API Endpoints


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


# @app.get("/users/")
# def get_users(db: Session = Depends(get_db)):
#     users = db.query(User).all()
#     return users

# @app.post("/users/")
# def create_user(user: UserCreate, db: Session = Depends(get_db)):
#     hashed_password = hash_password(user.password)
#     new_user = User(
#         username=user.username,
#         email=user.email,
#         password_hash=hashed_password
#     )
#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)
#     return new_user

# @app.get("/users/{user_id}")
# def get_user(user_id: int, db: Session = Depends(get_db)):
#     user = db.query(User).filter(User.id == user_id).first()
#     if not user:
#         return {"error": "User not found"}
#     return user

# @app.put("/users/{user_id}")
# def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
#     db_user = db.query(User).filter(User.id == user_id).first()
#     if not db_user:
#         return {"error": "User not found"}
#     if user.username:
#         db_user.username = user.username
#     if user.email:
#         db_user.email = user.email
#     db.commit()
#     db.refresh(db_user)
#     return db_user

# @app.delete("/users/{user_id}")
# def delete_user(user_id: int, db: Session = Depends(get_db)):
#     db_user = db.query(User).filter(User.id == user_id).first()
#     if not db_user:
#         return {"error": "User not found"}
#     db.delete(db_user)
#     db.commit()
#     return {"message": "User deleted successfully"}
