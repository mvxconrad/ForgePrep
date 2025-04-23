from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, users, study_sets, files, dashboard, upload, gpt, admin
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Remove HTTPSRedirectMiddleware if HTTPS is already handled by a reverse proxy
# app.add_middleware(HTTPSRedirectMiddleware)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://forgeprep.net"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(gpt.router, prefix="/api", tags=["AI"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(study_sets.router, prefix="/api/study_sets", tags=["Study Sets"])
app.include_router(files.router, prefix="/api/files", tags=["File Management"])
app.include_router(admin.router, prefix="/api", tags=["Admin"])

@app.get("/")
def root():
    return {"message": "API is running and connected to PostgreSQL!"}

@app.get("/api/")
def api_root():
    return {"message": "API is accessible!"}
