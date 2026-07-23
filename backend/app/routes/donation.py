from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.donation import Donation, PaymentStatus
from app.models.campaign import Campaign, CampaignStatus
from app.schemas.donation import DonationCreate, DonationResponse, PaymentIntent

router = APIRouter(
    prefix="/donations",
    tags=["Donations"],
)

@router.post("/", response_model=PaymentIntent)
def create_donation(
    data: DonationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    campaign = db.query(Campaign).filter(Campaign.id == data.campaign_id).first()
    if not campaign or campaign.status != CampaignStatus.ACTIVE:
        raise HTTPException(status_code=400, detail="Campaign is not active")

    donation = Donation(
        **data.model_dump(),
        user_id=current_user.id,
        status=PaymentStatus.PENDING
    )
    
    db.add(donation)
    db.commit()
    db.refresh(donation)
    
    # Mocking Payment Intent creation (e.g. Stripe/Razorpay)
    client_secret = f"mock_secret_{uuid.uuid4()}"
    
    return {"client_secret": client_secret, "donation_id": donation.id}

@router.post("/{donation_id}/confirm", response_model=DonationResponse)
def confirm_donation(
    donation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(status_code=404, detail="Donation not found")
        
    if donation.status == PaymentStatus.COMPLETED:
        return donation

    donation.status = PaymentStatus.COMPLETED
    
    # Update campaign raised amount
    campaign = db.query(Campaign).filter(Campaign.id == donation.campaign_id).first()
    if campaign:
        campaign.raised_amount += donation.amount
    
    db.commit()
    db.refresh(donation)
    
    return donation

@router.get("/campaign/{campaign_id}", response_model=List[DonationResponse])
def get_campaign_donations(campaign_id: int, db: Session = Depends(get_db)):
    donations = db.query(Donation).filter(
        Donation.campaign_id == campaign_id,
        Donation.status == PaymentStatus.COMPLETED
    ).order_by(Donation.created_at.desc()).all()
    
    # Add donor names for non-anonymous donations
    result = []
    for d in donations:
        d_resp = DonationResponse.model_validate(d)
        if not d.is_anonymous and d.user:
            d_resp.donor_name = d.user.full_name
        else:
            d_resp.donor_name = "Anonymous"
        result.append(d_resp)
        
    return result

@router.get("/me", response_model=List[DonationResponse])
def get_my_donations(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Donation).filter(
        Donation.user_id == current_user.id,
        Donation.status == PaymentStatus.COMPLETED
    ).order_by(Donation.created_at.desc()).all()
