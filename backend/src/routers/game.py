from fastapi import APIRouter, Body
from ..models import ApiResponse, GameState

# Local mock storage for saved games (unused in frontend currently)
SAVED_GAMES = {}

router = APIRouter(prefix="/game", tags=["Game"])

@router.post("/save", response_model=ApiResponse)
async def save_game(userId: str = Body(...), gameState: GameState = Body(...)):
    SAVED_GAMES[userId] = gameState
    return ApiResponse(success=True)

@router.get("/load/{userId}", response_model=ApiResponse)
async def load_game(userId: str):
    data = SAVED_GAMES.get(userId)
    return ApiResponse(success=True, data=data)
