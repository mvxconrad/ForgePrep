import io
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import fitz  # PyMuPDF
from tempfile import SpooledTemporaryFile

from database.database import get_db
from app.models.models import File as FileModel, User
from app.routes.auth import get_current_user_from_cookie
from app.services.file_handler import save_and_scan_file

router = APIRouter()

# ------------------ UTILITY FUNCTIONS ------------------ #

async def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract readable text from PDF bytes using PyMuPDF."""
    pdf = fitz.open(stream=file_bytes, filetype="pdf")
    text = "".join(page.get_text() for page in pdf)
    pdf.close()
    return text

async def is_valid_pdf(file: UploadFile) -> bool:
    """Check if the uploaded file is a valid PDF based on header."""
    header = await file.read(4)
    await file.seek(0)
    return header == b"%PDF"

# ------------------ ROUTES ------------------ #

@router.get("/")
async def list_files(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_from_cookie),
):
    """Return all files uploaded by the current user."""
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
    """Directly upload PDF (for testing, no virus scan)."""
    if (
        not file.filename.lower().endswith(".pdf")
        or file.content_type != "application/pdf"
        or not await is_valid_pdf(file)
    ):
        raise HTTPException(status_code=400, detail="Only valid PDF files are allowed.")

    file_data = await file.read()
    extracted_text = await extract_text_from_pdf(file_data)

    db_file = FileModel(
        filename=file.filename,
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
    """Upload a PDF after AV scan and extract text (safely reads stream once)."""
    if (
        not file.filename.lower().endswith(".pdf")
        or file.content_type != "application/pdf"
        or not await is_valid_pdf(file)
    ):
        raise HTTPException(status_code=400, detail="Only valid PDF files are allowed.")

    # STEP 1: Read the file once
    file_data = await file.read()
    if not file_data:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # STEP 2: Run virus scan using a file-like buffer
    try:
        with SpooledTemporaryFile() as temp:
            temp.write(file_data)
            temp.seek(0)
            scan_result = save_and_scan_file(temp, filename=file.filename)
            if scan_result == "infected":
                raise HTTPException(status_code=400, detail="File is infected and was removed.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Virus scan failed: {str(e)}")

    # STEP 3: Extract text from the original in-memory stream
    try:
        extracted_text = await extract_text_from_pdf(file_data)
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to extract text from PDF.")

    # STEP 4: Save the file
    db_file = FileModel(
        filename=file.filename,
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
    """Download a previously uploaded file by ID."""
    db_file = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")

    return StreamingResponse(
        io.BytesIO(db_file.content),
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename={db_file.filename}"}
    )