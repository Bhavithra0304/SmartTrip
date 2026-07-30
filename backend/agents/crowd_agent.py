import json
import asyncio
from typing import Dict, Any, List
from services.crowd_service import crowd_service
from services.groq_service import groq_service

class CrowdAgent:
    """
    Agent 8 – Crowd Prediction Agent
    Responsibilities:
    - Predict crowd levels at tourist attractions using TomTom Traffic/Search API & Open-Meteo Weather data.
    - Calculate Crowd Score (0-100) and overall crowd level (Low, Medium, High, Very High).
    - Provide attraction-wise crowd predictions with best visiting times & peak hours.
    - Recommend off-peak alternative attractions when places are overcrowded.
    - Generate crowd avoidance tips via Groq LLM.
    """

    async def refine_crowd_predictions_with_llm(
        self,
        destination: str,
        travel_dates: str,
        base_crowd_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        prompt = f"""You are an expert travel logistics & crowd prediction analyst.
Destination: {destination}
Travel Dates: {travel_dates}
Base Predictions: {json.dumps(base_crowd_data.get('attraction_predictions', [])[:5])}

Refine the crowd prediction metrics for {destination}.
Return ONLY a valid JSON object with keys:
{{
  "crowd_score": 58,
  "overall_crowd_level": "Medium",
  "attraction_predictions": [
    {{
      "attraction_name": "Landmark Attraction 1",
      "crowd_level": "High",
      "crowd_score": 78,
      "best_visiting_time": "08:00 AM - 10:00 AM",
      "peak_hours": "01:00 PM - 04:30 PM",
      "alternate_spot": "Nearby Quiet Garden"
    }}
  ],
  "best_visiting_times": {{
    "morning_window": "07:30 AM - 09:45 AM",
    "evening_window": "06:30 PM - 09:00 PM"
  }},
  "alternative_attractions": ["Artisan Quarter", "Scenic Riverside Path"],
  "crowd_avoidance_tips": [
    "Arrive 15 minutes before landmark opening hours.",
    "Purchase electronic skip-the-line passes online.",
    "Visit main squares during dinner hours when crowds disperse."
  ]
}}
"""
        messages = [
            {"role": "system", "content": "You are a travel crowd prediction specialist. Output strictly valid JSON."},
            {"role": "user", "content": prompt}
        ]

        raw_llm = await groq_service.chat_completion(messages, temperature=0.4, response_format_json=True)
        if raw_llm:
            try:
                parsed = json.loads(raw_llm)
                if "crowd_score" in parsed and "overall_crowd_level" in parsed:
                    return parsed
            except Exception as e:
                print(f"Groq Crowd LLM parsing error: {e}")

        return base_crowd_data

    async def run_async(
        self,
        destination: str,
        travel_dates: str = "3 Days",
        spots: List[str] = None
    ) -> Dict[str, Any]:
        dest_clean = destination.strip().title()

        # 1. Base crowd prediction metrics
        base_data = await crowd_service.predict_crowd_metrics(dest_clean, travel_dates, spots)

        # 2. Refine via Groq LLM
        refined_data = await self.refine_crowd_predictions_with_llm(dest_clean, travel_dates, base_data)

        return {
            "agent": "Crowd Prediction Agent",
            "destination": dest_clean,
            "crowd_score": refined_data.get("crowd_score", 58),
            "overall_crowd_level": refined_data.get("overall_crowd_level", "Medium"),
            "attraction_predictions": refined_data.get("attraction_predictions", base_data.get("attraction_predictions", [])),
            "best_visiting_times": refined_data.get("best_visiting_times", base_data.get("best_visiting_times", {})),
            "alternative_attractions": refined_data.get("alternative_attractions", base_data.get("alternative_attractions", [])),
            "crowd_avoidance_tips": refined_data.get("crowd_avoidance_tips", base_data.get("crowd_avoidance_tips", [])),
            "provider": "TomTom Traffic & POI API & Groq LLM",
            "summary": f"Predicted overall crowd score of {refined_data.get('crowd_score', 58)}/100 ({refined_data.get('overall_crowd_level', 'Medium')}) with attraction peak hour forecasts for {dest_clean}."
        }

    def run(self, destination: str, travel_dates: str = "3 Days", spots: List[str] = None) -> Dict[str, Any]:
        """Safe synchronous wrapper."""
        try:
            loop = asyncio.get_running_loop()
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor() as pool:
                return pool.submit(asyncio.run, self.run_async(destination, travel_dates, spots)).result()
        except RuntimeError:
            return asyncio.run(self.run_async(destination, travel_dates, spots))

crowd_agent = CrowdAgent()
