from sqlalchemy.orm import Session
from app.models.campaign import Campaign, CampaignStatus

class CampaignRepository:
    
    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100):
        return db.query(Campaign).filter(Campaign.is_deleted == False).offset(skip).limit(limit).all()
        
    @staticmethod
    def get_active(db: Session, skip: int = 0, limit: int = 100):
        return db.query(Campaign).filter(
            Campaign.is_deleted == False, 
            Campaign.status == CampaignStatus.ACTIVE
        ).offset(skip).limit(limit).all()

    @staticmethod
    def get_by_id(db: Session, campaign_id: int):
        return db.query(Campaign).filter(Campaign.id == campaign_id, Campaign.is_deleted == False).first()
        
    @staticmethod
    def get_by_user(db: Session, user_id: int):
        return db.query(Campaign).filter(Campaign.user_id == user_id, Campaign.is_deleted == False).all()

    @staticmethod
    def create(db: Session, campaign: Campaign):
        db.add(campaign)
        db.commit()
        db.refresh(campaign)
        return campaign
        
    @staticmethod
    def update(db: Session, campaign: Campaign):
        db.commit()
        db.refresh(campaign)
        return campaign
        
    @staticmethod
    def delete(db: Session, campaign: Campaign):
        campaign.is_deleted = True
        db.commit()
        return campaign
