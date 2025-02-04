from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Load database credentials from environment variables
DATABASE_URL = os.getenv(
    "DATABASE_URL",
<<<<<<< Updated upstream
    ""#Change to database URL
=======
    "postgresql://Administrator:StrongPassword123@rds-instance-name.aws-region.rds.amazonaws.com:5432/mydatabase
    "
>>>>>>> Stashed changes
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
