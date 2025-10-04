from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    employee = relationship("Employee", back_populates="user", foreign_keys=[employee_id])
    is_active = Column(Boolean, default=True)
