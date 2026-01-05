from typing import List
from fastapi import APIRouter, HTTPException
from ..models import ApiResponse, ActivePlayer
from ..mock_db import db

router = APIRouter(prefix="/spectator", tags=["Spectator"])

@router.get("/active", response_model=ApiResponse)
async def get_active_players():
    # Return mock generated players if empty
    return ApiResponse(success=True, data=db.active_players)

@router.post("/watch/{player_id}", response_model=ApiResponse)
async def watch_player(player_id: str):
    player = next((p for p in db.active_players if p.id == player_id), None)
    if not player:
        # For mock purposes, if not found, we assume it's valid
        # raise HTTPException(status_code=404, detail="Player not found")
        pass
        
    return ApiResponse(success=True, data=player)

@router.post("/stop/{player_id}", response_model=ApiResponse)
async def stop_watching(player_id: str):
    return ApiResponse(success=True)
