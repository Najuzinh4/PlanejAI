from sqlalchemy.orm import Session
from app.models.plano import Plano
from app.models.item_do_plano import ItemDoPlano


def delete_plan(db: Session, plano: Plano) -> None:
    # Ensure items are deleted (CASCADE not configured explicitly)
    db.query(ItemDoPlano).filter(ItemDoPlano.id_pe == plano.id_pe).delete()
    db.delete(plano)
    db.commit()
