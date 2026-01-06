from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from src.routers import auth, leaderboard, spectator, game
import os

app = FastAPI(
    title="Vibe Coding Snake Game API",
    description="Backend API for the Vibe Coding Snake Game",
    version="1.0.0"
)

# CORS Configuration - Allow all origins in development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api")
app.include_router(leaderboard.router, prefix="/api")
app.include_router(spectator.router, prefix="/api")
app.include_router(game.router, prefix="/api")

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

# Mount static files
app.mount("/assets", StaticFiles(directory="/app/static/assets"), name="assets")

@app.get("/")
async def serve_root():
    return FileResponse("/app/static/index.html")

@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    # Allow API routes to pass through (though they should be caught by routers above)
    if full_path.startswith("api/"):
            return {"error": "Not found"}
            
    # Serve index.html for all other routes (SPA)
    return FileResponse("/app/static/index.html")
