import re
from fastapi import APIRouter, Depends
from typing import Dict, Any, List
from schemas.agent import ChatRequest
from models.user import User
from api.auth import get_current_user
from agents.master_agent import master_agent
from rag.retriever import retriever

router = APIRouter(prefix="/chat", tags=["AI Chat & Travel Assistant"])

# Knowledge repository for answering general travel, culture, food, and place doubts
CULTURE_KNOWLEDGE_BASE = {
    "japan": {
        "culture": "Japanese culture is deeply rooted in respect, harmony (Wa), and politeness. Bowing is the standard greeting. Remove shoes when entering homes, ryokans, and traditional restaurants with tatami mats. Avoid eating or drinking while walking in public streets.",
        "food": "Must-try foods in Japan include authentic Tonkotsu Ramen at Ichiran, Fresh Edomae Sushi at Tsukiji Outer Market, Crispy Tempura, Okonomiyaki, Yakitori at Omoide Yokocho, and Uji Matcha desserts. Tipping is NOT practiced and can be considered offensive.",
        "etiquette": "Keep your voice low on public transit, avoid talking on the phone in trains, and never leave chopsticks standing vertically in a rice bowl.",
        "best_time": "Spring (March to May) for Cherry Blossoms (Sakura) and Autumn (September to November) for vibrant maple foliage."
    },
    "tokyo": {
        "culture": "Tokyo seamlessly blends futuristic technology with centuries-old Shinto and Buddhist traditions. Respect temple boundaries at Senso-ji Temple and follow hand-washing rituals at Meiji Jingu Shrine entrances (Temizuya).",
        "food": "Visit Tsukiji Outer Market for fresh sushi, Omoide Yokocho in Shinjuku for skewers, and Akihabara for themed cafés.",
        "etiquette": "Stand on the left side of escalators in Tokyo (right side in Osaka). Always handle business cards and money trays with both hands.",
        "best_time": "March to May and October to December offer pleasant mild weather around 18°C-22°C."
    },
    "france": {
        "culture": "French culture emphasizes art, gastronomy, and literature. Always greet shopkeepers with a polite 'Bonjour, Madame/Monsieur' upon entering and 'Au revoir' when leaving. Conversations are held at a relaxed, respectful pace.",
        "food": "Savor buttery croissants from Stohrer Boulangerie, pain au chocolat, escargots, beef bourguignon, duck confit, regional cheeses, and macarons from Pierre Hermé.",
        "etiquette": "Tipping is modest (service is included by law, but leaving 1-2 Euros for good service is customary). Keep hands visible on the table during dining.",
        "best_time": "Spring (April to June) and Autumn (September to November) avoid heavy summer crowds."
    },
    "paris": {
        "culture": "Paris is a global center for fashion, philosophy, and culinary excellence. Museum etiquette at the Louvre and Musée d'Orsay requires quiet tones and no flash photography.",
        "food": "Try fresh baguettes from rue Montorgueil boulangeries, macarons at Ladurée, duck confit at Le Train Bleu, and café au lait at Saint-Germain-des-Prés bistros.",
        "etiquette": "Dress smartly when dining out. Avoid speaking loudly in public spaces or metro cars.",
        "best_time": "May to June and September to October provide sunny days and pleasant café terrace weather."
    },
    "italy": {
        "culture": "Italian culture centers around family, art, history, and culinary heritage. La Passeggiata (evening stroll) is a cherished daily social tradition.",
        "food": "Enjoy authentic Neapolitan pizza, fresh pasta carbonara at Da Enzo al 29, Cacio e Pepe, gelato at Giolitti, and espresso at Antico Caffè Greco.",
        "etiquette": "When visiting churches like St. Peter's Basilica or the Duomo, shoulders and knees must be covered. Drink cappuccino only before 11 AM.",
        "best_time": "April to June and September to October for warm sunny days without severe summer heat waves."
    },
    "rome": {
        "culture": "Living history is everywhere in Rome. Ancient monuments like the Colosseum and Roman Forum coexist with modern Roman daily life.",
        "food": "Savor Roman classics: Pasta alla Carbonara at Roscioli, Cacio e Pepe, Amatriciana, and Suppli (fried rice balls).",
        "etiquette": "Do not sit on historic steps (e.g. Spanish Steps) or eat near ancient fountains like Trevi Fountain.",
        "best_time": "May, September, and October offer comfortable sightseeing climate around 22°C."
    },
    "dubai": {
        "culture": "Dubai combines Islamic Emirati heritage with high-tech luxury living. Modest dress is appreciated in public places, malls, and cultural quarters.",
        "food": "Taste traditional Machboos, Shawarma, Luqaimat dumplings at Al Fanar, Arabic coffee (Gahwa), and fresh dates at Deira Souks.",
        "etiquette": "Public displays of affection should be kept modest. Alcohol is served in licensed venues and hotel restaurants.",
        "best_time": "November to April during winter months with pleasant temperatures around 24°C-28°C."
    },
    "goa": {
        "culture": "Goa features a unique Indo-Portuguese cultural fusion reflected in its Latin Quarter architecture, historic churches, and relaxed 'Susegad' lifestyle.",
        "food": "Sample Goan Fish Curry rice at Fisherman's Wharf, Pork Vindaloo, Bebinca dessert, and fresh seafood at Curlies Beach Shack.",
        "etiquette": "Beachwear is appropriate on beaches, but cover up when walking into villages or visiting Basilica of Bom Jesus.",
        "best_time": "November to February for dry, breezy, pleasant beach weather."
    },
    "new york": {
        "culture": "New York is a fast-paced global metropolis known for diverse neighborhoods, Broadway theater, world-class museums, and iconic skylines.",
        "food": "Enjoy New York bagels at Russ & Daughters, pastrami sandwiches at Katz's Delicatessen, pizza slices in Brooklyn, and bistro dining at Balthazar.",
        "etiquette": "Walk briskly on sidewalks, stand to the right on escalators, and tip 18-20% at table-service restaurants.",
        "best_time": "September to November and April to June offer ideal outdoor walking weather."
    }
}

def handle_small_talk(user_text: str, username: str = "Traveler") -> str:
    """Returns warm, non-duplicated, friendly responses for small talk & greetings."""
    text = user_text.lower().strip()
    
    if any(w in text for w in ["who are you", "what are you", "your name"]):
        return (
            f"Hello {username}! I am **PlanNgo AI Travel Assistant** 🌍✈️.\n\n"
            "I can help you with:\n"
            "• **Day-Wise Trip Itineraries**: Tell me a city and duration (e.g., *'Plan a 3-day trip to Tokyo'*)\n"
            "• **Local Culture & Etiquette**: Ask about customs, dress codes, or tipping rules (e.g., *'What is tipping etiquette in Japan?'*)\n"
            "• **Authentic Food & Restaurants**: Discover real local dishes and famous eateries\n"
            "• **Best Time & Weather Advice**: Get seasonal climate tips for any destination\n\n"
            "How can I assist your travel plans today?"
        )

    if any(w in text for w in ["what can you do", "features", "help"]):
        return (
            "Here is how I can assist you with **PlanNgo**:\n"
            "1. **Custom Itineraries**: Generate day-by-day plans with exact real-world parks, museums, and restaurants.\n"
            "2. **Culture & Customs**: Answer your doubts about local etiquette, greetings, and traditions.\n"
            "3. **Food & Dining**: Recommend top regional dishes and famous eateries.\n"
            "4. **Weather & Best Months**: Provide seasonal travel forecasts.\n"
            "5. **Budget & Voice AI**: Calculate 5-category budget splits and support voice commands!\n\n"
            "What destination or question would you like to explore?"
        )

    # General Greeting
    return (
        f"Hi {username}! 👋 Welcome to **PlanNgo Travel Assistant**.\n"
        "Where are you planning to travel next? You can ask me any travel question or request a custom day-wise itinerary!"
    )

def generate_doubt_answer(query: str, dest: str, rag_hits: List[Dict[str, Any]]) -> str:
    dest_key = dest.lower().strip()
    q_lower = query.lower()
    
    info = CULTURE_KNOWLEDGE_BASE.get(dest_key, {})
    
    topic_responses = []
    
    if any(w in q_lower for w in ["culture", "custom", "tradition", "people", "lifestyle", "etiquette", "norm", "dress", "rule", "greet"]):
        if "culture" in info:
            topic_responses.append(f"🏛️ **Culture & Traditions in {dest}**:\n{info['culture']}")
        if "etiquette" in info:
            topic_responses.append(f"🙏 **Local Etiquette & Social Rules**:\n{info['etiquette']}")

    if any(w in q_lower for w in ["food", "dish", "eat", "dining", "restaurant", "cuisine", "drink", "taste", "specialty"]):
        if "food" in info:
            topic_responses.append(f"🍲 **Gastronomy & Real Local Dishes**:\n{info['food']}")

    if any(w in q_lower for w in ["weather", "season", "best time", "when to visit", "month", "climate", "temp"]):
        if "best_time" in info:
            topic_responses.append(f"☀️ **Best Time & Weather to Visit {dest}**:\n{info['best_time']}")

    # Incorporate RAG Knowledge hits if relevant and non-duplicated
    if rag_hits:
        rag_texts = []
        for item in rag_hits[:2]:
            content = item.get('content', '')
            if content and len(content) > 10 and content not in str(topic_responses):
                rag_texts.append(f"• **{item.get('title', 'Local Guide')}**: {content}")
        if rag_texts:
            topic_responses.append(f"💡 **Insider Insights from Travel Knowledge Base**:\n" + "\n".join(rag_texts))

    if not topic_responses:
        base_desc = f"Here is travel guidance for **{dest}**:"
        details = []
        if "culture" in info:
            details.append(f"• **Culture**: {info['culture']}")
        if "food" in info:
            details.append(f"• **Food Specialties**: {info['food']}")
        if "etiquette" in info:
            details.append(f"• **Etiquette**: {info['etiquette']}")
        if "best_time" in info:
            details.append(f"• **Best Season**: {info['best_time']}")
            
        if not details:
            details.append(f"• **Destination Highlights**: {dest} features historic landmarks, rich local traditions, authentic dining spots, and scenic gardens.")
            details.append(f"• **Travel Advice**: Always respect local etiquette, carry local currency for small vendors, and check seasonal weather forecasts.")

        return base_desc + "\n\n" + "\n\n".join(details)

    return f"Here is the information for **{dest}**:\n\n" + "\n\n".join(topic_responses)

@router.post("/query")
async def chat_with_agent(
    req: ChatRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Smart Travel Chat Endpoint:
    - Intent 1: Greetings / Small Talk -> Warm personalized greeting & capabilities overview.
    - Intent 2: Itinerary Request -> Generates full trip plan with exact real-world named venues.
    - Intent 3: General Question / Doubts -> Answers specific doubt accurately without duplication.
    """
    user_text = req.message.strip()
    user_lower = user_text.lower()
    user_name = current_user.full_name.split()[0] if current_user and current_user.full_name else "Traveler"

    # Intent 1: Check for Greetings / Small Talk
    small_talk_words = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening", "greetings", "who are you", "what can you do", "help me"]
    words = user_lower.split()
    is_pure_greeting = (
        user_lower in ["hi", "hello", "hey", "hola", "namaste", "good morning", "good afternoon", "good evening", "who are you", "what can you do"] or
        (len(words) <= 3 and any(w in words for w in ["hi", "hello", "hey"]))
    )

    if is_pure_greeting:
        return {
            "reply": handle_small_talk(user_text, user_name),
            "master_output": None,
            "rag_context": [],
            "suggested_prompts": [
                "Plan a 3-day trip to Tokyo",
                "What is tipping etiquette in France?",
                "Must-try street food in Goa",
                "Best month to visit Dubai"
            ]
        }

    # Intent 2: Check for Itinerary Request
    itinerary_keywords = ["plan", "itinerary", "schedule", "create trip", "make a trip", "day trip", "days trip", "days in", "days to", "travel plan", "generate plan", "book trip"]
    is_itinerary_request = any(k in user_lower for k in itinerary_keywords)

    # Parse Destination
    dest_match = re.search(r'\b(?:to|in|visit|for|about)\s+([A-Za-z\s]+?)(?:\s+with|\s+for|\s+on|\s+\$|\d+|\.|\,|$)', user_text, re.IGNORECASE)
    destination_found = "Paris"
    if dest_match:
        extracted = dest_match.group(1).strip().title()
        stop_words = ["a", "the", "my", "our", "me", "some", "what", "how", "why", "which", "where", "food", "culture", "trip"]
        if len(extracted) > 1 and extracted.lower() not in stop_words:
            destination_found = extracted
    else:
        cities = ["Tokyo", "Japan", "Paris", "France", "Rome", "Italy", "London", "Dubai", "Goa", "New York", "Sydney", "Bali", "Singapore", "Barcelona", "Berlin"]
        for c in cities:
            if c.lower() in user_lower:
                destination_found = c
                break

    rag_hits = retriever.query_knowledge_base(user_text, destination=destination_found, top_k=3)

    if is_itinerary_request:
        days_match = re.search(r'(\d+)\s*day', user_text, re.IGNORECASE)
        requested_days = int(days_match.group(1)) if days_match else 3
        dates_str = f"{requested_days} Days"

        budget_match = re.search(r'\$\s*(\d+[\d,.]*)|\b(\d+)\s*(?:dollars|usd|budget)', user_text, re.IGNORECASE)
        budget_val = 1500.0
        if budget_match:
            b_str = (budget_match.group(1) or budget_match.group(2)).replace(',', '')
            try:
                budget_val = float(b_str)
            except Exception:
                pass

        agent_output = await master_agent.plan_trip(
            destination=destination_found,
            budget=budget_val,
            travel_dates=dates_str,
            num_travelers=1,
            interests=["Culture", "Food", "Sightseeing"],
            currency=current_user.preferred_currency or "USD"
        )

        reply_text = (
            f"I have created a customized **{requested_days}-day travel plan for {destination_found}** with a budget of **${budget_val:,.0f}**! "
            f"Every location is scheduled with exact real-world parks, museums, and restaurants."
        )

        return {
            "reply": reply_text,
            "master_output": agent_output,
            "rag_context": rag_hits,
            "suggested_prompts": [
                f"What is the culture in {destination_found}?",
                f"Top local restaurants in {destination_found}",
                f"Best weather months for {destination_found}",
                "Export itinerary as PDF"
            ]
        }
    else:
        answer_text = generate_doubt_answer(user_text, destination_found, rag_hits)

        return {
            "reply": answer_text,
            "master_output": None,
            "rag_context": rag_hits,
            "suggested_prompts": [
                f"Plan a 3-day trip to {destination_found}",
                f"What is the tipping etiquette in {destination_found}?",
                f"Famous historic landmarks in {destination_found}",
                "Best month to visit"
            ]
        }