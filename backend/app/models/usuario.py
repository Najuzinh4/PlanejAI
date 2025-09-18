from sqlalchemy import Column, Integer, String, TIMESTAMP, func
from app.database import Base


class Usuario(Base):
    __tablename__ = "usuarios"

    id_usuario = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    senha = Column(String(255), nullable=False)
    criado_em = Column(TIMESTAMP, server_default=func.now())
