from sqlalchemy import Table, Column, Integer, ForeignKey
from app.database import Base

client_tag_link = Table(
    "client_tag_link",
    Base.metadata,
    Column("client_id", Integer, ForeignKey("clients.id")),
    Column("tag_id", Integer, ForeignKey("tags.id")),
    extend_existing=True  # ✅ prevents duplicate declaration crash
)

employee_tag_link = Table(
    "employee_tag_link",
    Base.metadata,
    Column("employee_id", Integer, ForeignKey("employees.id")),
    Column("tag_id", Integer, ForeignKey("tags.id")),
    extend_existing=True  # ✅ prevents duplicate declaration crash
)

employee_client_preference_link = Table(
    "employee_client_preference_link",
    Base.metadata,
    Column("employee_id", Integer, ForeignKey("employees.id")),
    Column("client_id", Integer, ForeignKey("clients.id")),
    extend_existing=True
)
