from typing import List, Dict, Any

class HotelService:
    REAL_HOTELS = {
        "paris": [
            {"name": "Le Meurice Paris (Dorchester Collection)", "cat": "Luxury 5-Star Palace", "tag": "Ultra-Luxury Palace"},
            {"name": "Hôtel Plaza Athénée Paris", "cat": "Luxury 5-Star", "tag": "Eiffel Tower View"},
            {"name": "Hôtel Dame des Arts (Saint-Germain-des-Prés)", "cat": "Mid-Range Boutique 4-Star", "tag": "Recommended Value"},
            {"name": "Ibis Paris Tour Eiffel Cambronne", "cat": "Budget Friendly", "tag": "Best Savings"}
        ],
        "tokyo": [
            {"name": "Park Hyatt Tokyo (Shinjuku)", "cat": "Luxury 5-Star", "tag": "Skyline Luxury"},
            {"name": "The Ritz-Carlton Tokyo (Roppongi)", "cat": "Luxury 5-Star", "tag": "High Vantage View"},
            {"name": "Keio Plaza Hotel Tokyo", "cat": "Mid-Range 4-Star", "tag": "Central Shinjuku Location"},
            {"name": "Hotel Unizo Tokyo Shinjuku", "cat": "Budget Friendly", "tag": "Best Savings"}
        ],
        "rome": [
            {"name": "Hotel Eden Rome (Dorchester Collection)", "cat": "Luxury 5-Star", "tag": "Panoramic City Terrace"},
            {"name": "NH Collection Roma Fori Imperiali", "cat": "Mid-Range 4-Star", "tag": "Colosseum View"},
            {"name": "YellowSquare Rome Hostel & Hotel", "cat": "Budget Friendly", "tag": "Best Savings"}
        ],
        "london": [
            {"name": "The Ritz London (Piccadilly)", "cat": "Luxury 5-Star", "tag": "Iconic Luxury"},
            {"name": "Strand Palace Hotel Covent Garden", "cat": "Mid-Range 4-Star", "tag": "West End Location"},
            {"name": "Generator Hostel London (Russell Square)", "cat": "Budget Friendly", "tag": "Best Savings"}
        ],
        "dubai": [
            {"name": "Burj Al Arab Jumeirah", "cat": "Luxury 7-Star Palace", "tag": "Ultra-Luxury Landmark"},
            {"name": "JW Marriott Marquis Hotel Dubai", "cat": "Luxury 5-Star", "tag": "Dubai Canal View"},
            {"name": "Rove Downtown Dubai (Dubai Mall View)", "cat": "Mid-Range Boutique", "tag": "Recommended Value"},
            {"name": "Citymax Hotel Bur Dubai", "cat": "Budget Friendly", "tag": "Best Savings"}
        ],
        "goa": [
            {"name": "Taj Exotica Resort & Spa Benaulim Goa", "cat": "Luxury 5-Star Beach Resort", "tag": "Seaside Luxury"},
            {"name": "Novotel Goa Resort & Spa Candolim", "cat": "Mid-Range 4-Star", "tag": "Near Beach"},
            {"name": "Zostel Goa (Anjuna Beach)", "cat": "Budget Friendly Hostel", "tag": "Best Savings"}
        ],
        "new york": [
            {"name": "The Plaza Hotel Fifth Avenue New York", "cat": "Luxury 5-Star Landmark", "tag": "Iconic Manhattan Palace"},
            {"name": "Arlo Midtown Hotel New York", "cat": "Mid-Range Boutique 4-Star", "tag": "Times Square Access"},
            {"name": "HI New York City Hostel (Upper West Side)", "cat": "Budget Friendly", "tag": "Best Savings"}
        ]
    }

    @staticmethod
    def search_hotels(destination: str, num_nights: int = 3, target_budget: float = 1000.0) -> List[Dict[str, Any]]:
        dest_key = destination.lower().strip()
        nightly_budget = target_budget * 0.35 / max(1, num_nights)
        
        luxury_price = round(max(180.0, nightly_budget * 1.6), 2)
        mid_price = round(max(90.0, nightly_budget * 0.95), 2)
        budget_price = round(max(45.0, nightly_budget * 0.55), 2)

        if dest_key in HotelService.REAL_HOTELS:
            h_data = HotelService.REAL_HOTELS[dest_key]
            return [
                {
                    "id": "hotel-1",
                    "name": h_data[0]["name"],
                    "category": h_data[0]["cat"],
                    "rating": 4.9,
                    "price_per_night": luxury_price,
                    "total_estimated": round(luxury_price * num_nights, 2),
                    "amenities": ["Infinity Pool", "Free Gourmet Breakfast", "Luxury Spa Center", "Prime Location", "High-speed Wi-Fi"],
                    "booking_url": f"https://www.booking.com/searchresults.html?ss={destination}",
                    "tag": h_data[0]["tag"]
                },
                {
                    "id": "hotel-2",
                    "name": h_data[2]["name"] if len(h_data) > 2 else h_data[1]["name"],
                    "category": h_data[2]["cat"] if len(h_data) > 2 else h_data[1]["cat"],
                    "rating": 4.6,
                    "price_per_night": mid_price,
                    "total_estimated": round(mid_price * num_nights, 2),
                    "amenities": ["Rooftop Lounge", "Breakfast Included", "Fitness Center", "Airport Shuttle"],
                    "booking_url": f"https://www.agoda.com/search?city={destination}",
                    "tag": h_data[2]["tag"] if len(h_data) > 2 else "Recommended Value"
                },
                {
                    "id": "hotel-3",
                    "name": h_data[3]["name"] if len(h_data) > 3 else h_data[-1]["name"],
                    "category": h_data[3]["cat"] if len(h_data) > 3 else "Budget Friendly",
                    "rating": 4.3,
                    "price_per_night": budget_price,
                    "total_estimated": round(budget_price * num_nights, 2),
                    "amenities": ["Co-working Lounge", "Shared Kitchen", "Free Wi-Fi", "Central Transit Line"],
                    "booking_url": f"https://www.hostelworld.com/s?q={destination}",
                    "tag": "Best Savings"
                }
            ]

        # Location-Aware Fallback with Real Hotel Brands
        return [
            {
                "id": "hotel-1",
                "name": f"The Ritz-Carlton {destination.title()} Hotel & Suites",
                "category": "Luxury 5-Star",
                "rating": 4.9,
                "price_per_night": luxury_price,
                "total_estimated": round(luxury_price * num_nights, 2),
                "amenities": ["Infinity Pool", "Free Breakfast", "Spa Center", "City Center Location", "High-speed Wi-Fi"],
                "booking_url": f"https://www.booking.com/searchresults.html?ss={destination}",
                "tag": "Best Comfort & Luxury"
            },
            {
                "id": "hotel-2",
                "name": f"Marriott {destination.title()} City Center",
                "category": "Mid-Range 4-Star",
                "rating": 4.6,
                "price_per_night": mid_price,
                "total_estimated": round(mid_price * num_nights, 2),
                "amenities": ["Rooftop Lounge", "Breakfast Included", "Gym Access", "Airport Shuttle"],
                "booking_url": f"https://www.agoda.com/search?city={destination}",
                "tag": "Recommended Value"
            },
            {
                "id": "hotel-3",
                "name": f"Ibis {destination.title()} Central Station Hotel",
                "category": "Budget Friendly",
                "rating": 4.3,
                "price_per_night": budget_price,
                "total_estimated": round(budget_price * num_nights, 2),
                "amenities": ["Co-working Lounge", "Shared Kitchen", "Free Wi-Fi", "Central Bus Line"],
                "booking_url": f"https://www.hostelworld.com/s?q={destination}",
                "tag": "Best Savings"
            }
        ]
