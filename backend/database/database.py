from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Load database credentials from environment variables
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:DevilDawg2021%40@localhost:5432/forgeprep"
)

# Create the SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# Create a sessionmaker factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for ORM models
Base = declarative_base()

# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
