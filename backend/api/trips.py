from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database.connection import get_db
from models.user import User
from models.trip import Trip
from models.favorite import Favorite
from schemas.trip import TripRequest, TripResponse, FavoriteCreate, FavoriteResponse
from api.auth import get_current_user
from agents.master_agent import master_agent

router = APIRouter(prefix="/trips", tags=["Trips & Planning"])

@router.post("/generate")
async def generate_trip(
    req: TripRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Triggers complete multi-agent workflow to generate structured trip itinerary,
    budget breakdown, live weather, optimized transit routes, PredictHQ local events,
    Safety Risk analysis, and Crowd Predictions.
    """
    master_result = await master_agent.plan_trip(
        destination=req.destination,
        budget=req.budget,
        travel_dates=req.travel_dates,
        num_travelers=req.num_travelers,
        interests=req.interests,
        currency=current_user.preferred_currency or "USD"
    )

    # Save trip directly to user database record
    new_trip = Trip(
        user_id=current_user.id,
        title=master_result["title"],
        destination=master_result["destination"],
        budget=master_result["budget"],
        travel_dates=master_result["travel_dates"],
        num_travelers=master_result["num_travelers"],
        interests=master_result["interests"],
        itinerary_data=master_result["itinerary_data"],
        budget_breakdown=master_result["budget_breakdown"],
        weather_info=master_result["weather_info"],
        routes_info=master_result["routes_info"],
        local_events=master_result.get("local_events", {}),
        safety_prediction=master_result.get("safety_prediction", {}),
        crowd_prediction=master_result.get("crowd_prediction", {}),
        booking_options=master_result.get("booking_options", {}),
        rag_recommendations=master_result["rag_recommendations"],
        agent_logs=master_result["execution_logs"],
        is_saved="true"
    )
    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)
    return new_trip

@router.get("/", response_model=List[TripResponse])
def get_user_trips(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Trip).filter(Trip.user_id == current_user.id).order_by(Trip.created_at.desc()).all()

@router.get("/{trip_id}", response_model=TripResponse)
def get_trip_detail(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found.")
    return trip

@router.delete("/{trip_id}")
def delete_trip(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == current_user.id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found.")
    db.delete(trip)
    db.commit()
    return {"message": "Trip deleted successfully"}

# Favorites
@router.post("/favorites", response_model=FavoriteResponse)
def add_favorite(
    fav_in: FavoriteCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    fav = Favorite(
        user_id=current_user.id,
        destination=fav_in.destination,
        category=fav_in.category,
        title=fav_in.title,
        description=fav_in.description,
        details=fav_in.details or {}
    )
    db.add(fav)
    db.commit()
    db.refresh(fav)
    return fav

@router.get("/favorites/list", response_model=List[FavoriteResponse])
def get_favorites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(Favorite).filter(Favorite.user_id == current_user.id).all()

@router.delete("/favorites/{fav_id}")
def delete_favorite(
    fav_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    fav = db.query(Favorite).filter(Favorite.id == fav_id, Favorite.user_id == current_user.id).first()
    if not fav:
        raise HTTPException(status_code=404, detail="Favorite item not found.")
    db.delete(fav)
    db.commit()
    return {"message": "Favorite item removed."}
