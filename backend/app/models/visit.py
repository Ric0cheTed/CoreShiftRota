from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Visit(Base):
    __tablename__ = "visits"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date)  # Ensure this column exists in your Visit model
    start_time = Column(String)
    end_time = Column(String)
    employee_id = Column(Integer, ForeignKey('employees.id'))
    client_id = Column(Integer, ForeignKey('clients.id'))
    notes = Column(String)

    employee = relationship("Employee", back_populates="visits")
    client = relationship("Client", back_populates="visits")

