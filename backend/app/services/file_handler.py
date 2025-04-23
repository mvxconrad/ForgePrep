import os
import uuid
import psycopg2
from dotenv import load_dotenv
from urllib.parse import urlparse
from app.services.antivirus import scan_file

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

# Upload directory (local disk for scanned files)
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


def save_and_scan_file(file_stream, filename: str) -> str:
    """
    Saves file from an in-memory stream (like SpooledTemporaryFile),
    scans it with ClamAV, and returns the file path if clean.
    """
    file_path = os.path.join(UPLOAD_DIR, filename)

    try:
        # Save the stream to disk
        with open(file_path, "wb") as f:
            f.write(file_stream.read())
    except Exception as e:
        raise Exception(f"Failed to write file to disk: {e}")

    # Run ClamAV scan
    if not scan_file(file_path):  # ❌ Infected
        os.remove(file_path)
        return "infected"

    return file_path  # ✅ Clean


def insert_file_to_db(file_path: str) -> bool:
    """
    Inserts a clean file into PostgreSQL using psycopg2.
    After insertion, deletes the file from disk.
    """
    try:
        with open(file_path, "rb") as f:
            file_data = f.read()

        filename = os.path.basename(file_path)

        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO uploaded_files (filename, file_data) VALUES (%s, %s)",
            (filename, file_data),
        )
        conn.commit()
        cur.close()
        conn.close()

        os.remove(file_path)  # Cleanup after DB insert
        return True

    except Exception as e:
        print(f"❌ Database error: {e}")
        return False
