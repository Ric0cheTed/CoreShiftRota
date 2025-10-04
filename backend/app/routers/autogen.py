from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.dependencies import get_db
from app.utils.auth import get_current_admin, require_role
from app.schemas.autogen import AutogenRequest, AutogenResponse
from app.models.visit import Visit
from app.core.autogen import generate_autogen_suggestions

router = APIRouter(prefix="/autogen", tags=["autogen"])

@router.post("/assign")
def auto_assign_visits(
    request: AutogenRequest,
    db: Session = Depends(get_db),
    admin=Depends(require_role("admin")),
):
    from app.core.autogen import generate_autogen_suggestions
    from app.models.visit import Visit

    suggestions_by_visit = generate_autogen_suggestions(db, request.visit_ids)
    updated_visits = []

    for entry in suggestions_by_visit:
        visit_id = entry["visit_id"]
        suggestions = entry["suggestions"]
        top = suggestions[0] if suggestions else None

        if top:
            visit = db.query(Visit).filter(Visit.id == visit_id).first()
            if visit:
                visit.employee_id = top["employee_id"]
                db.add(visit)
                updated_visits.append({
                    "visit_id": visit.id,
                    "employee_id": visit.employee_id
                })

    db.commit()
    return updated_visits

@router.post("/suggestions", response_model=AutogenResponse)
def get_autogen_suggestions(
    request: AutogenRequest,
    db: Session = Depends(get_db),
    admin=Depends(require_role("admin")),
):
    suggestions = generate_autogen_suggestions(db, request.visit_ids)
    return {"suggestions": suggestions}
