from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database.connection import Base

class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    budget = Column(Float, nullable=False)
    travel_dates = Column(String, nullable=False) # e.g., "2026-08-10 to 2026-08-15"
    num_travelers = Column(Integer, default=1)
    interests = Column(JSON, default=list) # e.g. ["Culture", "Food", "Beach"]
    
    # Store complete structured response from specialized services
    itinerary_data = Column(JSON, nullable=False)
    budget_breakdown = Column(JSON, nullable=False)
    weather_info = Column(JSON, nullable=False)
    routes_info = Column(JSON, nullable=False)
    local_events = Column(JSON, default=dict)
    safety_prediction = Column(JSON, default=dict)
    crowd_prediction = Column(JSON, default=dict)
    booking_options = Column(JSON, nullable=True, default=dict)
    rag_recommendations = Column(JSON, nullable=False)
    agent_logs = Column(JSON, default=list)

    status = Column(String, default="completed") # draft, completed, archived
    is_saved = Column(String, default="true")
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="trips")
