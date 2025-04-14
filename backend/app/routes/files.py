import io
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from database.database import get_db
from app.models.models import File as FileModel
from app.models.models import User
from app.routes.auth import get_current_user

router = APIRouter()

import io
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from database.database import get_db
from app.models.models import File as FileModel
from app.services.file_handler import save_and_scan_file, insert_file_to_db

router = APIRouter()

@router.get("/")
async def list_files(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),  # Get the current user from the request
):
    # Query files only for the current user
    files = db.query(FileModel).filter(FileModel.user_id == current_user.id).all()
    return [
        {
            "file_id": f.id,
            "filename": f.filename,
            "uploadedAt": f.created_at,
            "size": len(f.content) / 1024,  # Size in KB
        }
        for f in files
    ]

@router.post("/upload/raw/")
async def upload_raw(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Check if the uploaded file is a PDF
    if not file.filename.lower().endswith(".pdf") or file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    data = await file.read()
    db_file = FileModel(
        filename=file.filename,
        content=data,
        user_id=current_user.id
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return {"message": "File uploaded successfully", "file_id": db_file.id}

@router.post("/upload/scan/")
async def upload_scanned(file: UploadFile = File(...)):
    # Check if the uploaded file is a PDF
    if not file.filename.lower().endswith(".pdf") or file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    status = save_and_scan_file(file)
    if status == "infected":
        raise HTTPException(status_code=400, detail="⚠️ File is infected and was removed!")

    success = insert_file_to_db(status)
    if success:
        return {"message": f"✅ {file.filename} uploaded successfully!"}
    else:
        raise HTTPException(status_code=500, detail="❌ File upload failed.")

@router.get("/download/{file_id}")
async def download_file(
    file_id: int,
    db: Session = Depends(get_db),
):
    """
    Download a file from the database by its ID.
    """
    db_file = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")

    return StreamingResponse(
        io.BytesIO(db_file.content),
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename={db_file.filename}"},
    )
