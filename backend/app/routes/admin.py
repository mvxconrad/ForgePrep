from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.models import User, StudySet, File
from app.dependencies.auth import get_current_user_from_cookie
from database.database import get_db

router = APIRouter()

@router.get("/admin/data")
async def get_admin_data(user=Depends(decode_access_token), db: Session = Depends(get_db)):
    """
    Retrieve admin data including users, study sets, and files.
    """
    # Check if the user is an admin
    if not user.get("is_admin", False):
        raise HTTPException(status_code=403, detail="Access forbidden: Admins only")

    # Fetch data
    users = db.query(User).all()
    study_sets = db.query(StudySet).all()
    files = db.query(File).all()

    # Format the data
    return {
        "users": [{"id": u.id, "username": u.username, "email": u.email} for u in users],
        "studySets": [{"id": s.id, "title": s.title, "description": s.description} for s in study_sets],
        "files": [{"id": f.id, "filename": f.filename, "uploaded_at": f.uploaded_at} for f in files],
    }