import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "PlanNgo - Smart AI Travel Planner"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "planngo_super_secret_jwt_token_key_2026_secure")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./planngo.db")
    
    # Groq LLM API Configuration
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    GROQ_API_URL: str = os.getenv("GROQ_API_URL", "https://api.groq.com/openai/v1/chat/completions")
    
    # Map & Weather & Currency & Events APIs
    TOMTOM_API_KEY: str = os.getenv("TOMTOM_API_KEY", "")
    OPENMETEO_BASE_URL: str = os.getenv("OPENMETEO_BASE_URL", "https://api.open-meteo.com/v1/forecast")
    OPENMETEO_GEOCODING_URL: str = os.getenv("OPENMETEO_GEOCODING_URL", "https://geocoding-api.open-meteo.com/v1/search")
    EXCHANGERATE_API_URL: str = os.getenv("EXCHANGERATE_API_URL", "https://open.er-api.com/v6/latest")
    PREDICTHQ_API_KEY: str = os.getenv("PREDICTHQ_API_KEY", "")
    PREDICTHQ_BASE_URL: str = os.getenv("PREDICTHQ_BASE_URL", "https://api.predicthq.com/v1/events")
    
    # OpenAI & Service Keys (Alternative)
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    
    # Vector DB Directory
    CHROMA_DB_DIR: str = os.getenv("CHROMA_DB_DIR", "./chroma_db")

settings = Settings()
