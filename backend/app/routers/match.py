from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from app.models.client import Client
from app.models.employee import Employee
from app.db.session import get_db  # ✅ Consistent DB session import

router = APIRouter(prefix="/match", tags=["match"])

@router.get("/suggest", response_model=List[str])
def suggest_employees(client_id: int, db: Session = Depends(get_db)):
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    client_tags = {tag.name for tag in client.tags}
    preferred_employees = []

    employees = db.query(Employee).all()
    for emp in employees:
        emp_tags = {tag.name for tag in emp.tags}
        if client_tags.intersection(emp_tags):
            preferred_employees.append(emp.full_name)

    return preferred_employees
