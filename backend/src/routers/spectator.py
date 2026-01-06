from typing import List
from fastapi import APIRouter, HTTPException
from ..models import ApiResponse, ActivePlayer, GameMode, GameStatus, GameState, Position, Direction

router = APIRouter(prefix="/spectator", tags=["Spectator"])

# Mock active players for spectator mode
MOCK_ACTIVE_PLAYERS = [
    ActivePlayer(
        id="player1",
        username="SnakeMaster",
        score=1200,
        mode=GameMode.PASS_THROUGH,
        gameState=GameState(
            snake=[Position(x=10, y=10), Position(x=10, y=11), Position(x=10, y=12)],
            food=Position(x=5, y=5),
            direction=Direction.UP,
            score=1200,
            status=GameStatus.PLAYING,
            mode=GameMode.PASS_THROUGH,
            speed=100
        ),
        viewers=12
    ),
    ActivePlayer(
        id="player2",
        username="Pythonista",
        score=850,
        mode=GameMode.WALLS,
        gameState=GameState(
            snake=[Position(x=15, y=15), Position(x=16, y=15)],
            food=Position(x=2, y=2),
            direction=Direction.LEFT,
            score=850,
            status=GameStatus.PLAYING,
            mode=GameMode.WALLS,
            speed=120
        ),
        viewers=5
    )
]

@router.get("/active", response_model=ApiResponse)
async def get_active_players():
    # Return mock generated players if empty
    return ApiResponse(success=True, data=MOCK_ACTIVE_PLAYERS)

@router.post("/watch/{player_id}", response_model=ApiResponse)
async def watch_player(player_id: str):
    player = next((p for p in MOCK_ACTIVE_PLAYERS if p.id == player_id), None)
    if not player:
        # For mock purposes, if not found, we assume it's valid
        # raise HTTPException(status_code=404, detail="Player not found")
        pass
        
    return ApiResponse(success=True, data=player)

@router.post("/stop/{player_id}", response_model=ApiResponse)
async def stop_watching(player_id: str):
    return ApiResponse(success=True)
