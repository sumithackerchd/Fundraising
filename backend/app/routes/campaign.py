from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.dependencies import get_current_user, get_current_admin_user
from app.models.user import User
from app.schemas.campaign import CampaignCreate, CampaignUpdate, CampaignResponse
from app.services.campaign_service import CampaignService
from app.repositories.campaign_repository import CampaignRepository

router = APIRouter(
    prefix="/campaigns",
    tags=["Campaigns"],
)

@router.get("/", response_model=List[CampaignResponse])
def get_campaigns(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return CampaignRepository.get_active(db, skip=skip, limit=limit)
    
@router.get("/all", response_model=List[CampaignResponse])
def get_all_campaigns(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_admin_user)):
    return CampaignRepository.get_all(db, skip=skip, limit=limit)

@router.get("/me", response_model=List[CampaignResponse])
def get_my_campaigns(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return CampaignRepository.get_by_user(db, current_user.id)

@router.get("/{campaign_id}", response_model=CampaignResponse)
def get_campaign(campaign_id: int, db: Session = Depends(get_db)):
    campaign = CampaignRepository.get_by_id(db, campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign

@router.post("/", response_model=CampaignResponse)
def create_campaign(
    data: CampaignCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return CampaignService.create_campaign(db, data, current_user)

@router.put("/{campaign_id}", response_model=CampaignResponse)
def update_campaign(
    campaign_id: int,
    data: CampaignUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    campaign = CampaignService.update_campaign(db, campaign_id, data, current_user)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found or not authorized")
    return campaign

@router.post("/{campaign_id}/submit", response_model=CampaignResponse)
def submit_campaign(
    campaign_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    campaign = CampaignService.submit_for_approval(db, campaign_id, current_user)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found or not authorized")
    return campaign

@router.post("/{campaign_id}/approve", response_model=CampaignResponse)
def approve_campaign(
    campaign_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    campaign = CampaignService.approve_campaign(db, campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign

@router.post("/{campaign_id}/reject", response_model=CampaignResponse)
def reject_campaign(
    campaign_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    campaign = CampaignService.reject_campaign(db, campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign
