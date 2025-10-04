from sqlalchemy import Column, Integer, String, Time, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Availability(Base):
    __tablename__ = "availability"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"))
    day_of_week = Column(String, nullable=False)  # ← ✅ This line is missing
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)

    employee = relationship("Employee", back_populates="availability")
