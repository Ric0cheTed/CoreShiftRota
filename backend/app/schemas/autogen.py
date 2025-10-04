from pydantic import BaseModel
from typing import List, Optional

class Suggestion(BaseModel):
    employee_id: int
    employee_name: str
    start_time: str
    end_time: str
    score: int
    reasons: List[str]  # ✅ replace `reason: str`

class VisitSuggestion(BaseModel):
    visit_id: int
    suggestions: List[Suggestion]

class AutogenRequest(BaseModel):
    visit_ids: List[int]

class AutogenResponse(BaseModel):
    suggestions: List[VisitSuggestion]
