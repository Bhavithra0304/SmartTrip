import httpx
import json
from typing import Dict, Any, List, Optional
from config import settings

class GroqService:
    """
    Service for interacting with Groq LLM (llama-3.3-70b-versatile).
    Used for query parsing, itinerary organizing, cost-saving advice, and RAG synthesis.
    """

    @staticmethod
    async def chat_completion(
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 1000,
        response_format_json: bool = False
    ) -> Optional[str]:
        if not settings.GROQ_API_KEY:
            return None

        headers = {
            "Authorization": f"Bearer {settings.GROQ_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": settings.GROQ_MODEL,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens
        }

        if response_format_json:
            payload["response_format"] = {"type": "json_object"}

        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                response = await client.post(settings.GROQ_API_URL, headers=headers, json=payload)
                if response.status_code == 200:
                    data = response.json()
                    choices = data.get("choices", [])
                    if choices:
                        return choices[0].get("message", {}).get("content", "").strip()
                else:
                    print(f"Groq API HTTP Error {response.status_code}: {response.text}")
        except Exception as e:
            print(f"Groq API client exception: {e}")

        return None

    @staticmethod
    async def parse_user_query(query_text: str) -> Dict[str, Any]:
        """
        Uses Groq LLM to extract destination, budget, days, travelers, and interests from raw user prompt.
        """
        prompt = f"""Extract travel parameters from this request: "{query_text}"
Return ONLY a valid JSON object with keys:
- "destination": string (city/country name, default "Paris" if missing)
- "budget": number (budget in USD, default 1500 if missing)
- "travel_dates": string (e.g. "3 Days", default "3 Days")
- "num_days": integer (number of days, default 3)
- "num_travelers": integer (default 1)
- "interests": array of strings (e.g. ["Culture", "Food", "Sightseeing"])
- "currency": string (e.g. "USD", "EUR", "INR", default "USD")
"""

        messages = [
            {"role": "system", "content": "You are a travel parameter extractor. Output strictly valid JSON."},
            {"role": "user", "content": prompt}
        ]

        raw_llm = await GroqService.chat_completion(messages, temperature=0.2, response_format_json=True)
        if raw_llm:
            try:
                return json.loads(raw_llm)
            except Exception:
                pass

        # Intelligent Fallback Extractor if Groq API key is not set
        return {
            "destination": "Paris",
            "budget": 1500.0,
            "travel_dates": "3 Days",
            "num_days": 3,
            "num_travelers": 1,
            "interests": ["Culture", "Food", "Sightseeing"],
            "currency": "USD"
        }

    @staticmethod
    async def refine_itinerary_with_llm(
        destination: str,
        num_days: int,
        raw_pois: List[str],
        weather_info: Dict[str, Any],
        interests: List[str]
    ) -> Optional[List[Dict[str, Any]]]:
        """
        Uses Groq LLM to organize raw TomTom POIs into a polished day-wise travel plan with timings and durations.
        """
        prompt = f"""Organize the following raw POIs for {destination} into a structured {num_days}-day travel plan.
User Interests: {', '.join(interests)}
Current Weather: {weather_info.get('condition', 'Pleasant')} ({weather_info.get('average_temperature_c', 22)}°C, Rain Chance: {weather_info.get('rain_probability_percent', 10)}%)
Raw POIs from TomTom API: {json.dumps(raw_pois[:15])}

Return a valid JSON object with key "itinerary" as an array of objects:
[
  {{
    "day": 1,
    "title": "Day 1: Title",
    "morning": {{"time": "09:00 AM - 12:30 PM", "activity": "Detailed morning activity", "attraction": "Attraction Name", "duration": "3.5 hrs"}},
    "afternoon": {{"time": "02:00 PM - 05:30 PM", "activity": "Detailed afternoon activity", "attraction": "Attraction Name", "duration": "3.5 hrs"}},
    "evening": {{"time": "07:00 PM - 10:00 PM", "activity": "Detailed evening activity", "attraction": "Attraction Name", "duration": "3 hrs"}},
    "key_spots": ["Spot A", "Spot B"],
    "estimated_active_hours": 7.5
  }}
]
"""
        messages = [
            {"role": "system", "content": "You are a professional AI Travel Architect. Output strictly valid JSON."},
            {"role": "user", "content": prompt}
        ]

        raw_llm = await GroqService.chat_completion(messages, temperature=0.5, max_tokens=1800, response_format_json=True)
        if raw_llm:
            try:
                parsed = json.loads(raw_llm)
                if "itinerary" in parsed and isinstance(parsed["itinerary"], list):
                    return parsed["itinerary"]
            except Exception as e:
                print(f"Error parsing Groq itinerary JSON: {e}")
        return None

    @staticmethod
    async def generate_saving_tips_with_llm(
        destination: str,
        total_budget: float,
        currency: str,
        num_days: int
    ) -> Optional[List[str]]:
        """Uses Groq LLM to generate personalized budget-saving recommendations."""
        prompt = f"""Provide 4 smart, actionable, highly specific budget-saving recommendations for a {num_days}-day trip to {destination} with a total budget of {currency} {total_budget:.2f}.
Return ONLY a JSON object with key "saving_tips" as an array of 4 strings.
"""
        messages = [
            {"role": "system", "content": "You are an expert travel budget consultant. Return valid JSON."},
            {"role": "user", "content": prompt}
        ]

        raw_llm = await GroqService.chat_completion(messages, temperature=0.6, response_format_json=True)
        if raw_llm:
            try:
                parsed = json.loads(raw_llm)
                if "saving_tips" in parsed and isinstance(parsed["saving_tips"], list):
                    return parsed["saving_tips"]
            except Exception:
                pass
        return None

    @staticmethod
    async def synthesize_recommendations_with_llm(
        destination: str,
        tomtom_places: Dict[str, List[str]],
        rag_snippets: List[Dict[str, Any]],
        interests: List[str]
    ) -> Optional[Dict[str, Any]]:
        """Uses Groq LLM to personalize restaurants, cafés, shopping, hidden gems, and cultural tips."""
        prompt = f"""Using TomTom POIs and RAG travel guide context, generate recommendations for {destination}.
Interests: {', '.join(interests)}
TomTom Places: {json.dumps(tomtom_places)}
RAG Snippets: {json.dumps([s.get('content', '') for s in rag_snippets[:3]])}

Return ONLY a JSON object with keys:
- "restaurants": array of 3 objects {{"name": "...", "type": "...", "description": "..."}}
- "cafes": array of 3 objects {{"name": "...", "specialty": "..."}}
- "shopping": array of 3 objects {{"name": "...", "type": "..."}}
- "hidden_gems": array of 3 objects {{"name": "...", "why_visit": "..."}}
- "personalized_notes": string
"""
        messages = [
            {"role": "system", "content": "You are a local travel concierge. Return valid JSON."},
            {"role": "user", "content": prompt}
        ]

        raw_llm = await GroqService.chat_completion(messages, temperature=0.6, max_tokens=1500, response_format_json=True)
        if raw_llm:
            try:
                parsed = json.loads(raw_llm)
                if "restaurants" in parsed:
                    return parsed
            except Exception:
                pass
        return None

groq_service = GroqService()
