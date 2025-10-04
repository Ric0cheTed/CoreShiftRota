# app/core/autogen.py

from datetime import timedelta
from typing import List
from sqlalchemy.orm import Session
from app.models import Visit, Employee
from app.logic.visit_suggestions import get_suggestions_for_visit

def generate_autogen_suggestions(db: Session, visit_ids: List[int]):
    suggestions = []
    visits = db.query(Visit).filter(Visit.id.in_(visit_ids)).all()

    for visit in visits:
        suggestion_data = get_suggestions_for_visit(visit, db)
        suggestions.append({
            "visit_id": visit.id,
            "suggestions": suggestion_data
        })

    return suggestions
