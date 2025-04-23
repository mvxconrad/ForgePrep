import io
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import fitz  # PyMuPDF

from database.database import get_db
from app.models.models import File as FileModel, User
from app.routes.auth import get_current_user_from_cookie
from app.services.file_handler import save_and_scan_file

router = APIRouter()

# ------------------ UTILITY ------------------ #

async def extract_text_from_pdf(file: UploadFile) -> str:
    """Extract text from uploaded PDF file using PyMuPDF."""
    contents = await file.read()
    await file.seek(0)
    pdf = fitz.open(stream=contents, filetype="pdf")
    text = ""
    for page in pdf:
        text += page.get_text()
    pdf.close()
    return text


async def is_valid_pdf(file: UploadFile) -> bool:
    """Ensure the uploaded file has a valid PDF header."""
    header = await file.read(4)
    await file.seek(0)
    return header == b"%PDF"

# ------------------ ROUTES ------------------ #

@router.get("/")
async def list_files(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_from_cookie),
):
    """List files uploaded by the current user."""
    files = db.query(FileModel).filter(FileModel.user_id == current_user.id).all()
    return [
        {
            "file_id": f.id,
            "filename": f.filename,
            "uploadedAt": f.created_at,
            "size": len(f.content) / 1024,  # KB
        }
        for f in files
    ]


@router.post("/upload/raw/")
async def upload_raw(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_from_cookie),
):
    """Upload a raw PDF file (no scan, dev only)."""
    if (
        not file.filename.lower().endswith(".pdf")
        or file.content_type != "application/pdf"
        or not await is_valid_pdf(file)
    ):
        raise HTTPException(status_code=400, detail="Only valid PDF files are allowed.")

    file_data = await file.read()
    await file.seek(0)
    extracted_text = await extract_text_from_pdf(file)

    new_file = FileModel(
        filename=file.filename,
        content=file_data,
        extracted_text=extracted_text,
        user_id=current_user.id
    )
    db.add(new_file)
    db.commit()
    db.refresh(new_file)

    return {
        "message": "File uploaded successfully",
        "file_id": new_file.id,
        "extracted_text": extracted_text[:1000]
    }


@router.post("/upload/scan/")
async def upload_scanned(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_from_cookie),
):
    """Upload a scanned and validated PDF (production safe)."""
    if (
        not file.filename.lower().endswith(".pdf")
        or file.content_type != "application/pdf"
        or not await is_valid_pdf(file)
    ):
        raise HTTPException(status_code=400, detail="Only valid PDF files are allowed.")

    try:
        scan_result = save_and_scan_file(file)
        if scan_result == "infected":
            raise HTTPException(status_code=400, detail="File is infected and was removed.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Virus scan failed: {str(e)}")

    extracted_text = await extract_text_from_pdf(file)
    file_data = await file.read()

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
    """Download a file from the database by ID."""
    db_file = db.query(FileModel).filter(FileModel.id == file_id).first()
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")

    return StreamingResponse(
        io.BytesIO(db_file.content),
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename={db_file.filename}"}
    )
