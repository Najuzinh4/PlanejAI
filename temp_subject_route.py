from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.subject import Subject
from app.models.usuario import Usuario
from app.schemas.subject import SubjectCreate, SubjectUpdate, SubjectOut
from app.core.auth import get_current_user

router = APIRouter()


@router.get("/subjects", response_model=List[SubjectOut])
def list_subjects(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    items = db.query(Subject).filter(Subject.id_usuario == current_user.id_usuario).all()
    return items


@router.post("/subjects", response_model=SubjectOut, status_code=status.HTTP_201_CREATED)
def create_subject(
    payload: SubjectCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    item = Subject(
        id_usuario=current_user.id_usuario,
        nome=payload.nome,
        horas_por_semana=payload.horas_por_semana,
        dificuldade=payload.dificuldade.lower(),
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/subjects/{subject_id}", response_model=SubjectOut)
def update_subject(
    subject_id: int,
    payload: SubjectUpdate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    item = db.get(Subject, subject_id)
    if not item or item.id_usuario != current_user.id_usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Disciplina não encontrada")

    if payload.nome is not None:
        item.nome = payload.nome
    if payload.horas_por_semana is not None:
        item.horas_por_semana = payload.horas_por_semana
    if payload.dificuldade is not None:
        item.dificuldade = payload.dificuldade.lower()

    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/subjects/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subject(
    subject_id: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    item = db.get(Subject, subject_id)
    if not item or item.id_usuario != current_user.id_usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Disciplina não encontrada")

    db.delete(item)
    db.commit()
    return None

