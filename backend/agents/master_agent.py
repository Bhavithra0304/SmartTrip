import time
import asyncio
from typing import Dict, Any, List, Optional
from services.groq_service import groq_service
from agents.planner_agent import planner_agent
from agents.budget_agent import budget_agent
from agents.weather_agent import weather_agent
from agents.navigation_agent import navigation_agent
from agents.recommendation_agent import recommendation_agent
from agents.local_events_agent import local_events_agent
from agents.safety_agent import safety_agent
from agents.crowd_agent import crowd_agent

class MasterAgent:
    """
    Master Agent Responsibilities:
    - Receive user travel request prompt or structured parameters.
    - Extract destination, budget, travel dates, travelers, interests, and currency using Groq LLM.
    - Coordinate specialized sub-agents asynchronously via asyncio.gather:
      1. Trip Planning Agent (TomTom POI Search + Groq LLM)
      2. Budget Optimization Agent (ExchangeRate API + Groq LLM)
      3. Weather Intelligence Agent (Open-Meteo Forecast & Geocoding API)
      4. Navigation Agent (TomTom Routing API)
      5. Recommendation Agent (TomTom Nearby + ChromaDB RAG + Groq LLM)
      6. Local Events Agent (PredictHQ API + Groq LLM)
      7. Safety Prediction Agent (Open-Meteo Alerts + TomTom Safety POI + Groq LLM)
      8. Crowd Prediction Agent (TomTom Traffic/POI + Groq LLM)
    - Merge outputs from every agent into one unified response.
    - Return detailed execution logs showing timestamps and statuses of all sub-agents.
    """

    async def plan_trip_from_query(self, user_query: str, default_currency: str = "USD") -> Dict[str, Any]:
        """Parses raw user query text using Groq LLM, then triggers full multi-agent workflow."""
        extracted = await groq_service.parse_user_query(user_query)
        
        return await self.plan_trip(
            destination=extracted.get("destination", "Paris"),
            budget=float(extracted.get("budget", 1500.0)),
            travel_dates=str(extracted.get("travel_dates", "3 Days")),
            num_travelers=int(extracted.get("num_travelers", 1)),
            interests=extracted.get("interests", ["Culture", "Food", "Sightseeing"]),
            currency=extracted.get("currency") or default_currency
        )

    async def plan_trip(
        self,
        destination: str,
        budget: float,
        travel_dates: str,
        num_travelers: int = 1,
        interests: List[str] = None,
        currency: str = "USD"
    ) -> Dict[str, Any]:
        destination = destination.strip().title()
        interests = interests or ["Culture", "Food", "Sightseeing"]
        currency = currency.upper()
        start_time = time.time()
        logs = []

        def add_log(agent_id: str, agent_name: str, status: str, message: str):
            logs.append({
                "agent_id": agent_id,
                "agent_name": agent_name,
                "status": status,
                "message": message,
                "timestamp": round(time.time() - start_time, 3)
            })

        add_log("master", "Master Agent", "running", f"Received request for {destination} (Budget: {currency} {budget:,.2f}, Dates: {travel_dates}, Travelers: {num_travelers}).")

        # Extract number of days
        num_days = planner_agent.parse_num_days(travel_dates)

        add_log("master", "Master Agent", "coordinating", "Launching specialized sub-agents asynchronously...")

        # Task 1: Weather Intelligence Agent
        add_log("weather", "Weather Intelligence Agent", "running", f"Fetching Open-Meteo forecast for {destination}...")
        weather_task = weather_agent.run_async(destination, travel_dates)
        
        # Task 2: Trip Planning Agent
        add_log("planner", "Trip Planning Agent", "running", f"Organizing {num_days}-day itinerary via TomTom POI Search & Groq LLM...")
        planner_task = planner_agent.run_async(destination, budget, travel_dates, num_travelers, interests)

        # Task 3: Budget Optimization Agent
        add_log("budget", "Budget Optimization Agent", "running", f"Calculating live currency conversion & budget splits via ExchangeRate API...")
        budget_task = budget_agent.run_async(budget, currency, num_days, num_travelers, destination)

        # Task 4: Recommendation Agent
        add_log("recommendation", "Recommendation Agent (RAG)", "running", f"Retrieving RAG vector guide & TomTom nearby venues for {destination}...")
        recommendation_task = recommendation_agent.run_async(destination, interests)

        # Task 5: Local Events Agent
        add_log("events", "Local Events Agent", "running", f"Fetching live festivals & events via PredictHQ API for {destination}...")
        events_task = local_events_agent.run_async(destination, travel_dates, budget, interests)

        # Task 6: Safety Prediction Agent
        add_log("safety", "Safety Prediction Agent", "running", f"Analyzing weather risks & mapping emergency contacts for {destination}...")
        safety_task = safety_agent.run_async(destination, travel_dates)

        # Task 7: Crowd Prediction Agent
        add_log("crowd", "Crowd Prediction Agent", "running", f"Predicting attraction crowd density & peak hours for {destination}...")
        crowd_task = crowd_agent.run_async(destination, travel_dates)

        # Await parallel sub-agents
        weather_report, trip_plan, budget_report, rag_recs, events_report, safety_report, crowd_report = await asyncio.gather(
            weather_task, planner_task, budget_task, recommendation_task, events_task, safety_task, crowd_task
        )

        add_log("weather", "Weather Intelligence Agent", "completed", f"Live weather fetched: {weather_report['condition']} ({weather_report['temperature_c']}°C).")
        add_log("planner", "Trip Planning Agent", "completed", f"Generated {trip_plan['total_days']}-day itinerary with visit timings & estimated durations.")
        add_log("budget", "Budget Optimization Agent", "completed", f"Allocated budget categories ({budget_report['currency']} {budget_report['converted_total_budget']:,.2f}).")
        add_log("recommendation", "Recommendation Agent (RAG)", "completed", f"Retrieved personalized dining, cafés, shopping, and hidden gems.")
        add_log("events", "Local Events Agent", "completed", f"Curated {events_report.get('events_count', 0)} live events matching user interests in {destination}.")
        add_log("safety", "Safety Prediction Agent", "completed", f"Calculated Safety Score of {safety_report.get('safety_score', 85)}/100 ({safety_report.get('safety_status', 'Safe')}).")
        add_log("crowd", "Crowd Prediction Agent", "completed", f"Predicted Crowd Score of {crowd_report.get('crowd_score', 58)}/100 ({crowd_report.get('overall_crowd_level', 'Medium')}).")

        # Task 8: Navigation Agent using key spots from generated itinerary
        add_log("navigation", "Navigation Agent", "running", "Computing route matrix & transit travel times via TomTom Routing API...")
        key_spots = []
        for day in trip_plan.get("itinerary", []):
            spots_in_day = day.get("key_spots", [])
            key_spots.extend(spots_in_day)
        
        unique_route_spots = list(dict.fromkeys(key_spots))[:5]
        routes_info = await navigation_agent.run_async(destination, unique_route_spots)
        add_log("navigation", "Navigation Agent", "completed", f"Calculated routes covering {routes_info['total_distance_km']} km (~{routes_info['total_travel_time_hours']} hrs transit).")

        # Master Synthesis & Output Merging
        add_log("master", "Master Agent", "completed", f"Merged outputs from all sub-agents in {round(time.time() - start_time, 2)}s.")

        title = f"Unforgettable {num_days}-Day Journey in {destination}"
        summary_text = (
            f"PlanNgo has generated a comprehensive {num_days}-day trip to {destination}. "
            f"Featuring real-time attraction scheduling, budget allocation ({budget_report['currency']} {budget_report['converted_total_budget']:,.2f}), "
            f"live weather intelligence ({weather_report['temperature_c']}°C {weather_report['condition']}), route optimization ({routes_info['total_distance_km']} km), "
            f"PredictHQ local events, travel safety score ({safety_report.get('safety_score')}/100), and attraction crowd predictions."
        )

        return {
            "title": title,
            "destination": destination,
            "budget": budget,
            "currency": currency,
            "travel_dates": travel_dates,
            "num_travelers": num_travelers,
            "interests": interests,
            "execution_logs": logs,
            "total_execution_time_sec": round(time.time() - start_time, 2),
            "itinerary_data": trip_plan,
            "budget_breakdown": budget_report,
            "weather_info": weather_report,
            "routes_info": routes_info,
            "local_events": events_report,
            "safety_prediction": safety_report,
            "crowd_prediction": crowd_report,
            "rag_recommendations": rag_recs,
            "summary": summary_text
        }

master_agent = MasterAgent()
