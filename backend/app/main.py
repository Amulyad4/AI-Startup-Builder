from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router as startup_router
from app.database import engine, Base

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Startup Builder API",
    description="Multi-agent intelligent platform for startup ideation",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(startup_router, tags=["Startup Blueprint"])

@app.get("/")
async def root():
    return {"message": "Welcome to AI Startup Builder API"}
