from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.plano import Plano
from app.models.item_do_plano import ItemDoPlano
from app.models.subject import Subject
from app.models.usuario import Usuario
from app.core.auth import get_current_user
from app.schemas.plano import PlanoOut
from app.services.open_ia_service import PlanPrompt, generate_plan_text
from app.services.plan_parser import parse_plan_text_to_items
from pydantic import BaseModel

router = APIRouter()


class PlanoCreate(BaseModel):
    subject_ids: Optional[List[int]] = []
    subject_names: Optional[List[str]] = []
    horas_por_semana: int
    dificuldade: Optional[str] = None  # baixa, media, alta
    objetivo: Optional[str] = None
    periodo: Optional[str] = None
    timeframe_weeks: Optional[int] = None
    weekly_focus: Optional[str] = None
    task_estimated_hours: Optional[int] = None


@router.get("/planos")
def list_planos(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    planos = db.query(Plano).filter(Plano.id_usuario == current_user.id_usuario).all()
    result = [
        {
            "id": p.id_pe,
            "titulo": p.topico or "Plano",
            "descricao": f"{p.periodo or ''} {f'- {p.tempo}h/semana' if p.tempo else ''}".strip(),
        }
        for p in planos
    ]
    return result


@router.get("/planos/{plano_id}", response_model=PlanoOut)
def get_plano(
    plano_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    plano = db.get(Plano, plano_id)
    if not plano or plano.id_usuario != current_user.id_usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plano não encontrado")
    # Load relationship by access
    _ = plano.itens
    return plano


@router.post("/planos", response_model=PlanoOut, status_code=status.HTTP_201_CREATED)
def create_plano(
    payload: PlanoCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    subjects: List[str] = []
    if payload.subject_ids:
        rows = (
            db.query(Subject)
            .filter(Subject.id_usuario == current_user.id_usuario, Subject.id_disciplina.in_(payload.subject_ids))
            .all()
        )
        subjects.extend([r.nome for r in rows])
    if payload.subject_names:
        subjects.extend(payload.subject_names)

    subj_str = ", ".join(subjects) if subjects else "Estudos"

        # Build parameterized prompt and call OpenAI client
    prompt_builder = PlanPrompt(
        subjects=subjects,
        horas_por_semana=payload.horas_por_semana,
        dificuldade=payload.dificuldade,
        objetivo=payload.objetivo,
        periodo=payload.periodo,
        timeframe_weeks=payload.timeframe_weeks,
        weekly_focus=payload.weekly_focus,
        task_estimated_hours=payload.task_estimated_hours,
    )
    plan_text = generate_plan_text(prompt_builder.build())

    # Persist Plano
    plano = Plano(
        id_usuario=current_user.id_usuario,
        periodo=payload.periodo,
        topico=subj_str,
        tempo=payload.horas_por_semana,
        prova=False,
        tipo=False,
    )
    db.add(plano)
    db.commit()
    db.refresh(plano)

    # Parse and persist items
    items_desc = parse_plan_text_to_items(plan_text)
    items = [ItemDoPlano(id_pe=plano.id_pe, descricao=d) for d in items_desc[:100]]
    if items:
        db.add_all(items)
        db.commit()
        # Refresh relationship
        _ = plano.itens

    return plano


# touch

# appended

# === Extended endpoints for plan operations ===

from typing import List, Optional

from fastapi import HTTPException, status

from pydantic import BaseModel
class PlanoUpdate(BaseModel):
    topico: Optional[str] = None
    periodo: Optional[str] = None
    tempo: Optional[int] = None

class ItemUpdate(BaseModel):
    descricao: Optional[str] = None
    data_inicio: Optional[str] = None
    data_fim: Optional[str] = None
    temp: Optional[int] = None
@router.put("/planos/{plano_id}")
def update_plano_ext(plano_id: int, payload: PlanoUpdate, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    from app.models.plano import Plano
    from app.services.edit_plan_service import edit_plan
    plano = db.get(Plano, plano_id)
    if not plano or plano.id_usuario != current_user.id_usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plano não encontrado")
    edit_plan(db, plano, topico=payload.topico, periodo=payload.periodo, tempo=payload.tempo)
    return {"id_pe": plano.id_pe, "id_usuario": plano.id_usuario, "periodo": plano.periodo, "topico": plano.topico, "tempo": plano.tempo, "prova": plano.prova, "tipo": plano.tipo, "itens": [
        {"id_item_do_plano": it.id_item_do_plano, "descricao": it.descricao, "data_inicio": str(it.data_inicio) if it.data_inicio else None, "data_fim": str(it.data_fim) if it.data_fim else None, "temp": it.temp}
        for it in plano.itens
    ]}
@router.post("/planos/{plano_id}/duplicate", status_code=status.HTTP_201_CREATED)
def duplicate_plano_ext(plano_id: int, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    from app.models.plano import Plano
    from app.services.duplicate_plan_service import duplicate_plan
    original = db.get(Plano, plano_id)
    if not original or original.id_usuario != current_user.id_usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plano não encontrado")
    new_plano = duplicate_plan(db, original)
    return {"id_pe": new_plano.id_pe, "id_usuario": new_plano.id_usuario, "periodo": new_plano.periodo, "topico": new_plano.topico, "tempo": new_plano.tempo, "prova": new_plano.prova, "tipo": new_plano.tipo, "itens": [
        {"id_item_do_plano": it.id_item_do_plano, "descricao": it.descricao, "data_inicio": str(it.data_inicio) if it.data_inicio else None, "data_fim": str(it.data_fim) if it.data_fim else None, "temp": it.temp}
        for it in new_plano.itens
    ]}
@router.delete("/planos/{plano_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_plano_ext(plano_id: int, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    from app.models.plano import Plano
    from app.services.delete_plan_service import delete_plan
    plano = db.get(Plano, plano_id)
    if not plano or plano.id_usuario != current_user.id_usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plano não encontrado")
    delete_plan(db, plano)
    return None
@router.put("/planos/items/{item_id}")
def update_item_ext(item_id: int, payload: ItemUpdate, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    from app.models.item_do_plano import ItemDoPlano
    from app.models.plano import Plano
    from app.services.edit_plan_service import edit_item
    item = db.get(ItemDoPlano, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item não encontrado")
    plano = db.get(Plano, item.id_pe)
    if plano.id_usuario != current_user.id_usuario:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Sem acesso")
    edit_item(db, item, descricao=payload.descricao, data_inicio=payload.data_inicio, data_fim=payload.data_fim, temp=payload.temp)
    return {"id_item_do_plano": item.id_item_do_plano, "descricao": item.descricao, "data_inicio": str(item.data_inicio) if item.data_inicio else None, "data_fim": str(item.data_fim) if item.data_fim else None, "temp": item.temp}
@router.patch("/planos/items/{item_id}/toggle")
def toggle_item_done_ext(item_id: int, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    from app.models.item_do_plano import ItemDoPlano
    from app.models.plano import Plano
    from datetime import date as _date
    item = db.get(ItemDoPlano, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item não encontrado")
    plano = db.get(Plano, item.id_pe)
    if plano.id_usuario != current_user.id_usuario:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Sem acesso")
    item.data_fim = None if item.data_fim else _date.today()
    db.add(item); db.commit(); db.refresh(item)
    return {"id_item_do_plano": item.id_item_do_plano, "descricao": item.descricao, "data_inicio": str(item.data_inicio) if item.data_inicio else None, "data_fim": str(item.data_fim) if item.data_fim else None, "temp": item.temp}





