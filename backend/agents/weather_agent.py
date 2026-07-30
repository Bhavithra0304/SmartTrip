import asyncio
from typing import Dict, Any, List
from services.weather_service import weather_service

class WeatherIntelligenceAgent:
    """
    Agent 3 – Weather Intelligence Agent
    Responsibilities:
    - Fetch live meteorological forecast via Open-Meteo API.
    - Evaluate rain probabilities, high UV, or freezing temperature risks.
    - Recommend clothing & packing gear.
    - Suggest indoor museum/cultural alternatives when rain risk is detected.
    """

    async def run_async(self, destination: str, travel_dates: str) -> Dict[str, Any]:
        # Call WeatherService (which queries Open-Meteo Geocoding & Forecast Live API)
        report = await weather_service.get_forecast(destination, travel_dates)
        
        return {
            "agent": "Weather Intelligence Agent",
            "destination": report.get("destination", destination.title()),
            "dates": travel_dates,
            "temperature_c": report.get("average_temperature_c", 22.0),
            "condition": report.get("condition", "Pleasant Weather"),
            "humidity_percent": report.get("humidity_percent", 55),
            "rain_probability_percent": report.get("rain_probability_percent", 15),
            "weather_risk_detected": report.get("weather_risk_detected", False),
            "risk_warnings": report.get("risk_warnings", ["No severe weather warnings."]),
            "clothing_suggestions": report.get("clothing_suggestions", []),
            "suggested_indoor_alternatives": report.get("suggested_indoor_alternatives", []),
            "provider": report.get("provider", "Open-Meteo API"),
            "summary": f"Fetched live forecast for {destination}: {report.get('average_temperature_c')}°C, {report.get('condition')}, {report.get('rain_probability_percent')}% rain probability."
        }

    def run(self, destination: str, travel_dates: str) -> Dict[str, Any]:
        """Safe synchronous wrapper."""
        try:
            loop = asyncio.get_running_loop()
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor() as pool:
                return pool.submit(asyncio.run, self.run_async(destination, travel_dates)).result()
        except RuntimeError:
            return asyncio.run(self.run_async(destination, travel_dates))

weather_agent = WeatherIntelligenceAgent()
