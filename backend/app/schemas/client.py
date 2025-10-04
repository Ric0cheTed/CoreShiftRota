from pydantic import BaseModel
from typing import Optional, List
from app.schemas.tag import TagOut

class ClientBase(BaseModel):
    full_name: str
    status: Optional[str] = "active"
    phone: Optional[str] = None
    address: Optional[str] = None
    access_details: Optional[str] = None
    care_notes: Optional[str] = None
    contact_method: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class ClientUpdate(ClientBase):
    pass

class ClientOut(ClientBase):
    id: int
    class Config:
        from_attributes = True

class ClientWithTags(ClientOut):
    tags: List[TagOut] = []

class ClientTagAssignment(BaseModel):
    tag_ids: List[int]
