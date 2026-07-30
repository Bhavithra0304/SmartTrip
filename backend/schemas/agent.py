from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class AgentStepProgress(BaseModel):
    agent_id: str
    agent_name: str
    status: str # "pending", "running", "completed", "failed"
    message: str
    timestamp: float

class MasterAgentResponse(BaseModel):
    trip_title: str
    destination: str
    total_budget: float
    travel_dates: str
    num_travelers: int
    execution_steps: List[AgentStepProgress]
    trip_plan: Dict[str, Any]
    budget_report: Dict[str, Any]
    weather_report: Dict[str, Any]
    navigation_routes: Dict[str, Any]
    booking_recommendations: Dict[str, Any]
    rag_recommendations: Dict[str, Any]
    summary_message: str

class ChatMessage(BaseModel):
    role: str # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage] = []
    context: Optional[Dict[str, Any]] = None
