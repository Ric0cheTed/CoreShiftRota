from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    username: str
    password: str
    role: str = "carer"
    employee_id: Optional[int] = None  # ✅ ADD THIS


class UserOut(BaseModel):
    id: int
    username: str
    role: str

    class Config:
        from_attributes = True


class UserDisplay(BaseModel):
    id: int
    username: str
    role: str

    class Config:
        from_attributes = True
