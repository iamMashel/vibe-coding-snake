from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routers import auth, leaderboard, spectator, game

app = FastAPI(
    title="Vibe Coding Snake Game API",
    description="Backend API for the Vibe Coding Snake Game",
    version="1.0.0"
)

# CORS Configuration
origins = [
    "http://localhost:5173", # Vite dev server
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api")
app.include_router(leaderboard.router, prefix="/api")
app.include_router(spectator.router, prefix="/api")
app.include_router(game.router, prefix="/api")

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.get("/")
async def root():
    return {
        "message": "Welcome to Vibe Coding Snake Game API",
        "docs": "/docs",
        "health": "/health"
    }
