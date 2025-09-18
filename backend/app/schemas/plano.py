from pydantic import BaseModel
from typing import List, Optional


class ItemDoPlanoOut(BaseModel):
    id_item_do_plano: int
    descricao: str
    data_inicio: Optional[str] = None
    data_fim: Optional[str] = None
    temp: Optional[int] = None

    class Config:
        from_attributes = True


class PlanoOut(BaseModel):
    id_pe: int
    id_usuario: int
    periodo: Optional[str] = None
    topico: Optional[str] = None
    tempo: Optional[int] = None
    prova: Optional[bool] = None
    tipo: Optional[bool] = None
    itens: List[ItemDoPlanoOut] = []

    class Config:
        from_attributes = True

