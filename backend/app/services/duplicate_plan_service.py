from sqlalchemy.orm import Session
from app.models.plano import Plano
from app.models.item_do_plano import ItemDoPlano


def duplicate_plan(db: Session, original: Plano) -> Plano:
    new_plano = Plano(
        id_usuario=original.id_usuario,
        periodo=original.periodo,
        topico=(original.topico or "") + " (Copia)",
        tempo=original.tempo,
        prova=original.prova,
        tipo=original.tipo,
    )
    db.add(new_plano)
    db.commit()
    db.refresh(new_plano)

    items = db.query(ItemDoPlano).filter(ItemDoPlano.id_pe == original.id_pe).all()
    clones = [
        ItemDoPlano(
            id_pe=new_plano.id_pe,
            descricao=i.descricao,
            data_inicio=i.data_inicio,
            data_fim=i.data_fim,
            temp=i.temp,
        )
        for i in items
    ]
    if clones:
        db.add_all(clones)
        db.commit()
    return new_plano
