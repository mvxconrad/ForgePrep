import io
import os
import re
import fitz  # PyMuPDF
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from tempfile import SpooledTemporaryFile
from dotenv import load_dotenv

from database.database import get_db
from app.models.models import File as FileModel, User
from app.routes.auth import get_current_user_from_cookie
from app.services.antivirus import scan_file  # Uses subprocess to run ClamAV

load_dotenv()
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

router = APIRouter()

# ------------------ Utility Functions ------------------ #

def sanitize_filename(filename: str) -> str:
    """Sanitize uploaded filename to avoid filesystem issues."""
    return re.sub(r'[^a-zA-Z0-9_.-]', '_', filename)

async def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract readable text from PDF bytes using PyMuPDF."""
    pdf = fitz.open(stream=file_bytes, filetype="pdf")
    text = "".join(page.get_text() for page in pdf)
    pdf.close()
    return text

async def is_valid_pdf(file: UploadFile) -> bool:
    """Check for %PDF header."""
    header = await file.read(4)
    await file.seek(0)
    return header == b"%PDF"

def save_and_scan_file(filelike, filename: str) -> str:
    """
    Saves a file-like object to disk, runs a ClamAV scan, and returns file path if clean.
    Returns 'infected' if virus is found.
    """
    filepath = os.path.join(UPLOAD_DIR, filename)
    try:
        filelike.seek(0)
        with open(filepath, "wb") as f:
            f.write(filelike.read())
        filelike.seek(0)

        if not scan_file(filepath):
            os.remove(filepath)
            return "infected"
        return filepath
    except Exception as e:
        raise RuntimeError(f"Scan failed: {str(e)}")

# ------------------ Routes ------------------ #

@router.get("/")
async def list_files(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_from_cookie),
):
    files = db.query(FileModel).filter(FileModel.user_id == current_user.id).all()
    return [
        {
            "file_id": f.id,
            "filename": f.filename,
            "uploadedAt": f.created_at,
            "size": len(f.content) / 1024  # KB
        }
        for f in files
    ]


@router.post("/upload/raw/")
async def upload_raw(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_from_cookie),
):
    if (
        not file.filename.lower().endswith(".pdf")
        or file.content_type != "application/pdf"
        or not await is_valid_pdf(file)
    ):
        raise HTTPException(status_code=400, detail="Only valid PDF files are allowed.")

    file_data = await file.read()
    extracted_text = await extract_text_from_pdf(file_data)

    db_file = FileModel(
        filename=sanitize_filename(file.filename),
        content=file_data,
        extracted_text=extracted_text,
        user_id=current_user.id
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)

    return {
        "message": "File uploaded successfully",
        "file_id": db_file.id,
        "extracted_text": extracted_text[:1000]
    }


@router.post("/upload/scan/")
async def upload_scanned(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_from_cookie),
):
    if (
        not file.filename.lower().endswith(".pdf")
        or file.content_type != "application/pdf"
        or not await is_valid_pdf(file)
    ):
        raise HTTPException(status_code=400, detail="Only valid PDF files are allowed.")

    file_data = await file.read()
    if not file_data:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        with SpooledTemporaryFile() as temp:
            temp.write(file_data)
            temp.seek(0)
            scan_result = save_and_scan_file(temp, filename=sanitize_filename(file.filename))
            if scan_result == "infected":
                raise HTTPException(status_code=400, detail="File is infected and was removed.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Virus scan failed: {str(e)}")

    try:
        extracted_text = await extract_text_from_pdf(file_data)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to extract text from PDF.")

    db_file = FileModel(
        filename=sanitize_filename(file.filename),
        content=file_data,
        extracted_text=extracted_text,
        user_id=current_user.id
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)

    return {
        "message": f"{file.filename} uploaded and scanned successfully!",
        "file_id": db_file.id,
        "extracted_text": extracted_text[:1000]
    }


@router.get("/download/{file_id}")
async def download_file(
    file_id: int,
    db: Session = Depends(get_db),
):
    db_file = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")

    return StreamingResponse(
        io.BytesIO(db_file.content),
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename={db_file.filename}"}
    )
