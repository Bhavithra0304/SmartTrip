from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from config import settings
from database.connection import engine, Base
from rag.ingest import init_chroma_db

# Import API Routers
from api.auth import router as auth_router
from api.trips import router as trips_router
from api.chat import router as chat_router
from api.user import router as user_router
from api.settings import router as settings_router

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="PlanNgo Smart AI Travel Planner API.",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(trips_router, prefix=settings.API_V1_STR)
app.include_router(chat_router, prefix=settings.API_V1_STR)
app.include_router(user_router, prefix=settings.API_V1_STR)
app.include_router(settings_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def startup_event():
    # 1. Automatic database schema check for new columns
    try:
        with engine.connect() as conn:
            if settings.DATABASE_URL.startswith("sqlite"):
                res = conn.execute(text("PRAGMA table_info(trips)"))
                cols = [r[1] for r in res.fetchall()]
                if "local_events" not in cols:
                    conn.execute(text("ALTER TABLE trips ADD COLUMN local_events JSON DEFAULT '{}'"))
                if "safety_prediction" not in cols:
                    conn.execute(text("ALTER TABLE trips ADD COLUMN safety_prediction JSON DEFAULT '{}'"))
                if "crowd_prediction" not in cols:
                    conn.execute(text("ALTER TABLE trips ADD COLUMN crowd_prediction JSON DEFAULT '{}'"))
                conn.commit()
                print("Database schema columns check completed.")
    except Exception as e:
        print(f"Startup DB migration warning: {e}")

    # 2. Ingest RAG knowledge base into ChromaDB on startup
    try:
        init_chroma_db()
        print("ChromaDB initialization completed.")
    except Exception as e:
        print(f"Startup ChromaDB warning: {e}")

@app.get("/")
def root():
    return {
        "app": settings.PROJECT_NAME,
        "status": "online",
        "version": settings.VERSION,
        "docs_url": "/docs"
    }
