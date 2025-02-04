from fastapi import FastAPI
from app.routers import users
from database.database import Base, engine

# Initialize FastAPI app
app = FastAPI()

# Create database tables
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(users.router)

