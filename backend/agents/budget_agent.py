import asyncio
from typing import Dict, Any, List
from services.currency_service import currency_service
from services.groq_service import groq_service

class BudgetOptimizationAgent:
    """
    Agent 2 – Budget Optimization Agent
    Responsibilities:
    - Calculate budget allocation across 5 categories (Hotels, Food, Transport, Activities, Shopping).
    - Perform dynamic live currency conversion via ExchangeRate API.
    - Calculate daily budget per person.
    - Generate personalized cost-saving suggestions using Groq LLM.
    """

    async def run_async(self, budget: float, currency: str = "USD", num_days: int = 3, num_travelers: int = 1, destination: str = "Paris") -> Dict[str, Any]:
        budget = max(100.0, float(budget))
        num_days = max(1, int(num_days))
        num_travelers = max(1, int(num_travelers))
        currency = currency.upper()

        # 1. Dynamic Live Currency Conversion using ExchangeRate API
        currency_report = await currency_service.get_currency_report(budget, currency)
        converted_total = currency_report["converted_total"]
        rate = currency_report["exchange_rate_vs_usd"]

        # 2. Python Budget Calculation Splits
        # Allocations: Accommodation (35%), Food & Dining (25%), Transport (15%), Activities & Sightseeing (15%), Shopping & Emergency (10%)
        categories = [
            {
                "category": "Hotels & Stay",
                "percentage": 35,
                "percent": 35,
                "allocated": round(converted_total * 0.35, 2),
                "usd": round(budget * 0.35, 2),
                "converted": round(converted_total * 0.35, 2)
            },
            {
                "category": "Food & Dining",
                "percentage": 25,
                "percent": 25,
                "allocated": round(converted_total * 0.25, 2),
                "usd": round(budget * 0.25, 2),
                "converted": round(converted_total * 0.25, 2)
            },
            {
                "category": "Transport & Transit",
                "percentage": 15,
                "percent": 15,
                "allocated": round(converted_total * 0.15, 2),
                "usd": round(budget * 0.15, 2),
                "converted": round(converted_total * 0.15, 2)
            },
            {
                "category": "Activities & Tickets",
                "percentage": 15,
                "percent": 15,
                "allocated": round(converted_total * 0.15, 2),
                "usd": round(budget * 0.15, 2),
                "converted": round(converted_total * 0.15, 2)
            },
            {
                "category": "Shopping & Emergency",
                "percentage": 10,
                "percent": 10,
                "allocated": round(converted_total * 0.10, 2),
                "usd": round(budget * 0.10, 2),
                "converted": round(converted_total * 0.10, 2)
            }
        ]

        daily_budget_usd = round(budget / num_days, 2)
        daily_budget_per_person_usd = round(daily_budget_usd / num_travelers, 2)

        daily_budget_converted = round(converted_total / num_days, 2)
        daily_budget_per_person_converted = round(daily_budget_converted / num_travelers, 2)

        # 3. Personalized Cost-Saving Recommendations using Groq LLM
        llm_saving_tips = await groq_service.generate_saving_tips_with_llm(destination, budget, currency, num_days)
        if not llm_saving_tips:
            llm_saving_tips = [
                f"Book attraction tickets online 2-3 weeks in advance to save 10-15% on entry fees in {destination}.",
                f"Use a multi-day city transit pass for unlimited metro & bus travel instead of individual single tickets.",
                f"Enjoy lunch specials at local bistros which offer 30-40% lower prices than dinner menus.",
                f"Utilize fee-free debit/credit cards to avoid 3% foreign transaction currency surcharges."
            ]

        return {
            "agent": "Budget Optimization Agent",
            "total_budget": budget,
            "total_budget_usd": budget,
            "currency": currency,
            "exchange_rate": rate,
            "converted_total_budget": converted_total,
            "daily_budget_usd": daily_budget_usd,
            "daily_budget_per_person_usd": daily_budget_per_person_usd,
            "daily_budget_converted": daily_budget_converted,
            "daily_budget_per_person_converted": daily_budget_per_person_converted,
            "num_days": num_days,
            "num_travelers": num_travelers,
            "categories": categories,
            "budget_breakdown": categories,
            "cost_saving_recommendations": llm_saving_tips,
            "saving_recommendations": llm_saving_tips,
            "provider": currency_report.get("provider", "ExchangeRate API & Groq LLM"),
            "summary": f"Calculated budget allocation of {currency} {converted_total:,.2f} ({daily_budget_per_person_converted:,.2f}/day/person) with Groq LLM personalized savings."
        }

    def run(self, budget: float, currency: str = "USD", num_days: int = 3, num_travelers: int = 1, destination: str = "Paris") -> Dict[str, Any]:
        """Safe synchronous wrapper."""
        try:
            loop = asyncio.get_running_loop()
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor() as pool:
                return pool.submit(asyncio.run, self.run_async(budget, currency, num_days, num_travelers, destination)).result()
        except RuntimeError:
            return asyncio.run(self.run_async(budget, currency, num_days, num_travelers, destination))

budget_agent = BudgetOptimizationAgent()
