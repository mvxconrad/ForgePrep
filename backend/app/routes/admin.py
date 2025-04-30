from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.models import User, StudySet, File
from app.routes.auth import get_current_user_from_cookie
from database.database import get_db
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/admin/data")
async def get_admin_data(
    current_user: User = Depends(get_current_user_from_cookie), db: Session = Depends(get_db)
):
    """
    Retrieve admin data including users, study sets, and files.
    """
    if not getattr(current_user, "is_admin", False):
        raise HTTPException(status_code=403, detail="Access forbidden: Admins only")

    users = db.query(User).all()
    study_sets = db.query(StudySet).all()
    files = db.query(File).all()

    response_data = {
        "users": [{"id": u.id, "username": u.username, "email": u.email} for u in users],
        "studySets": [{"id": s.id, "title": s.title, "description": s.description} for s in study_sets],
        "files": [{"id": f.id, "filename": f.filename, "uploaded_at": f.uploaded_at} for f in files],
    }
    
    return JSONResponse(content=response_data, headers={"Cache-Control": "no-store, no-cache, must-revalidate"})

