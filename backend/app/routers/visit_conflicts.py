from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.visit import Visit
from app.models.employee import Employee
from app.logic.visit_conflicts import detect_visit_conflicts
from app.utils.auth import require_role

router = APIRouter(prefix="/visits", tags=["visits"])

@router.get("/conflicts")
def get_visit_conflicts(
    db: Session = Depends(get_db),
    user=Depends(require_role("admin"))
):
    visits = db.query(Visit).all()
    employees = db.query(Employee).all()

    conflict_map = detect_visit_conflicts(visits, employees)

    return [
        {"visit_id": vid, "issues": issues}
        for vid, issues in conflict_map.items()
    ]
