from typing import Optional, List
from fastapi import APIRouter, Body
from ..models import ApiResponse, LeaderboardEntry, GameMode
from ..mock_db import db

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])

@router.get("/", response_model=ApiResponse)
async def get_leaderboard(mode: Optional[GameMode] = None):
    entries = db.leaderboard
    if mode:
        entries = [e for e in entries if e.mode == mode]
        
    # Recalculate ranks for the filtered view
    entries_with_rank = []
    for i, e in enumerate(entries):
        # We need to create a copy to not mutate the original db
        entry_copy = e.model_copy()
        entry_copy.rank = i + 1
        entries_with_rank.append(entry_copy)
        
    return ApiResponse(success=True, data=entries_with_rank)

@router.post("/", response_model=ApiResponse)
async def submit_score(
    score: int = Body(...), 
    mode: GameMode = Body(...), 
    username: str = Body(...)
):
    entry = db.add_score(username, score, mode)
    return ApiResponse(success=True, data=entry)
