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

# Minimal seed for demo environments
@app.on_event("startup")
def seed_demo():
    try:
        from app.database import SessionLocal
        from app.models.usuario import Usuario
        from app.models.plano import Plano
        from app.models.item_do_plano import ItemDoPlano

        with SessionLocal() as db:
            has_plano = db.query(Plano).first()
            if has_plano:
                return

            user = Usuario(nome="Demo", email="demo@planej.ai", senha="demo")
            db.add(user)
            db.commit()
            db.refresh(user)

            plano = Plano(id_usuario=user.id_usuario, periodo="2025-01", topico="Apresentação", tempo=6, prova=False, tipo=False)
            db.add(plano)
            db.commit()
            db.refresh(plano)

            itens = [
                ItemDoPlano(id_pe=plano.id_pe, descricao="Semana 1: Revisar conceitos principais", temp=2),
                ItemDoPlano(id_pe=plano.id_pe, descricao="Semana 2: Exercícios práticos diários", temp=2),
                ItemDoPlano(id_pe=plano.id_pe, descricao="Semana 3: Simulados e revisão espaçada", temp=2),
            ]
            db.add_all(itens)
            db.commit()
    except Exception:
        # Não falhar o app por seed; útil apenas para demo
        pass

