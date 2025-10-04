from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.tag import employee_tag_link
from app.models.link_tables import employee_client_preference_link

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    role = Column(String, default="carer")
    phone = Column(String)
    email = Column(String)
    status = Column(String, default="active")
    start_date = Column(Date)
    max_hours_per_week = Column(Integer, default=40)
    has_car = Column(Boolean, default=False)
    travel_mode = Column(String, default="car")
    capacity = Column(Integer, nullable=True)
    car_access = Column(Boolean, default=False)
    availability_summary = Column(String, nullable=True)
    notes = Column(String, nullable=True)

    # Remove user_id FK; use backref only
    user = relationship("User", back_populates="employee", uselist=False)

    # Relationships
    tags = relationship("Tag", secondary=employee_tag_link, back_populates="employees")
    availability = relationship("Availability", back_populates="employee", cascade="all, delete-orphan")
    visits = relationship("Visit", back_populates="employee")
    client_preferences = relationship("Client", secondary=employee_client_preference_link)
