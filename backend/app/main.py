from fastapi import FastAPI

from app.core.database import Base, engine

from app.models.user import User

from app.routes.auth import router as auth_router
from app.routes.campaign import router as campaign_router
from app.routes.donation import router as donation_router
from app.routes.ai import router as ai_router

from app.models.donation import Donation, WithdrawalRequest

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FundRaise AI",
    version="1.0.0",
)

app.include_router(auth_router)
app.include_router(campaign_router)
app.include_router(donation_router)
app.include_router(ai_router)


@app.get("/")
def home():

    return {
        "status": "success",
        "message": "FundRaise AI Backend Running 🚀"
    }