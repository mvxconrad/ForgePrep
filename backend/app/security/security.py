import jwt
import os
from datetime import datetime, timedelta
from passlib.context import CryptContext
from fastapi import HTTPException

# Load environment variables (SECRET_KEY should be stored securely)
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")  
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60  # Token expires in 60 minutes

# Password hashing context (bcrypt)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hashes a password using bcrypt"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against a hashed password"""
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)):
    """Creates a JWT access token"""
    to_encode = data.copy()
    
    # Ensure that expires_delta is a timedelta
    expire = datetime.utcnow() + expires_delta  
    to_encode.update({"exp": expire})

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str):
    """Decodes and verifies a JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
