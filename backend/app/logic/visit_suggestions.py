
from sqlalchemy.orm import Session
from app.models.visit import Visit
from app.models.employee import Employee
from datetime import datetime, date, time

def safe_str(val):
    if isinstance(val, (datetime, date)):
        return val.isoformat()
    if isinstance(val, time):
        return val.strftime("%H:%M:%S")
    return str(val)

def get_suggestions_for_visit(visit: Visit, db: Session):
    suggestions = []
    visit_date = visit.date
    visit_start = visit.start_time
    visit_end = visit.end_time

    # 1. Get employees with no overlapping visits
    overlapping = db.query(Visit).filter(
        Visit.date == visit_date,
        Visit.start_time < visit_end,
        Visit.end_time > visit_start,
        Visit.employee_id != visit.employee_id
    ).all()
    busy_ids = {v.employee_id for v in overlapping}

    free_employees = db.query(Employee).filter(~Employee.id.in_(busy_ids)).all()

    for emp in free_employees:
        score = 0
        reasons = []

        # Tag match bonus (not yet wired to client tags)
        # score += len(set(emp.tags)) → would be scored if client tags existed

        # Capacity check
        if emp.capacity is not None:
            current_visits = db.query(Visit).filter(
                Visit.employee_id == emp.id,
                Visit.date == visit_date
            ).count()
            if current_visits >= emp.capacity:
                continue  # skip over-capacity
            score += 1
            reasons.append("Within capacity")

        # Car access
        if emp.car_access:
            score += 1
            reasons.append("Has car access")

        # Client preference
        if visit.client in emp.client_preferences:
            score += 2
            reasons.append("Preferred by client")

        suggestions.append({
            "employee_id": emp.id,
            "employee_name": emp.full_name,
            "start_time": safe_str(visit_start),
            "end_time": safe_str(visit_end),
            "score": score,
            "reasons": reasons if reasons else ["Available (no overlaps)"]
        })

    # Sort by descending score
    sorted_suggestions = sorted(suggestions, key=lambda s: s["score"], reverse=True)
    return sorted_suggestions
