# Description: File handling service for saving, scanning, and inserting files into PostgreSQL.
# The service saves the uploaded file, scans it with ClamAV, and inserts it into the database if it is clean.

import os
import psycopg2
from dotenv import load_dotenv
from app.services.antivirus import scan_file
from urllib.parse import urlparse

# Load environment variables
load_dotenv()
db_url = os.getenv("DATABASE_URL")
parsed_url = urlparse(db_url)

# PostgreSQL connection config
DB_CONFIG = {
    "dbname": parsed_url.path.lstrip("/"),
    "user": parsed_url.username,
    "password": parsed_url.password,
    "host": parsed_url.hostname,
    "port": parsed_url.port,
}

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

def save_and_scan_file(uploaded_file) -> str:
    """Saves file, scans with ClamAV, and returns status."""
    file_path = os.path.join(UPLOAD_DIR, uploaded_file.filename)

    with open(file_path, "wb") as f:
        f.write(uploaded_file.file.read())

    if not scan_file(file_path):  # If file is infected
        os.remove(file_path)
        return "infected"

    return file_path  # Return valid file path

def insert_file_to_db(file_path: str) -> bool:
    """Insert a clean file into PostgreSQL."""
    try:
        with open(file_path, "rb") as f:
            file_data = f.read()

        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO uploaded_files (filename, file_data) VALUES (%s, %s)",
            (os.path.basename(file_path), file_data),
        )
        conn.commit()
        cur.close()
        conn.close()
        os.remove(file_path)  # Delete file after inserting into DB
        return True
    except Exception as e:
        print(f"❌ Database error: {e}")
        return False
