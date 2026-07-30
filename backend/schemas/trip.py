from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class TripRequest(BaseModel):
    destination: str
    budget: float
    travel_dates: str
    num_travelers: int = 1
    interests: List[str] = []
    special_notes: Optional[str] = ""

class TripResponse(BaseModel):
    id: int
    user_id: int
    title: str
    destination: str
    budget: float
    travel_dates: str
    num_travelers: int
    interests: List[str]
    itinerary_data: Dict[str, Any]
    budget_breakdown: Dict[str, Any]
    weather_info: Dict[str, Any]
    routes_info: Dict[str, Any]
    local_events: Optional[Dict[str, Any]] = {}
    safety_prediction: Optional[Dict[str, Any]] = {}
    crowd_prediction: Optional[Dict[str, Any]] = {}
    booking_options: Optional[Dict[str, Any]] = {}
    rag_recommendations: Dict[str, Any]
    agent_logs: List[Dict[str, Any]]
    is_saved: str
    created_at: datetime

    class Config:
        from_attributes = True

class FavoriteCreate(BaseModel):
    destination: str
    category: str = "Attraction"
    title: str
    description: Optional[str] = ""
    details: Optional[Dict[str, Any]] = {}

class FavoriteResponse(BaseModel):
    id: int
    user_id: int
    destination: str
    category: str
    title: str
    description: Optional[str]
    details: Optional[Dict[str, Any]]
    created_at: datetime

    class Config:
        from_attributes = True
