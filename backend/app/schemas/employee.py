from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from app.schemas.tag import TagOut
from app.schemas.client import ClientOut

class EmployeeBase(BaseModel):
    full_name: str
    role: Optional[str] = "carer"
    phone: Optional[str] = None
    email: Optional[str] = None
    status: Optional[str] = "active"
    start_date: Optional[date] = None
    max_hours_per_week: Optional[int] = 40
    has_car: Optional[bool] = False
    travel_mode: Optional[str] = "car"
    capacity: Optional[int] = None
    car_access: Optional[bool] = False
    availability_summary: Optional[str] = None
    notes: Optional[str] = None

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(EmployeeBase):
    pass

class EmployeeOut(EmployeeBase):
    id: int
    class Config:
        from_attributes = True

class EmployeeDisplay(EmployeeOut):
    tags: List[TagOut] = []
    client_preferences: List[ClientOut] = []
