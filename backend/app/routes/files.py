import io
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from database.database import get_db
from app.models.models import File as FileModel

router = APIRouter()

@router.post("/upload/")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload a file and store it in the database"""
    file_data = await file.read()

    db_file = FileModel(filename=file.filename, content=file_data)
    db.add(db_file)
    db.commit()
    db.refresh(db_file)

    return {"message": "File uploaded successfully", "file_id": db_file.id}

@router.get("/{file_id}")
async def get_file(file_id: int, db: Session = Depends(get_db)):
    """Download a file from the database"""
    file = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not file:
        raise HTTPException(status_code=404, detail="File not found")

    return StreamingResponse(
        io.BytesIO(file.content),
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename={file.filename}"}
    )
