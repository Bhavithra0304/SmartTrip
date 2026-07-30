from typing import List, Dict, Any

class FlightService:
    REAL_AIRLINES = {
        "paris": ("Air France", "Lufthansa"),
        "tokyo": ("Japan Airlines (JAL)", "ANA All Nippon Airways"),
        "rome": ("ITA Airways", "Air France"),
        "london": ("British Airways", "Virgin Atlantic"),
        "dubai": ("Emirates", "Flydubai"),
        "goa": ("IndiGo", "Air India Express"),
        "new york": ("Delta Air Lines", "United Airlines")
    }

    REAL_TRAINS = {
        "paris": ("Eurostar / TGV InOui", "Gare du Nord -> Gare de Lyon"),
        "tokyo": ("Shinkansen Bullet Train (JR East)", "Tokyo Station -> Shin-Osaka"),
        "rome": ("Frecciarossa High-Speed Rail", "Roma Termini -> Firenze Santa Maria Novella"),
        "london": ("Avanti West Coast Rail", "London Euston -> Manchester Piccadilly"),
        "dubai": ("Dubai Metro Red Line Express", "Dubai Airport T3 -> Dubai Marina Station"),
        "goa": ("Vande Bharat Express", "Mumbai CSMT -> Madgaon Junction Goa"),
        "new york": ("Amtrak Acela Express", "New York Penn Station -> Washington Union")
    }

    @staticmethod
    def search_transports(destination: str, num_travelers: int = 1) -> Dict[str, List[Dict[str, Any]]]:
        dest_key = destination.lower().strip()
        
        air1, air2 = FlightService.REAL_AIRLINES.get(dest_key, ("Qatar Airways", "Emirates"))
        train_op, train_route = FlightService.REAL_TRAINS.get(dest_key, ("High-Speed Intercity Express", f"Main Terminal -> {destination.title()} Central"))

        return {
            "flights": [
                {
                    "id": "fl-101",
                    "airline": air1,
                    "route": f"International Hub -> {destination.title()} Airport (Non-stop)",
                    "duration": "4h 15m",
                    "price_per_person": 320.0,
                    "total_price": 320.0 * num_travelers,
                    "departure_time": "08:30 AM",
                    "booking_url": f"https://www.google.com/travel/flights?q=flights+to+{destination}"
                },
                {
                    "id": "fl-102",
                    "airline": air2,
                    "route": f"International Hub -> {destination.title()} Airport (1 Stop)",
                    "duration": "6h 45m",
                    "price_per_person": 210.0,
                    "total_price": 210.0 * num_travelers,
                    "departure_time": "01:15 PM",
                    "booking_url": f"https://www.skyscanner.com/transport/flights/to/{destination}"
                }
            ],
            "trains": [
                {
                    "id": "tr-201",
                    "operator": train_op,
                    "route": train_route,
                    "duration": "3h 10m",
                    "price_per_person": 85.0,
                    "total_price": 85.0 * num_travelers,
                    "departure_time": "09:00 AM",
                    "booking_url": f"https://www.trainline.com/search/{destination}"
                }
            ],
            "buses": [
                {
                    "id": "bus-301",
                    "operator": "FlixBus Express",
                    "route": f"Intercity Terminal -> {destination.title()} Central",
                    "duration": "5h 30m",
                    "price_per_person": 35.0,
                    "total_price": 35.0 * num_travelers,
                    "departure_time": "07:30 AM",
                    "booking_url": f"https://www.flixbus.com/search/{destination}"
                }
            ]
        }
