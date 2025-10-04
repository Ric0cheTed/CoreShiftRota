from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.visit import Visit
from app.models.employee import Employee
from app.models.client import Client
from datetime import datetime, timedelta

router = APIRouter(prefix="/audit", tags=["audit"])

@router.get("/rota")
def audit_rota(db: Session = Depends(get_db)):
    today = datetime.now().date()
    audits = []

    visits = db.query(Visit).all()

    for visit in visits:
        # Duplicate Visits Check
        duplicate_visits = db.query(Visit).filter(
            Visit.client_id == visit.client_id,
            Visit.date == visit.date,
            Visit.start_time == visit.start_time,
            Visit.end_time == visit.end_time,
        ).count()

        if duplicate_visits > 1:
            audits.append({
                "type": "DuplicateVisit",
                "visit_id": visit.id,
                "client_id": visit.client.id if visit.client else None,
                "client": visit.client.full_name if visit.client else "Unknown",
                "employee_id": visit.employee.id if visit.employee else None,
                "employee": visit.employee.full_name if visit.employee else "Unknown",
                "date": str(visit.date),
                "details": "Duplicate visit detected"
            })

        # Missing carer assignment
        if not visit.employee_id:
            audits.append({
                "type": "UnassignedVisit",
                "visit_id": visit.id,
                "client_id": visit.client.id if visit.client else None,
                "client": visit.client.full_name if visit.client else "Unknown",
                "date": str(visit.date),
                "details": "Visit has no carer assigned"
            })

        # Visit Duration Check
        if visit.start_time and visit.end_time:
            try:
                fmt = "%H:%M"
                start = datetime.strptime(visit.start_time, fmt)
                end = datetime.strptime(visit.end_time, fmt)
                duration = (end - start).seconds / 60
                if duration < 30:
                    audits.append({
                        "type": "ShortShift",
                        "visit_id": visit.id,
                        "client_id": visit.client.id if visit.client else None,
                        "client": visit.client.full_name if visit.client else "Unknown",
                        "employee_id": visit.employee.id if visit.employee else None,
                        "employee": visit.employee.full_name if visit.employee else "Unknown",
                        "date": str(visit.date),
                        "details": f"Shift duration too short ({duration:.0f} minutes)"
                    })
                if duration > 720:
                    audits.append({
                        "type": "LongShift",
                        "visit_id": visit.id,
                        "client_id": visit.client.id if visit.client else None,
                        "client": visit.client.full_name if visit.client else "Unknown",
                        "employee_id": visit.employee.id if visit.employee else None,
                        "employee": visit.employee.full_name if visit.employee else "Unknown",
                        "date": str(visit.date),
                        "details": f"Shift duration too long ({duration:.0f} minutes)"
                    })
            except:
                pass

    # No upcoming visits check
    start_date = (datetime.now() + timedelta(hours=24)).date()
    end_date = (datetime.now() + timedelta(hours=48)).date()
    scheduled_client_ids = {
        row[0] for row in db.query(Visit.client_id)
        .filter(Visit.date >= start_date, Visit.date <= end_date)
        .distinct()
        .all()
    }

    no_visit_clients = db.query(Client).filter(Client.id.notin_(scheduled_client_ids)).all()

    for client in no_visit_clients:
        audits.append({
            "type": "NoVisitScheduled",
            "client_id": client.id,
            "client": client.full_name,
            "date": str(today),
            "details": "Client has no visits scheduled in the next 24–48 hours"
        })

    return {"audits": audits}
    
@router.get("/alerts")
def get_visit_alerts(db: Session = Depends(get_db)):
    alerts = []
    visits = db.query(Visit).all()

    # Group visits by employee and date
    by_employee_date = {}
    for visit in visits:
        if not visit.employee_id:
            alerts.append({
                "visit_id": visit.id,
                "type": "unassigned",
                "issue": "No carer assigned"
            })
            continue

        key = (visit.employee_id, visit.date)
        by_employee_date.setdefault(key, []).append(visit)

    # Check for overlaps and overbooking
    for (employee_id, date), day_visits in by_employee_date.items():
        day_visits.sort(key=lambda v: v.start_time)

        if len(day_visits) > 5:
            for v in day_visits:
                alerts.append({
                    "visit_id": v.id,
                    "type": "overbooked",
                    "issue": f"{len(day_visits)} visits scheduled for carer #{employee_id} on {date}"
                })

        for i in range(len(day_visits) - 1):
            v1 = day_visits[i]
            v2 = day_visits[i + 1]
            if v1.end_time > v2.start_time:
                alerts.append({
                    "visit_id": v2.id,
                    "type": "conflict",
                    "issue": f"Overlaps with Visit #{v1.id} on {date}",
                    "employee_id": employee_id
                })

    return alerts

@router.get("/visit-conflicts")
def get_visit_conflicts(db: Session = Depends(get_db)):
    visits = db.query(Visit).order_by(Visit.employee_id, Visit.date, Visit.start_time).all()
    conflicts = []

    last_visit_map = {}

    for visit in visits:
        key = (visit.employee_id, visit.date)

        if key in last_visit_map:
            prev = last_visit_map[key]
            # Check for overlap
            if visit.start_time and visit.end_time and prev.end_time:
                if visit.start_time < prev.end_time:
                    conflicts.append({
                        "visit_id": visit.id,
                        "client_id": visit.client.id if visit.client else None,
                        "client_name": visit.client.full_name if visit.client else "Unknown",
                        "employee_id": visit.employee.id if visit.employee else None,
                        "employee_name": visit.employee.full_name if visit.employee else "Unknown",
                        "date": str(visit.date),
                        "start_time": visit.start_time,
                        "end_time": visit.end_time,
                        "conflict_reason": "Overlapping visit with previous"
                    })
        last_visit_map[key] = visit

    return conflicts
