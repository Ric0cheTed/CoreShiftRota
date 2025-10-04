from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

employee_tag_link = Table(
    "employee_tag_link",
    Base.metadata,
    Column("employee_id", Integer, ForeignKey("employees.id")),
    Column("tag_id", Integer, ForeignKey("tags.id")),
    extend_existing=True,
)

client_tag_link = Table(
    "client_tag_link",
    Base.metadata,
    Column("client_id", Integer, ForeignKey("clients.id")),
    Column("tag_id", Integer, ForeignKey("tags.id")),
    extend_existing=True,
)

class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

    employees = relationship("Employee", secondary=employee_tag_link, back_populates="tags")
    clients = relationship("Client", secondary=client_tag_link, back_populates="tags")
