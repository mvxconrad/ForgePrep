from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.models.models import User, StudySet, File
from app.routes.auth import get_current_user_from_cookie
from database.database import get_db
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/admin/data")
async def get_admin_data(
    current_user: User = Depends(get_current_user_from_cookie), 
    db: Session = Depends(get_db),
    page: int = Query(1, alias="page", ge=1),  # Page number (default = 1)
    page_size: int = Query(10, alias="page_size", ge=1, le=100)  # Items per page (default = 10)
):
    # Check if the user is authenticated and is an admin
    if not current_user:
        raise HTTPException(status_code=401, detail="User not authenticated.")
    if not getattr(current_user, "is_admin", False):
        raise HTTPException(status_code=403, detail="Access forbidden: Admins only")

    # Try to connect to the database
    try:
        db.query(User).first()  # Simple query to check DB connectivity
    except Exception as e:
        raise HTTPException(status_code=500, detail="Database connection failed: " + str(e))

    # Pagination logic
    offset = (page - 1) * page_size

    # Query the data with pagination
    try:
        users = db.query(User).offset(offset).limit(page_size).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error fetching users: " + str(e))

    try:
        study_sets = db.query(StudySet).offset(offset).limit(page_size).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error fetching study sets: " + str(e))
