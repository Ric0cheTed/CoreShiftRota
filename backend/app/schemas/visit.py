from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date, time

class VisitBase(BaseModel):
    date: date
    start_time: str
    end_time: Optional[str] = None
    employee_id: Optional[int] = None
    client_id: int
    notes: Optional[str] = None

class VisitCreate(BaseModel):
    client_id: int
    employee_id: Optional[int]
    start_time: datetime
    end_time: datetime
    notes: Optional[str]

class VisitUpdate(BaseModel):
    notes: Optional[str]
    employee_id: Optional[int]
    start_time: Optional[str]  # change to str
    end_time: Optional[str]

class VisitOut(BaseModel):
    id: int
    date: str
    start_time: str
    end_time: str
    employee_id: Optional[int] = None
    client_id: int
    notes: Optional[str]
    client_name: str
    employee_name: str

    class Config:
        from_attributes = True

class ClientMini(BaseModel):
    id: int
    full_name: str
    class Config:
        from_attributes = True

class EmployeeMini(BaseModel):
    id: int
    full_name: str
    class Config:
        from_attributes = True

class VisitDisplay(BaseModel):
    id: int
    date: date
    start_time: time
    end_time: time
    client: Optional[ClientMini]
    employee: Optional[EmployeeMini]
    notes: Optional[str]
    class Config:
        from_attributes = True
        
class VisitSuggestion(BaseModel):
    employee_id: int
    score: int
    reason: str

class VisitSuggestionRequest(BaseModel):
    date: date
    start_time: str
    end_time: str
    client_id: int