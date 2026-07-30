from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from config import settings
from models.user import User
from api.auth import get_current_user

router = APIRouter(prefix="/settings", tags=["Application Settings"])

class SettingsUpdateReq(BaseModel):
    preferred_currency: Optional[str] = "USD"
    notifications_enabled: Optional[bool] = True
    travel_style: Optional[str] = "Balanced"

@router.get("/")
def get_system_settings(current_user: User = Depends(get_current_user)):
    return {
        "user_settings": {
            "preferred_currency": current_user.preferred_currency,
            "notifications_enabled": current_user.notifications_enabled,
            "travel_style": current_user.travel_style
        },
        "api_status": {
            "openai_configured": bool(settings.OPENAI_API_KEY),
            "google_maps_configured": bool(settings.GOOGLE_MAPS_API_KEY),
            "openweather_configured": bool(settings.OPENWEATHER_API_KEY),
            "currency_api_configured": bool(settings.CURRENCY_API_KEY),
            "chroma_rag_ready": True
        }
    }
