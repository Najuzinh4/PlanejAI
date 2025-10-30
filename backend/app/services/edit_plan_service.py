from sqlalchemy.orm import Session
from typing import Optional
from app.models.plano import Plano
from app.models.item_do_plano import ItemDoPlano


def edit_plan(db: Session, plano: Plano, *, topico: Optional[str] = None, periodo: Optional[str] = None, tempo: Optional[int] = None) -> Plano:
    if topico is not None:
        plano.topico = topico
    if periodo is not None:
        plano.periodo = periodo
    if tempo is not None:
        plano.tempo = tempo
    db.add(plano)
    db.commit()
    db.refresh(plano)
    return plano


def edit_item(
    db: Session,
    item: ItemDoPlano,
    *,
    descricao: Optional[str] = None,
    data_inicio: Optional[str] = None,
    data_fim: Optional[str] = None,
    temp: Optional[int] = None,
) -> ItemDoPlano:
    if descricao is not None:
        item.descricao = descricao
    if data_inicio is not None:
        item.data_inicio = data_inicio
    if data_fim is not None:
        item.data_fim = data_fim
    if temp is not None:
        item.temp = temp
    db.add(item)
    db.commit()
    db.refresh(item)
    return item
