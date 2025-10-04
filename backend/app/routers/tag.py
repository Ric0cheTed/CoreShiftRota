from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.tag import Tag
from app.schemas.tag import TagCreate, TagOut
from typing import List

router = APIRouter(prefix="/tags", tags=["tags"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=TagOut)
def create_tag(tag: TagCreate, db: Session = Depends(get_db)):
    existing = db.query(Tag).filter(Tag.name == tag.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Tag already exists")
    new_tag = Tag(**tag.model_dump())
    db.add(new_tag)
    db.commit()
    db.refresh(new_tag)
    return new_tag

@router.get("/", response_model=List[TagOut])
def get_tags(db: Session = Depends(get_db)):
    return db.query(Tag).all()
