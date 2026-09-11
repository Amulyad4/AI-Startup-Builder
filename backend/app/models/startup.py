from sqlalchemy import Column, Integer, String, JSON, DateTime
from sqlalchemy.sql import func
from app.database import Base

class StartupBlueprint(Base):
    __tablename__ = "startup_blueprints"

    id = Column(Integer, primary_key=True, index=True)
    idea = Column(String, index=True)
    
    validation = Column(JSON, nullable=True)
    market = Column(JSON, nullable=True)
    competitors = Column(JSON, nullable=True)
    persona = Column(JSON, nullable=True)
    business_model = Column(JSON, nullable=True)
    mvp = Column(JSON, nullable=True)
    financial = Column(JSON, nullable=True)
    risk = Column(JSON, nullable=True)
    marketing = Column(JSON, nullable=True)
    pitch = Column(JSON, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
