import os
from dotenv import load_dotenv

load_dotenv()

FRONTEND_URL = os.getenv("FRONTEND_URL", "https://forgeprep.net")
EMAILS_ENABLED = os.getenv("EMAILS_ENABLED", "false").lower() == "true"

def send_verification_email(to_email: str, token: str):
    link = f"{FRONTEND_URL}/verify-email?token={token}"
    if EMAILS_ENABLED:
        # TODO: integrate with SendGrid here
        pass
    else:
        print(f"[📧 MOCK VERIFY EMAIL] To: {to_email} | Link: {link}")

def send_password_reset_email(to_email: str, token: str):
    link = f"{FRONTEND_URL}/reset-password?token={token}"
    if EMAILS_ENABLED:
        # TODO: integrate with SendGrid here
        pass
    else:
        print(f"[📧 MOCK RESET EMAIL] To: {to_email} | Link: {link}")
