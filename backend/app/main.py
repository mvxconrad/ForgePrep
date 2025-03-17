from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
<<<<<<< HEAD
from app.routes import auth, users, study_sets, files, dashboard
=======
from app.routes import auth, users, study_sets, files, upload
>>>>>>> c0af55cc4dc8d5add763c55887d2da8ff48265b3

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
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(study_sets.router, prefix="/study_sets", tags=["Study Sets"])
app.include_router(files.router, prefix="/files", tags=["File Management"])
<<<<<<< HEAD
app.include_router(dashboard.router, prefix="", tags=["Dashboard"]) 
=======
app.include_router(upload.router, tags=["File Upload"])
>>>>>>> c0af55cc4dc8d5add763c55887d2da8ff48265b3

@app.get("/")
def root():
    return {"message": "API is running and connected to PostgreSQL!"}

@app.get("/api/")
def api_root():
    return {"message": "API is accessible!"}
