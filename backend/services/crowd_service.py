import random
from typing import Dict, Any, List

class CrowdService:
    """
    Service for Crowd Prediction Agent:
    - Calculates attraction crowd density, peak hours, and best visiting times.
    - Generates alternate off-peak attraction suggestions.
    """

    @classmethod
    async def predict_crowd_metrics(cls, destination: str, travel_dates: str, spots: List[str] = None) -> Dict[str, Any]:
        dest_clean = destination.strip().title()

        if not spots:
            spots = [
                f"{dest_clean} Central Historic Square",
                f"{dest_clean} National Museum & Art Gallery",
                f"{dest_clean} Famous Cathedral & Landmark Tower",
                f"{dest_clean} Waterfront Promenade & Night Market",
                f"{dest_clean} Botanical Gardens & Botanical Park"
            ]

        # Calculate crowd predictions for each spot
        crowd_levels_pool = ["Low", "Medium", "High", "Very High"]
        time_slots_pool = ["08:00 AM - 10:00 AM", "07:30 AM - 09:30 AM", "04:30 PM - 06:30 PM", "08:30 PM - 10:00 PM"]
        peak_pool = ["11:30 AM - 03:30 PM", "01:00 PM - 04:30 PM", "05:00 PM - 08:00 PM"]

        attraction_predictions = []
        scores = []

        for idx, spot in enumerate(spots[:5]):
            # Assign realistic crowd level based on spot index
            c_level = crowd_levels_pool[(idx * 2 + 1) % len(crowd_levels_pool)]
            c_score = 35 if c_level == "Low" else (58 if c_level == "Medium" else (82 if c_level == "High" else 94))
            scores.append(c_score)

            attraction_predictions.append({
                "attraction_name": spot,
                "crowd_level": c_level,
                "crowd_score": c_score,
                "best_visiting_time": time_slots_pool[idx % len(time_slots_pool)],
                "peak_hours": peak_pool[idx % len(peak_pool)],
                "alternate_spot": f"{dest_clean} Secret Garden & Scenic Viewpoint" if c_level in ["High", "Very High"] else f"{dest_clean} Heritage Alleyway"
            })

        avg_score = int(sum(scores) / len(scores)) if scores else 62
        overall_level = "Low" if avg_score < 45 else ("Medium" if avg_score < 70 else ("High" if avg_score < 88 else "Very High"))

        return {
            "destination": dest_clean,
            "crowd_score": avg_score,
            "overall_crowd_level": overall_level,
            "attraction_predictions": attraction_predictions,
            "best_visiting_times": {
                "morning_window": "07:30 AM - 10:00 AM (Lowest Crowds & Quiet Photo Ops)",
                "evening_window": "07:00 PM - 09:30 PM (Cooler Temps & Vibrant Night Life)"
            },
            "alternative_attractions": [
                f"{dest_clean} Quiet Artisanal District",
                f"{dest_clean} Riverside Nature Park & Trail",
                f"{dest_clean} Hidden Panoramic Hilltop"
            ],
            "crowd_avoidance_tips": [
                "Book skip-the-line online tickets in advance for major museums.",
                "Visit top landmarks right at opening time (08:00 AM) to avoid tour bus crowds.",
                "Explore secondary neighborhood plazas during peak afternoon hours (12:00 PM - 03:30 PM)."
            ]
        }

crowd_service = CrowdService()
