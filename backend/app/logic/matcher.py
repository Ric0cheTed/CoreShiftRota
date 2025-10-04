from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.visit import Visit
from app.models.employee import Employee

def get_suggestions(visit: Visit, db: Session) -> list[dict]:
    # Load all employees
    employees = db.query(Employee).all()
    suggestions = []

    visit_start = datetime.strptime(visit.start_time, "%H:%M:%S")
    visit_end = datetime.strptime(visit.end_time, "%H:%M:%S")

    for emp in employees:
        score = 0
        reasons = []

        # Preferred clients
        if visit.client_id in emp.client_preferences:
            score += 2
            reasons.append("Preferred client")

        # Car capacity
        if emp.max_visits_per_day and len(emp.visits) < emp.max_visits_per_day:
            score += 1
        else:
            reasons.append("Capacity full")

        # Availability
        if emp.availability:
            for slot in emp.availability:
                slot_start = datetime.strptime(slot["start_time"], "%H:%M:%S")
                slot_end = datetime.strptime(slot["end_time"], "%H:%M:%S")
                if slot_start <= visit_start and visit_end <= slot_end:
                    score += 1
                    reasons.append("Available")
                    break
            else:
                reasons.append("Unavailable")

        if score > 0:
            suggestions.append({
                "employee_id": emp.id,
                "score": score,
                "reason": ", ".join(reasons),
                "start_time": visit.start_time,
                "end_time": visit.end_time,
            })

    return sorted(suggestions, key=lambda x: x["score"], reverse=True)
