from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.plano import Plano
from app.models.usuario import Usuario
from app.core.auth import get_current_user

router = APIRouter()


@router.get("/planos")
def list_planos(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    planos = db.query(Plano).filter(Plano.id_usuario == current_user.id_usuario).all()
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
