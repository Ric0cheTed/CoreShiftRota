from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.employee import Employee
from app.schemas.employee import EmployeeOut
from app.utils.auth import require_role
from app.db.session import get_db

router = APIRouter(
    prefix="/employees",
    tags=["employees"]
)

@router.get("/", response_model=list[EmployeeOut])
def get_all_employees(
    db: Session = Depends(get_db),
    _: dict = Depends(require_role("admin", "manager")),
):
    return db.query(Employee).all()

@router.get("/{employee_id}", response_model=EmployeeOut)
def get_employee_by_id(
    employee_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(require_role("admin", "manager")),
):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee
