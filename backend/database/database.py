import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables from /git/ForgePrep/config/.env
#dotenv_path = os.path.join(os.path.dirname(__file__), "config", ".env")

ROOT_PATH = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
dotenv_path = os.path.join(ROOT_PATH, "config", ".env")
load_dotenv(dotenv_path)

# Securely retrieve database URL
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in the environment variables.")

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
