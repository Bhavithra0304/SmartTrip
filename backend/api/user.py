from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.connection import get_db
from models.user import User
from models.trip import Trip
from models.favorite import Favorite
from api.auth import get_current_user

router = APIRouter(prefix="/user", tags=["User Dashboard & Metrics"])

@router.get("/dashboard-stats")
def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    trips = db.query(Trip).filter(Trip.user_id == current_user.id).order_by(Trip.created_at.desc()).all()
    favorites_count = db.query(Favorite).filter(Favorite.user_id == current_user.id).count()
    
    upcoming_trips = [t for t in trips[:3]]
    recent_searches = [
        {"destination": t.destination, "dates": t.travel_dates, "budget": t.budget, "id": t.id}
        for t in trips[:5]
    ]

    total_budget_planned = sum([t.budget for t in trips])
    
    return {
        "user_name": current_user.full_name,
        "email": current_user.email,
        "total_trips": len(trips),
        "total_favorites": favorites_count,
        "total_budget_planned": total_budget_planned,
        "preferred_currency": current_user.preferred_currency,
        "upcoming_trips": upcoming_trips,
        "recent_searches": recent_searches,
        "latest_weather_widget": trips[0].weather_info if trips else {
            "destination": "Paris",
            "average_temperature_c": 22.5,
            "condition": "Mostly Sunny",
            "rain_probability_percent": 10
        }
    }
