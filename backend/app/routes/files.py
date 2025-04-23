import io
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import fitz  # PyMuPDF
from database.database import get_db
from app.models.models import File as FileModel, User
from app.routes.auth import get_current_user_from_cookie
from app.services.file_handler import save_and_scan_file, insert_file_to_db

router = APIRouter()

# Extract text from a clean PDF
async def extract_text_from_pdf(file: UploadFile) -> str:
    contents = await file.read()
    await file.seek(0)
    pdf = fitz.open(stream=contents, filetype="pdf")
    text = ""
    for page in pdf:
        text += page.get_text()
    pdf.close()
    return text

# Helper function to verify actual PDF content
async def is_valid_pdf(file: UploadFile) -> bool:
    header = await file.read(4)
    await file.seek(0)  # Reset pointer after reading
    return header == b"%PDF"


@router.get("/")
async def list_files(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_from_cookie),
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


@router.post("/upload/raw/") # Only for testing purposes, not for production use
async def upload_raw(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_from_cookie),
):
    # Validate the file type and ensure it's a valid PDF
    if (
        not file.filename.lower().endswith(".pdf")
        or file.content_type != "application/pdf"
        or not await is_valid_pdf(file)
    ):
        raise HTTPException(status_code=400, detail="Only valid PDF files are allowed.")

    # Extract text from the PDF
    extracted_text = await extract_text_from_pdf(file)

    # Store the file and extracted text in the database
    file_data = await file.read()
    db_file = FileModel(
        filename=file.filename,
        content=file_data,
        extracted_text=extracted_text,  # Store the extracted text
        user_id=current_user.id
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)

    return {
        "message": "File uploaded successfully",
        "file_id": db_file.id,
        "extracted_text": extracted_text[:1000]  # Preview of the extracted text
    }


@router.post("/upload/scan/") # Use in production for scanning and uploading files
async def upload_scanned(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_from_cookie),
):
    # Validate file is actually a PDF
    if (
        not file.filename.lower().endswith(".pdf")
        or file.content_type != "application/pdf"
        or not await is_valid_pdf(file)
    ):
        raise HTTPException(status_code=400, detail="Only valid PDF files are allowed.")

    # Scan the file with your AV logic (ClamAV or similar)
    status = save_and_scan_file(file)
    if status == "infected":
        raise HTTPException(status_code=400, detail="File is infected and was removed!")

    # Extract text after the clean scan
    extracted_text = await extract_text_from_pdf(file)

    # Store the file and extracted text
    file_data = await file.read()
    db_file = FileModel(
        filename=file.filename,
        content=file_data,
        extracted_text=extracted_text,  # Store the extracted text
        user_id=current_user.id
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)

    return {
        "message": f"{file.filename} uploaded and scanned successfully!",
        "file_id": db_file.id,
        "extracted_text": extracted_text[:1000]  # Preview of the extracted text
    }


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
