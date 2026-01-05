from fastapi import APIRouter, Body
from ..models import ApiResponse, GameState
from ..mock_db import db

router = APIRouter(prefix="/game", tags=["Game"])

@router.post("/save", response_model=ApiResponse)
async def save_game(userId: str = Body(...), gameState: GameState = Body(...)):
    db.saved_games[userId] = gameState
    return ApiResponse(success=True)

@router.get("/load/{userId}", response_model=ApiResponse)
async def load_game(userId: str):
    data = db.saved_games.get(userId)
    return ApiResponse(success=True, data=data)
