from sqlalchemy.orm import Session
from app.models.visit import Visit
from app.models.availability import Availability
from datetime import datetime

def check_visit_conflict(employee_id: int, start: datetime, end: datetime, db: Session):
    # Day of week (e.g. "mon")
    day = start.strftime("%a").lower()[:3]

    # Check availability
    availability = db.query(Availability).filter(
        Availability.employee_id == employee_id,
        Availability.day_of_week == day
    ).all()

    if not any(a.start_time <= start.time() <= a.end_time and a.start_time <= end.time() <= a.end_time for a in availability):
        return False, "Visit is outside of employee's availability"

    # Check for overlapping visits
    overlapping = db.query(Visit).filter(
        Visit.employee_id == employee_id,
        Visit.start_time < end,
        Visit.end_time > start
    ).first()

    if overlapping:
        return False, "Visit overlaps with another scheduled visit"

    return True, None
