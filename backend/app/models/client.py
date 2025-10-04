from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.link_tables import client_tag_link
from app.models.tag import client_tag_link

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    status = Column(String, default="active")
    safeguarding_info = Column(String, nullable=True)
    access_details = Column(String, nullable=True)
    contact_method = Column(String, nullable=True)
    care_notes = Column(String, nullable=True)

    visits = relationship("Visit", back_populates="client")
    tags = relationship("Tag", secondary=client_tag_link, back_populates="clients")
