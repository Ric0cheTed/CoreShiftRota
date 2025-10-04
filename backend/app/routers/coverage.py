from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.models.visit import Visit
from app.models.employee import Employee
from app.models.user import User
from app.logic.visit_suggestions import get_suggestions_for_visit
from app.utils.auth import get_current_user
from app.db.session import get_db

router = APIRouter(prefix="/coverage", tags=["coverage"])

@router.get("/eligibility")
def check_coverage_eligibility(
    visit_id: int = Query(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    # Only employees can cover shifts
    if user.role != "employee":
        return { "eligible": False }

    visit = db.query(Visit).filter(Visit.id == visit_id).first()
    if not visit:
        raise HTTPException(status_code=404, detail="Visit not found")

    suggestions = get_suggestions_for_visit(visit, db)
    eligible_ids = [s["employee_id"] for s in suggestions]

    return { "eligible": user.employee_id in eligible_ids }
