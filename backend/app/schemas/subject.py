from pydantic import BaseModel, field_validator
from typing import Optional

ALLOWED_DIFFICULTY = {"baixa", "media", "alta"}


class SubjectCreate(BaseModel):
    nome: str
    horas_por_semana: int
    dificuldade: str

    @field_validator("dificuldade")
    @classmethod
    def validate_difficulty(cls, v: str) -> str:
        v2 = (v or "").lower()
        if v2 not in ALLOWED_DIFFICULTY:
            raise ValueError(f"dificuldade deve ser uma de {ALLOWED_DIFFICULTY}")
        return v2


class SubjectUpdate(BaseModel):
    nome: Optional[str] = None
    horas_por_semana: Optional[int] = None
    dificuldade: Optional[str] = None

    @field_validator("dificuldade")
    @classmethod
    def validate_difficulty(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        v2 = v.lower()
        if v2 not in ALLOWED_DIFFICULTY:
            raise ValueError(f"dificuldade deve ser uma de {ALLOWED_DIFFICULTY}")
        return v2


class SubjectOut(BaseModel):
    id_disciplina: int
    id_usuario: int
    nome: str
    horas_por_semana: int
    dificuldade: str

    class Config:
        from_attributes = True
