import os
from dotenv import load_dotenv
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

load_dotenv()

FRONTEND_URL = os.getenv("FRONTEND_URL", "https://forgeprep.net")
EMAILS_ENABLED = os.getenv("EMAILS_ENABLED", "false").lower() == "true"
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
EMAIL_FROM = os.getenv("EMAIL_FROM", "no-reply@forgeprep.net")

def send_verification_email(to_email: str, token: str):
    link = f"{FRONTEND_URL}/verify-email?token={token}"
    if EMAILS_ENABLED:
        message = Mail(
            from_email=EMAIL_FROM,
            to_emails=to_email,
            subject="ForgePrep: Verify Your Email",
            html_content=f"<p>Welcome to ForgePrep!</p><p>Please verify your email by clicking <a href='{link}'>this link</a>.</p>"
        )
        try:
            sg = SendGridAPIClient(SENDGRID_API_KEY)
            sg.send(message)
            print(f"[✅ EMAIL SENT] Verification sent to {to_email}")
        except Exception as e:
            print(f"[❌ ERROR SENDING VERIFY EMAIL] {e}")
    else:
        print(f"[📧 MOCK VERIFY EMAIL] To: {to_email} | Link: {link}")

def send_password_reset_email(to_email: str, token: str):
    link = f"{FRONTEND_URL}/reset-password?token={token}"
    if EMAILS_ENABLED:
        message = Mail(
            from_email=EMAIL_FROM,
            to_emails=to_email,
            subject="ForgePrep: Reset Your Password",
            html_content=f"<p>You requested a password reset.</p><p>Click <a href='{link}'>here</a> to reset your password.</p>"
        )
        try:
            sg = SendGridAPIClient(SENDGRID_API_KEY)
            sg.send(message)
            print(f"[✅ EMAIL SENT] Password reset sent to {to_email}")
        except Exception as e:
            print(f"[❌ ERROR SENDING RESET EMAIL] {e}")
    else:
        print(f"[📧 MOCK RESET EMAIL] To: {to_email} | Link: {link}")
