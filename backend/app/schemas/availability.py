from pydantic import BaseModel
from datetime import time
from typing import List

class AvailabilityBase(BaseModel):
    day_of_week: str
    start_time: time
    end_time: time

class AvailabilityCreate(AvailabilityBase):
    employee_id: int

class AvailabilityOut(AvailabilityBase):
    id: int
    employee_id: int

    class Config:
        from_attributes = True
