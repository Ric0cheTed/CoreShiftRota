from fastapi import APIRouter, Depends, Body, Query
from typing import List
from app.domain.rota.services import RotaService, get_rota_service
from app.schemas.visit import VisitSuggestion, VisitSuggestionRequest

router = APIRouter(prefix="/rota", tags=["rota"])

@router.post("/suggest", response_model=List[VisitSuggestion])
def suggest(payload: VisitSuggestionRequest = Body(...), svc: RotaService = Depends(get_rota_service)):
    return svc.suggest(
        date=str(payload.date),
        start_time=payload.start_time,
        end_time=payload.end_time,
        client_id=payload.client_id,
    )

@router.post("/assign")
def assign(visit_id: int = Query(...), employee_id: int = Query(...), svc: RotaService = Depends(get_rota_service)):
    return svc.assign(visit_id, employee_id)