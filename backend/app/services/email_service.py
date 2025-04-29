# import os
# from dotenv import load_dotenv

# load_dotenv()

# FRONTEND_URL = os.getenv("FRONTEND_URL", "https://forgeprep.net")
# EMAILS_ENABLED = os.getenv("EMAILS_ENABLED", "false").lower() == "true"

# def send_verification_email(to_email: str, token: str):
#     link = f"{FRONTEND_URL}/verify-email?token={token}"
#     if EMAILS_ENABLED:
#         # TODO: integrate with SendGrid here
#         pass
#     else:
#         print(f"[📧 MOCK VERIFY EMAIL] To: {to_email} | Link: {link}")

# def send_password_reset_email(to_email: str, token: str):
#     link = f"{FRONTEND_URL}/reset-password?token={token}"
#     if EMAILS_ENABLED:
#         # TODO: integrate with SendGrid here
#         pass
#     else:
#         print(f"[📧 MOCK RESET EMAIL] To: {to_email} | Link: {link}")

# app/services/email_service.py

import os
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

FRONTEND_URL = os.getenv("FRONTEND_URL", "https://forgeprep.net")
EMAILS_ENABLED = os.getenv("EMAILS_ENABLED", "false").lower() == "true"

SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
FROM_EMAIL = os.getenv("FROM_EMAIL", "no-reply@forgeprep.net")

def send_email(to_email: str, subject: str, body: str):
    if not EMAILS_ENABLED:
        print(f"[📧 MOCK EMAIL] To: {to_email} | Subject: {subject} | Body: {body}")
        return

    message = MIMEText(body)
    message["Subject"] = subject
    message["From"] = FROM_EMAIL
    message["To"] = to_email

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.sendmail(FROM_EMAIL, to_email, message.as_string())
        print(f"[✅ EMAIL SENT] To: {to_email} | Subject: {subject}")
    except Exception as e:
        print(f"[❌ EMAIL ERROR] {e}")

def send_verification_email(to_email: str, token: str):
    link = f"{FRONTEND_URL}/verify-email?token={token}"
    subject = "Verify your email address"
    body = f"Click the link to verify your email: {link}"
    send_email(to_email, subject, body)

def send_password_reset_email(to_email: str, token: str):
    link = f"{FRONTEND_URL}/reset-password?token={token}"
    subject = "Reset your password"
    body = f"Click the link to reset your password: {link}"
    send_email(to_email, subject, body)
