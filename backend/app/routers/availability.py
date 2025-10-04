from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import SessionLocal
from app.models.availability import Availability
from app.schemas.availability import AvailabilityCreate, AvailabilityOut
from app.utils.auth import require_role

router = APIRouter(prefix="/availability", tags=["availability"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=AvailabilityOut, dependencies=[Depends(require_role("admin", "manager"))])
def create_availability(data: AvailabilityCreate, db: Session = Depends(get_db)):
    new_slot = Availability(**data.model_dump())
    db.add(new_slot)
    db.commit()
    db.refresh(new_slot)
    return new_slot

@router.get("/employee/{employee_id}", response_model=List[AvailabilityOut], dependencies=[Depends(require_role("admin", "manager", "carer"))])
def get_employee_availability(employee_id: int, db: Session = Depends(get_db)):
    return db.query(Availability).filter(Availability.employee_id == employee_id).all()
