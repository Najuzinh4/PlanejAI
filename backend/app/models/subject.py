from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Subject(Base):
    __tablename__ = "disciplinas"

    id_disciplina = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)
    nome = Column(String(150), nullable=False)
    horas_por_semana = Column(Integer, nullable=False)
    dificuldade = Column(String(10), nullable=False)  # baixa, media, alta

    usuario = relationship("Usuario")
