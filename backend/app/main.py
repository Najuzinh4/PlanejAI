from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import router as api_router
from app.core.security import hash_password
from dotenv import load_dotenv

load_dotenv()

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

# Minimal seed for demo environments
@app.on_event("startup")
def seed_demo():
  try:
    from app.database import SessionLocal
    from app.models.usuario import Usuario
    from app.models.plano import Plano
    from app.models.item_do_plano import ItemDoPlano

    with SessionLocal() as db:
      # Ensure demo user exists and has hashed password
      user = db.query(Usuario).filter(Usuario.email == "demo@planej.ai").first()
      if not user:
        user = Usuario(nome="Demo", email="demo@planej.ai", senha=hash_password("demo"))
        db.add(user)
        db.commit()
        db.refresh(user)
      else:
        if not str(user.senha).startswith("$pbkdf2-sha256$"):
          user.senha = hash_password("demo")
          db.add(user)
          db.commit()

      # Seed a sample plan only if none exists
      has_plano = db.query(Plano).first()
      if not has_plano:
        plano = Plano(
          id_usuario=user.id_usuario,
          periodo="2025-01",
          topico="Apresentacao",
          tempo=6,
          prova=False,
          tipo=False,
        )
        db.add(plano)
        db.commit()
        db.refresh(plano)

        itens = [
          ItemDoPlano(id_pe=plano.id_pe, descricao="Semana 1: Revisar conceitos principais", temp=2),
          ItemDoPlano(id_pe=plano.id_pe, descricao="Semana 2: Exercicios praticos diarios", temp=2),
          ItemDoPlano(id_pe=plano.id_pe, descricao="Semana 3: Simulados e revisao espacada", temp=2),
        ]
        db.add_all(itens)
        db.commit()
  except Exception:
    # Do not fail app due to seed; demo only
    pass
