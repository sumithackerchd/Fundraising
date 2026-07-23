from pydantic import BaseModel, ConfigDict
from datetime import datetime
from app.models.donation import PaymentStatus
from typing import Optional

class DonationBase(BaseModel):
    amount: float
    message: Optional[str] = None
    is_anonymous: bool = False
    campaign_id: int

class DonationCreate(DonationBase):
    pass

class DonationResponse(DonationBase):
    id: int
    status: PaymentStatus
    user_id: Optional[int] = None
    created_at: datetime
    
    # Extra fields for response
    donor_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class PaymentIntent(BaseModel):
    client_secret: str
    donation_id: int
