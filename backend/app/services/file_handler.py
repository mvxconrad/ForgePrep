import os
import logging
import psycopg2
from dotenv import load_dotenv
from urllib.parse import urlparse
from app.services.antivirus import scan_file

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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

# Directory to store uploaded files temporarily
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


def save_and_scan_file(file_stream, filename: str) -> str:
    """
    Saves a file-like object (e.g., SpooledTemporaryFile) to disk,
    scans it with ClamAV, and returns the path if clean.

    Args:
        file_stream: File-like object (not UploadFile directly).
        filename (str): Original filename to use.

    Returns:
        str: Full file path if clean, or "infected" if detected.
    """
    file_path = os.path.join(UPLOAD_DIR, filename)
    try:
        logger.info(f"⏳ Writing file to disk: {file_path}")
        with open(file_path, "wb") as f:
            data = file_stream.read()
            f.write(data)
        file_stream.seek(0)

        logger.info(f"✅ File written: {filename} ({os.path.getsize(file_path)} bytes)")
    except Exception as e:
        logger.error(f"❌ Failed to write file: {e}")
        raise Exception(f"Failed to save file to disk: {e}")

    # Run ClamAV scan
    try:
        logger.info(f"🛡️ Scanning file: {file_path}")
        is_clean = scan_file(file_path)
    except Exception as e:
        logger.error(f"❌ Virus scanning failed: {e}")
        raise Exception(f"Virus scanning failed: {e}")

    if not is_clean:
        logger.warning(f"☣️ Infected file! Deleting: {file_path}")
        os.remove(file_path)
        return "infected"

    logger.info(f"🟢 File is clean: {file_path}")
    return file_path


def insert_file_to_db(file_path: str) -> bool:
    """
    Inserts a scanned file into PostgreSQL as binary and deletes the local file.

    Args:
        file_path (str): Full path to the file on disk.

    Returns:
        bool: True if successful, False otherwise.
    """
    try:
        logger.info(f"📦 Inserting file into DB: {file_path}")
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

        logger.info(f"✅ DB insert complete. Cleaning up: {file_path}")
        os.remove(file_path)
        return True

    except Exception as e:
        logger.error(f"❌ Database error: {e}")
        return False
