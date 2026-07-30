from typing import Dict, Any
from services.hotel_service import HotelService
from services.flight_service import FlightService

class BookingAssistantAgent:
    """
    Agent 5 – Booking Assistant Agent
    Responsibilities:
    - Search hotels
    - Search flights / trains / buses
    - Compare prices
    - Suggest booking options with direct links (no payment processing)
    """
    def run(self, destination: str, budget: float, travelers: int = 1, num_nights: int = 3) -> Dict[str, Any]:
        hotels = HotelService.search_hotels(destination, num_nights=num_nights, target_budget=budget)
        transport = FlightService.search_transports(destination, num_travelers=travelers)

        return {
            "agent": "Booking Assistant Agent",
            "destination": destination,
            "recommended_hotels": hotels,
            "transportation": transport,
            "disclaimer": "SmartTrip provides price comparisons and live provider links only. No direct payments are processed on this site."
        }

booking_agent = BookingAssistantAgent()
