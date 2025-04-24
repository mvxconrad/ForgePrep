import os
from dotenv import load_dotenv

load_dotenv()

FRONTEND_URL = os.getenv("FRONTEND_URL", "https://forgeprep.net")

def send_verification_email(to_email: str, token: str):
    link = f"{FRONTEND_URL}/verify-email?token={token}"
    print(f"[📧 VERIFY EMAIL] To: {to_email} | Link: {link}")

def send_password_reset_email(to_email: str, token: str):
    link = f"{FRONTEND_URL}/reset-password?token={token}"
    print(f"[📧 RESET PASSWORD] To: {to_email} | Link: {link}")
