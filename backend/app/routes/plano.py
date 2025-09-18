from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.plano import Plano

router = APIRouter()


@router.get("/planos")
def list_planos(db: Session = Depends(get_db)):
    planos = db.query(Plano).all()
    # Map to a frontend-friendly shape
    result = [
        {
            "id": p.id_pe,
            "titulo": p.topico or "Plano",
            "descricao": f"{p.periodo or ''} {f'- {p.tempo}h/semana' if p.tempo else ''}".strip(),
        }
        for p in planos
    ]
    return result

