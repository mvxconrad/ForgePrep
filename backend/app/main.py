from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, users, study_sets, files, dashboard, upload
from app.routes import gpt
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development (restrict in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(study_sets.router, prefix="/api/study_sets", tags=["Study Sets"])
app.include_router(files.router, prefix="/api/files", tags=["File Management"])
app.include_router(upload.router, prefix="/api/upload", tags=["File Upload"])
app.include_router(gpt.router, prefix="/api/gpt", tags=["AI"])


@app.get("/")
def root():
    return {"message": "API is running and connected to PostgreSQL!"}

@app.get("/api/")
def api_root():
    return {"message": "API is accessible!"}
