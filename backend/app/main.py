from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import router as api_router

# Create tables automatically (dev only)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="PlanejAI API")

# Basic CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"msg": "PlanejAI API rodando"}

app.include_router(api_router)

