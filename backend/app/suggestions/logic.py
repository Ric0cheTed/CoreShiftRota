from datetime import datetime, timedelta

def calculate_score(visit, employee, existing_visits):
    score = 0
    notes = []

    if employee.id == visit.employee_id:
        score += 5
        notes.append("Already assigned")

    if visit.date in [v.date for v in existing_visits]:
        overlap = any(
            v.start_time < visit.end_time and v.end_time > visit.start_time
            for v in existing_visits
        )
        if overlap:
            score -= 10
            notes.append("Time conflict")

    if employee.capacity and len(existing_visits) >= employee.capacity:
        score -= 5
        notes.append("At capacity")

    if visit.client_id in getattr(employee, "preferred_clients", []):
        score += 5
        notes.append("Preferred client")

    return {"employee_id": employee.id, "score": score, "reason": "; ".join(notes)}
