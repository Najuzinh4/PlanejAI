from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class ItemDoPlano(Base):
    __tablename__ = "item_do_plano"

    id_item_do_plano = Column(Integer, primary_key=True, index=True)
    id_pe = Column(Integer, ForeignKey("planos.id_pe"), nullable=False)
    descricao = Column(Text, nullable=False)
    data_inicio = Column(Date)
    data_fim = Column(Date)
    temp = Column(Integer)

    plano = relationship("Plano", back_populates="itens")
