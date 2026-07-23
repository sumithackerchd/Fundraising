from fastapi import FastAPI

from app.core.database import Base, engine

from app.models.user import User

from app.routes.auth import router as auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FundRaise AI",
    version="1.0.0",
)

app.include_router(auth_router)


@app.get("/")
def home():

    return {
        "status": "success",
        "message": "FundRaise AI Backend Running 🚀"
    }