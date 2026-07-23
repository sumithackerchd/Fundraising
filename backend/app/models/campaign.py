from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Integer,
    String,
    Text,
    Float,
    ForeignKey,
    Enum,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base

class CampaignStatus(str, enum.Enum):
    DRAFT = "draft"
    PENDING = "pending"
    ACTIVE = "active"
    REJECTED = "rejected"
    COMPLETED = "completed"

class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    story = Column(Text, nullable=False)
    goal_amount = Column(Float, nullable=False)
    raised_amount = Column(Float, default=0.0)
    
    end_date = Column(DateTime(timezone=True), nullable=False)
    
    category = Column(String(100), nullable=True)
    tags = Column(String(255), nullable=True) # Comma separated
    
    image_url = Column(String(500), nullable=True)
    document_url = Column(String(500), nullable=True)
    
    status = Column(Enum(CampaignStatus), default=CampaignStatus.DRAFT)
    
    user_id = Column(Integer, ForeignKey("users.id"))
    
    is_deleted = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )
    
    creator = relationship("User")
