import io
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from database.database import get_db
from app.models.models import File as FileModel

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
async def list_files(db: Session = Depends(get_db)):
    files = db.query(FileModel).all()
    return [
        {
            "file_id": f.id,
            "filename": f.filename,
            "uploadedAt": f.created_at,  # or whatever timestamp field
            "size": len(f.content) / 1024,
        }
        for f in files
    ]

@router.post("/upload/raw/")
async def upload_raw(file: UploadFile = File(...), db: Session = Depends(get_db)):
    data = await file.read()
    print(f"[DEBUG] Uploading file: {file.filename}, size: {len(data)} bytes")

    db_file = FileModel(filename=file.filename, content=data)
    db.add(db_file)
    db.commit()
    db.refresh(db_file)

    print(f"[DEBUG] File saved with ID: {db_file.id}")
    return {"message": "File uploaded successfully", "file_id": db_file.id}


@router.post("/upload/scan/")
async def upload_scanned(file: UploadFile = File(...)):
    """
    Upload a file, scan it for viruses, then store it via your file_handler service.
    """
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
