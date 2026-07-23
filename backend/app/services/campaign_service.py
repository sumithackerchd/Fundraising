from sqlalchemy.orm import Session
from app.models.campaign import Campaign, CampaignStatus
from app.schemas.campaign import CampaignCreate, CampaignUpdate
from app.repositories.campaign_repository import CampaignRepository
from app.models.user import User

class CampaignService:
    @staticmethod
    def create_campaign(db: Session, data: CampaignCreate, user: User) -> Campaign:
        campaign = Campaign(
            **data.model_dump(),
            user_id=user.id,
            status=CampaignStatus.DRAFT
        )
        return CampaignRepository.create(db, campaign)

    @staticmethod
    def submit_for_approval(db: Session, campaign_id: int, user: User) -> Campaign:
        campaign = CampaignRepository.get_by_id(db, campaign_id)
        if not campaign or campaign.user_id != user.id:
            return None
        campaign.status = CampaignStatus.PENDING
        return CampaignRepository.update(db, campaign)
        
    @staticmethod
    def approve_campaign(db: Session, campaign_id: int) -> Campaign:
        campaign = CampaignRepository.get_by_id(db, campaign_id)
        if not campaign:
            return None
        campaign.status = CampaignStatus.ACTIVE
        return CampaignRepository.update(db, campaign)
        
    @staticmethod
    def reject_campaign(db: Session, campaign_id: int) -> Campaign:
        campaign = CampaignRepository.get_by_id(db, campaign_id)
        if not campaign:
            return None
        campaign.status = CampaignStatus.REJECTED
        return CampaignRepository.update(db, campaign)
        
    @staticmethod
    def update_campaign(db: Session, campaign_id: int, data: CampaignUpdate, user: User) -> Campaign:
        campaign = CampaignRepository.get_by_id(db, campaign_id)
        if not campaign or campaign.user_id != user.id:
            return None
            
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(campaign, key, value)
            
        return CampaignRepository.update(db, campaign)
