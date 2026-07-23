from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import asyncio

router = APIRouter(
    prefix="/ai",
    tags=["AI Features"],
)

class StoryRequest(BaseModel):
    title: str
    description: str
    tone: str = "emotional"

class SeoRequest(BaseModel):
    title: str
    story: str

class TranslationRequest(BaseModel):
    text: str
    target_language: str

@router.post("/generate-story")
async def generate_story(req: StoryRequest):
    # Mocking AI Service call
    await asyncio.sleep(2)
    return {
        "generated_story": f"Here is a compelling story for '{req.title}'. This campaign aims to {req.description}. With your help, we can make a huge impact. Every contribution brings us closer to our goal. Thank you for your support!"
    }

@router.post("/generate-seo")
async def generate_seo(req: SeoRequest):
    # Mocking AI Service call
    await asyncio.sleep(1)
    return {
        "seo_title": f"Support {req.title} | FundRaise AI",
        "seo_description": req.story[:150] + "...",
        "keywords": "fundraising, donation, support, " + req.title.split()[0].lower()
    }

@router.post("/translate")
async def translate_text(req: TranslationRequest):
    # Mocking AI Service call
    await asyncio.sleep(1)
    return {
        "translated_text": f"[Translated to {req.target_language}]: {req.text}"
    }
