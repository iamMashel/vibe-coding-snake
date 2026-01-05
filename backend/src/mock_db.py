from typing import List, Optional
from datetime import datetime
from .models import User, LeaderboardEntry, GameState, ActivePlayer, GameMode

class MockDB:
    def __init__(self):
        self.users: List[User] = [
            User(id='1', username='SnakeMaster', email='snake@master.com', createdAt=datetime(2024, 1, 1)),
            User(id='2', username='RetroGamer', email='retro@gamer.com', createdAt=datetime(2024, 1, 5)),
            User(id='3', username='NeonViper', email='neon@viper.com', createdAt=datetime(2024, 1, 10)),
        ]
        
        self.leaderboard: List[LeaderboardEntry] = [
             LeaderboardEntry(id='1', rank=1, username='SnakeMaster', score=2450, mode=GameMode.WALLS, playedAt=datetime(2024, 1, 15)),
             LeaderboardEntry(id='2', rank=2, username='NeonViper', score=2100, mode=GameMode.PASS_THROUGH, playedAt=datetime(2024, 1, 14)),
             LeaderboardEntry(id='3', rank=3, username='RetroGamer', score=1850, mode=GameMode.WALLS, playedAt=datetime(2024, 1, 13)),
        ]
        
        self.sessions = {} # token -> user_id
        self.saved_games = {} # user_id -> GameState
        self.active_players: List[ActivePlayer] = []

    def get_user_by_email(self, email: str) -> Optional[User]:
        return next((u for u in self.users if u.email == email), None)

    def get_user_by_username(self, username: str) -> Optional[User]:
        return next((u for u in self.users if u.username == username), None)

    def create_user(self, username: str, email: str) -> User:
        user = User(
            id=str(len(self.users) + 1),
            username=username,
            email=email,
            createdAt=datetime.now()
        )
        self.users.append(user)
        return user

    def add_score(self, username: str, score: int, mode: GameMode) -> LeaderboardEntry:
        entry = LeaderboardEntry(
            id=str(len(self.leaderboard) + 1),
            rank=0,
            username=username,
            score=score,
            mode=mode,
            playedAt=datetime.now()
        )
        self.leaderboard.append(entry)
        self.leaderboard.sort(key=lambda x: x.score, reverse=True)
        # Recalculate ranks
        for i, e in enumerate(self.leaderboard):
            e.rank = i + 1
            
        # Return updated entry with correct rank
        return next(e for e in self.leaderboard if e.id == entry.id)

db = MockDB()
