from typing import List, Optional
from enum import Enum
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

class GameMode(str, Enum):
    PASS_THROUGH = 'pass-through'
    WALLS = 'walls'

class GameStatus(str, Enum):
    IDLE = 'idle'
    PLAYING = 'playing'
    PAUSED = 'paused'
    GAME_OVER = 'game-over'

class Direction(str, Enum):
    UP = 'UP'
    DOWN = 'DOWN'
    LEFT = 'LEFT'
    RIGHT = 'RIGHT'

class Position(BaseModel):
    x: int
    y: int

class User(BaseModel):
    id: str
    username: str
    email: EmailStr
    avatarUrl: Optional[str] = None
    createdAt: datetime

class LoginCredentials(BaseModel):
    email: EmailStr
    password: str

class SignupCredentials(BaseModel):
    username: str
    email: EmailStr
    password: str

class LeaderboardEntry(BaseModel):
    id: str
    rank: int
    username: str
    score: int
    mode: GameMode
    playedAt: datetime

class GameState(BaseModel):
    snake: List[Position]
    food: Position
    direction: Direction
    score: int
    status: GameStatus
    mode: GameMode
    speed: int

class ActivePlayer(BaseModel):
    id: str
    username: str
    score: int
    mode: GameMode
    gameState: GameState
    viewers: int

class ApiResponse(BaseModel):
    success: bool
    data: Optional[object] = None
    error: Optional[str] = None
