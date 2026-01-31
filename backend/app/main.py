from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, users, study_sets, files, dashboard, upload, gpt, admin, tests
from dotenv import load_dotenv

# Load .env variables (e.g., DB, OpenAI keys)
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# ------------------ CORS CONFIG ------------------ #
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://forgeprep.net"],  # Only allow your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ ROUTER REGISTRATION ------------------ #
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(tests.router, prefix="/api")
app.include_router(study_sets.router, prefix="/api/study_sets", tags=["Study Sets"])
app.include_router(files.router, prefix="/api/files", tags=["File Management"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(gpt.router, prefix="/api", tags=["AI & GPT"])
app.include_router(admin.router, prefix="/api", tags=["Admin"])

# ------------------ BASE ROUTES ------------------ #
@app.get("/")
def root():
    return {"message": "API is running and connected to PostgreSQL!"}

@app.get("/api/")
def api_root():
    return {"message": "API is accessible!"}
