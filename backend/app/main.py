from fastapi import FastAPI
from app.database import engine, Base

# cria as tabelas automaticamente
Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.get("/")
def home():
    return {"msg": "PlanejAI API rodando 🚀"}
