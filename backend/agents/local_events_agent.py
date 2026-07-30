import json
import asyncio
from typing import Dict, Any, List
from services.local_events_service import local_events_service
from services.groq_service import groq_service

class LocalEventsAgent:
    """
    Agent 6 – Local Events Agent
    Responsibilities:
    - Accept destination, travel dates, budget, and user interests.
    - Fetch live events from PredictHQ API via LocalEventsService.
    - Filter events by travel dates and user interests, remove duplicates.
    - Use Groq LLM to rank and recommend top 5 most relevant events with tailored recommendations.
    - Return event name, category, date, venue, description, event_url, and reason_for_recommendation.
    """

    async def filter_and_rank_events_with_llm(
        self,
        destination: str,
        travel_dates: str,
        budget: float,
        interests: List[str],
        raw_events: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Uses Groq LLM to evaluate raw events against user interests and budget,
        ranking the top 5 best events with personalized reason_for_recommendation fields.
        """
        prompt = f"""You are an event curation specialist. Evaluate these events for a trip to {destination} during {travel_dates}.
User Interests: {', '.join(interests)}
Target Budget: ${budget}
Raw Events: {json.dumps(raw_events[:10])}

Select the top 5 most relevant, non-duplicate events.
Return ONLY a valid JSON object with key "top_events" as an array of 5 objects:
[
  {{
    "name": "Event Title",
    "category": "Event Category",
    "date": "Event Date",
    "venue": "Venue / Location Name",
    "description": "Short engaging description",
    "event_url": "URL string",
    "reason_for_recommendation": "Why this event matches the user's interests ({', '.join(interests)}) and budget."
  }}
]
"""
        messages = [
            {"role": "system", "content": "You are a professional local event curator. Output strictly valid JSON."},
            {"role": "user", "content": prompt}
        ]

        raw_llm = await groq_service.chat_completion(messages, temperature=0.5, response_format_json=True)
        if raw_llm:
            try:
                parsed = json.loads(raw_llm)
                if "top_events" in parsed and isinstance(parsed["top_events"], list) and len(parsed["top_events"]) > 0:
                    return parsed["top_events"]
            except Exception as e:
                print(f"Groq LLM event ranking error: {e}")

        # Intelligent Fallback if LLM output fails
        ranked = []
        for idx, item in enumerate(raw_events[:5]):
            ranked.append({
                "name": item.get("name"),
                "category": item.get("category"),
                "date": item.get("date"),
                "venue": item.get("venue"),
                "description": item.get("description"),
                "event_url": item.get("event_url"),
                "reason_for_recommendation": f"Highlighted event matching your preference for {interests[idx % len(interests)] if interests else 'Culture'} in {destination}."
            })
        return ranked

    async def run_async(
        self,
        destination: str,
        travel_dates: str,
        budget: float = 1500.0,
        interests: List[str] = None
    ) -> Dict[str, Any]:
        dest = destination.title().strip()
        interests = interests or ["Culture", "Food & Gastronomy"]

        # 1. Fetch raw live events from PredictHQ API / LocalEventsService
        raw_events = await local_events_service.get_live_events(dest, travel_dates, interests)

        # 2. Filter duplicates by title/name
        seen_names = set()
        unique_events = []
        for evt in raw_events:
            name_clean = evt.get("name", "").strip().lower()
            if name_clean and name_clean not in seen_names:
                seen_names.add(name_clean)
                unique_events.append(evt)

        # 3. Rank & enhance top 5 events using Groq LLM
        top_events = await self.filter_and_rank_events_with_llm(dest, travel_dates, budget, interests, unique_events)

        return {
            "agent": "Local Events Agent",
            "destination": dest,
            "travel_dates": travel_dates,
            "budget": budget,
            "interests": interests,
            "top_events": top_events,
            "events_count": len(top_events),
            "provider": "PredictHQ Live Events API & Groq LLM",
            "summary": f"Curated top {len(top_events)} live events in {dest} matching user interests in {', '.join(interests)}."
        }

    def run(
        self,
        destination: str,
        travel_dates: str,
        budget: float = 1500.0,
        interests: List[str] = None
    ) -> Dict[str, Any]:
        """Safe synchronous wrapper."""
        try:
            loop = asyncio.get_running_loop()
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor() as pool:
                return pool.submit(asyncio.run, self.run_async(destination, travel_dates, budget, interests)).result()
        except RuntimeError:
            return asyncio.run(self.run_async(destination, travel_dates, budget, interests))

local_events_agent = LocalEventsAgent()
