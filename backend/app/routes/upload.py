# Desc: File upload route for FastAPI app

from fastapi import APIRouter, File, UploadFile, HTTPException
from app.services.file_handler import save_and_scan_file, insert_file_to_db

router = APIRouter()

@router.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    file_status = save_and_scan_file(file)

    if file_status == "infected":
        raise HTTPException(status_code=400, detail="⚠️ File is infected and was removed!")

    if insert_file_to_db(file_status):
        return {"message": f"✅ {file.filename} uploaded successfully!"}
    
    raise HTTPException(status_code=500, detail="❌ File upload failed.")
