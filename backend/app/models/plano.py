from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base

class Plano(Base):
    __tablename__ = "planos"

    id_pe = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("usuarios.id_usuario"), nullable=False)
    periodo = Column(String(50))
    topico = Column(String(150))
    tempo = Column(Integer)
    prova = Column(Boolean, default=False)
    tipo = Column(Boolean, default=False)  # False = normal, True = urgente
    criado_em = Column(TIMESTAMP, server_default=func.now())

    itens = relationship("ItemDoPlano", back_populates="plano")
