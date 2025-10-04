from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import SessionLocal
from app.models.client import Client
from app.models.tag import Tag
from app.schemas.client import (
    ClientCreate, ClientUpdate, ClientOut,
    ClientTagAssignment, ClientWithTags
)

router = APIRouter(prefix="/clients", tags=["clients"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=ClientOut)
def create_client(client: ClientCreate, db: Session = Depends(get_db)):
    new_client = Client(**client.model_dump())
    db.add(new_client)
    db.commit()
    db.refresh(new_client)
    return new_client

@router.get("/", response_model=List[ClientOut])
def get_clients(db: Session = Depends(get_db)):
    return db.query(Client).all()

@router.get("/{client_id}", response_model=ClientWithTags)
def get_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client

@router.put("/{client_id}", response_model=ClientOut)
def update_client(client_id: int, updated: ClientUpdate, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    for key, value in updated.model_dump(exclude_unset=True).items():
        setattr(client, key, value)
    db.commit()
    db.refresh(client)
    return client

@router.delete("/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    db.delete(client)
    db.commit()
    return {"detail": "Client deleted"}

@router.post("/{client_id}/tags", response_model=ClientWithTags)
def assign_tags_to_client(client_id: int, payload: ClientTagAssignment, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    tags = db.query(Tag).filter(Tag.id.in_(payload.tag_ids)).all()
    client.tags = tags
    db.commit()
    db.refresh(client)
    return client
