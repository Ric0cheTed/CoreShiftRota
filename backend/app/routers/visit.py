from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, date, time
from app.models.visit import Visit
from app.models.client import Client
from app.models.employee import Employee
from app.schemas.visit import VisitOut, VisitCreate, VisitUpdate
from app.db.session import get_db
from app.utils.auth import require_role
from app.logic.visit_suggestions import get_suggestions_for_visit

router = APIRouter(
    prefix="/visits",
    tags=["visits"]
)

def safe_str(val):
    if isinstance(val, (datetime, date)):
        return val.isoformat()
    if isinstance(val, time):
        return val.strftime("%H:%M:%S")
    return str(val)

@router.get("/", response_model=List[VisitOut], dependencies=[Depends(require_role("admin", "manager", "carer"))])
def get_all_visits(db: Session = Depends(get_db)):
    visits = db.query(Visit).all()
    result = []
    for visit in visits:
        client = db.query(Client).filter(Client.id == visit.client_id).first()
        employee = db.query(Employee).filter(Employee.id == visit.employee_id).first()

        result.append({
            "id": visit.id,
            "date": safe_str(visit.date),
            "start_time": safe_str(visit.start_time),
            "end_time": safe_str(visit.end_time),
            "employee_id": visit.employee_id,
            "client_id": visit.client_id,
            "notes": visit.notes,
            "client_name": client.full_name if client else "Unknown",
            "employee_name": employee.full_name if employee else "Unassigned"
        })

    return result

@router.get("/suggestions", dependencies=[Depends(require_role("admin", "manager"))])
def get_visit_suggestions(visit_id: int = Query(...), db: Session = Depends(get_db)):
    visit = db.query(Visit).filter(Visit.id == visit_id).first()
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")

    return get_suggestions_for_visit(visit, db)

@router.post("/autogen", dependencies=[Depends(require_role("admin", "manager"))])
def autogenerate_visits(db: Session = Depends(get_db)):
    from app.logic.visit_autogen import generate_visits_for_week
    try:
        result = generate_visits_for_week(db)
        return {"status": "ok", "visits_created": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Autogen failed: {str(e)}")

@router.post("/", response_model=VisitOut, dependencies=[Depends(require_role("admin", "manager"))])
def create_visit(visit: VisitCreate, db: Session = Depends(get_db)):
    new_visit = Visit(
        client_id=visit.client_id,
        employee_id=visit.employee_id,
        start_time=visit.start_time,
        end_time=visit.end_time,
        notes=visit.notes
    )
    db.add(new_visit)
    db.commit()
    db.refresh(new_visit)

    client = db.query(Client).filter(Client.id == new_visit.client_id).first()
    employee = db.query(Employee).filter(Employee.id == new_visit.employee_id).first()

    return {
        "id": new_visit.id,
        "date": new_visit.start_time.split("T")[0] if isinstance(new_visit.start_time, str) else new_visit.start_time.date().isoformat(),
        "start_time": new_visit.start_time if isinstance(new_visit.start_time, str) else new_visit.start_time.strftime("%H:%M:%S"),
        "end_time": new_visit.end_time if isinstance(new_visit.end_time, str) else new_visit.end_time.strftime("%H:%M:%S"),
        "employee_id": new_visit.employee_id,
        "client_id": new_visit.client_id,
        "notes": new_visit.notes,
        "client_name": client.full_name if client else "Unknown",
        "employee_name": employee.full_name if employee else "Unassigned"
    }
    
@router.put("/{visit_id}", response_model=VisitOut, dependencies=[Depends(require_role("admin", "manager"))])
def update_visit(visit_id: int, updated: VisitUpdate, db: Session = Depends(get_db)):
    visit = db.query(Visit).filter(Visit.id == visit_id).first()
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")

    for key, value in updated.model_dump(exclude_unset=True).items():
        setattr(visit, key, value)

    db.commit()
    db.refresh(visit)

    client = db.query(Client).filter(Client.id == visit.client_id).first()
    employee = db.query(Employee).filter(Employee.id == visit.employee_id).first()

    return {
        "id": visit.id,
        "date": visit.start_time.split("T")[0] if isinstance(visit.start_time, str) else visit.start_time.date().isoformat(),
        "start_time": visit.start_time if isinstance(visit.start_time, str) else visit.start_time.strftime("%H:%M:%S"),
        "end_time": visit.end_time if isinstance(visit.end_time, str) else visit.end_time.strftime("%H:%M:%S"),
        "employee_id": visit.employee_id,
        "client_id": visit.client_id,
        "notes": visit.notes,
        "client_name": client.full_name if client else "Unknown",
        "employee_name": employee.full_name if employee else "Unassigned"
    }

@router.get("/{id}", dependencies=[Depends(require_role("admin", "manager", "carer"))])
def get_visit(id: int, db: Session = Depends(get_db)):
    visit = db.query(Visit).filter(Visit.id == id).first()
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")

    client = db.query(Client).filter(Client.id == visit.client_id).first()
    employee = db.query(Employee).filter(Employee.id == visit.employee_id).first()

    return {
        "id": visit.id,
        "date": str(visit.date),
        "start_time": visit.start_time,
        "end_time": visit.end_time,
        "employee_id": visit.employee_id,
        "employee_name": employee.full_name if employee else "Unassigned",
        "client_id": visit.client_id,
        "client_name": client.full_name if client else "Unknown",
        "notes": visit.notes or ""
    }
