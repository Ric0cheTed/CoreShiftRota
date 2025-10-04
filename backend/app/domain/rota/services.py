from typing import List
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models import Visit, Employee
from app.suggestions.logic import calculate_score
from app.schemas.visit import VisitSuggestion
from fastapi import Depends

class RotaService:
    def __init__(self, db: Session):
        self.db = db

    def suggest(self, date: str, start_time: str, end_time: str, client_id: int) -> List[VisitSuggestion]:
        # Construct a lightweight object with required attrs used by calculate_score
        class V:
            def __init__(self, date, start_time, end_time, client_id):
                self.date = date
                self.start_time = start_time
                self.end_time = end_time
                self.client_id = client_id
                self.employee_id = None
        visit_like = V(date, start_time, end_time, client_id)
        employees = self.db.query(Employee).all()
        existing_visits = self.db.query(Visit).filter(Visit.date == date).all()
        suggestions = []
        for emp in employees:
            emp_visits = [v for v in existing_visits if v.employee_id == emp.id]
            s = calculate_score(visit_like, emp, emp_visits)
            if s.get("score", 0) > 0:
                suggestions.append(s)
        return sorted(suggestions, key=lambda s: s["score"], reverse=True)

    def assign(self, visit_id: int, employee_id: int):
        visit = self.db.query(Visit).filter(Visit.id == visit_id).first()
        if not visit:
            return {"ok": False, "error": "visit_not_found"}
        visit.employee_id = employee_id
        self.db.commit()
        self.db.refresh(visit)
        return {"ok": True, "visit_id": visit.id, "employee_id": visit.employee_id}

def get_rota_service(db: Session = Depends(get_db)) -> RotaService:
    return RotaService(db)