import httpx
from typing import Dict, Any
from config import settings

class CurrencyService:
    """
    Currency Service with live ExchangeRate API integration.
    Endpoint: https://open.er-api.com/v6/latest/USD (free, no API key required).
    """

    FALLBACK_RATES = {
        "USD": 1.0,
        "EUR": 0.92,
        "GBP": 0.78,
        "INR": 83.5,
        "JPY": 155.0,
        "CAD": 1.36,
        "AUD": 1.52,
        "AED": 3.67,
        "CHF": 0.88,
        "CNY": 7.23,
        "BRL": 5.45
    }

    @classmethod
    async def get_live_rates(cls) -> Dict[str, float]:
        """Fetches live USD base exchange rates from ExchangeRate API."""
        try:
            async with httpx.AsyncClient(timeout=4.0) as client:
                resp = await client.get(f"{settings.EXCHANGERATE_API_URL}/USD")
                if resp.status_code == 200:
                    data = resp.json()
                    rates = data.get("rates", {})
                    if rates:
                        return rates
        except Exception as e:
            print(f"ExchangeRate Live API fetch warning: {e}")
        return cls.FALLBACK_RATES

    @classmethod
    async def convert(cls, amount: float, from_curr: str = "USD", to_curr: str = "USD") -> float:
        rates = await cls.get_live_rates()
        from_rate = rates.get(from_curr.upper(), cls.FALLBACK_RATES.get(from_curr.upper(), 1.0))
        to_rate = rates.get(to_curr.upper(), cls.FALLBACK_RATES.get(to_curr.upper(), 1.0))
        
        amount_in_usd = amount / from_rate
        return round(amount_in_usd * to_rate, 2)

    @classmethod
    async def get_currency_report(cls, total_budget: float, currency: str = "USD") -> Dict[str, Any]:
        rates = await cls.get_live_rates()
        curr = currency.upper()
        rate = rates.get(curr, cls.FALLBACK_RATES.get(curr, 1.0))
        
        converted_val = round(total_budget * rate, 2)
        
        return {
            "currency": curr,
            "exchange_rate_vs_usd": rate,
            "original_budget_usd": total_budget,
            "converted_total": converted_val,
            "provider": "ExchangeRate Live API" if rates != cls.FALLBACK_RATES else "ExchangeRate Engine Fallback",
            "tips": [
                "Notify your credit card provider before international travel to prevent security holds.",
                "Withdraw local currency from official bank ATMs rather than airport exchange kiosks for lower fees.",
                "Use credit cards with zero foreign transaction fees to save 3-5% on every purchase."
            ]
        }

currency_service = CurrencyService()
