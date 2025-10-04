from pydantic import BaseModel
from typing import List, Optional

class VisitInput(BaseModel):
    date: str
    start_time: str
    end_time: Optional[str] = None
    client_id: int
    employee_id: Optional[int] = None

class Candidate(BaseModel):
    id: int
    label: Optional[str] = None

class Reason(BaseModel):
    kind: str
    source: str
    value: float
    note: Optional[str] = None

class Suggestion(BaseModel):
    employee_id: int
    score: float
    reasons: List[Reason] = []

class ScoreContext(BaseModel):
    pass