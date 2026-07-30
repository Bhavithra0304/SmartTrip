import asyncio
from typing import Dict, Any, List
from services.maps_service import maps_service

class NavigationAgent:
    """
    Agent 4 – Navigation Agent
    Responsibilities:
    - Calculate routes between attractions using TomTom Search & Routing API.
    - Optimize travel order to minimize transit times.
    - Estimate travel time in minutes/hours and distance in km.
    - Recommend transport modes (Taxi, Metro, Walking, Cycling).
    """

    async def run_async(self, destination: str, locations: List[str]) -> Dict[str, Any]:
        route_matrix = await maps_service.get_route_details(destination, locations)

        legs = route_matrix.get("optimized_legs", [])
        tips = route_matrix.get("travel_tips", [])

        return {
            "agent": "Navigation Agent",
            "destination": route_matrix.get("destination", destination.title()),
            "total_distance_km": route_matrix.get("total_distance_km", 0.0),
            "total_travel_time_hours": route_matrix.get("total_travel_time_hours", 0.0),
            "optimized_legs": legs,
            "optimized_route_legs": legs,
            "travel_tips": tips,
            "travel_efficiency_tips": tips,
            "provider": route_matrix.get("provider", "TomTom Routing API"),
            "summary": f"Calculated optimized transit routes covering {route_matrix.get('total_distance_km')} km in ~{route_matrix.get('total_travel_time_hours')} hours."
        }

    def run(self, destination: str, locations: List[str]) -> Dict[str, Any]:
        """Safe synchronous wrapper."""
        try:
            loop = asyncio.get_running_loop()
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor() as pool:
                return pool.submit(asyncio.run, self.run_async(destination, locations)).result()
        except RuntimeError:
            return asyncio.run(self.run_async(destination, locations))

navigation_agent = NavigationAgent()
