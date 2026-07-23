from pydantic import BaseModel, ConfigDict
from datetime import datetime
from app.models.campaign import CampaignStatus
from typing import Optional

class CampaignBase(BaseModel):
    title: str
    story: str
    goal_amount: float
    end_date: datetime
    category: Optional[str] = None
    tags: Optional[str] = None
    image_url: Optional[str] = None
    document_url: Optional[str] = None

class CampaignCreate(CampaignBase):
    pass

class CampaignUpdate(BaseModel):
    title: Optional[str] = None
    story: Optional[str] = None
    goal_amount: Optional[float] = None
    end_date: Optional[datetime] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    image_url: Optional[str] = None
    document_url: Optional[str] = None

class CampaignResponse(CampaignBase):
    id: int
    raised_amount: float
    status: CampaignStatus
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
