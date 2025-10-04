from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.models import Visit, Employee
from app.schemas.visit import VisitSuggestion
from app.db.session import get_db
from .logic import calculate_score

router = APIRouter()

@router.get("/visits/suggestions", response_model=list[VisitSuggestion])
def get_visit_suggestions(visit_id: int = Query(...), db: Session = Depends(get_db)):
    visit = db.query(Visit).filter(Visit.id == visit_id).first()
    if not visit:
        return []

    employees = db.query(Employee).all()
    existing_visits = db.query(Visit).filter(Visit.date == visit.date).all()

    suggestions = []
    for emp in employees:
        emp_visits = [v for v in existing_visits if v.employee_id == emp.id]
        suggestion = calculate_score(visit, emp, emp_visits)
        if suggestion["score"] > 0:
            suggestions.append(suggestion)

    sorted_suggestions = sorted(suggestions, key=lambda s: s["score"], reverse=True)
    return sorted_suggestions
