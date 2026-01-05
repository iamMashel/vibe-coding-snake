import pytest
from fastapi.testclient import TestClient
from main import app
from src.mock_db import db

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

# Auth Tests
def test_signup_and_login():
    # Signup
    signup_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123"
    }
    response = client.post("/api/auth/signup", json=signup_data)
    assert response.status_code == 200
    assert response.json()["success"] is True
    assert response.json()["data"]["username"] == "testuser"
    
    # Login
    login_data = {"email": "test@example.com", "password": "password123"}
    response = client.post("/api/auth/login", json=login_data)
    assert response.status_code == 200
    assert response.json()["success"] is True
    
    # Duplicate Signup
    response = client.post("/api/auth/signup", json=signup_data)
    assert response.status_code == 400

# Leaderboard Tests
def test_leaderboard():
    # Submit score
    score_data = {
        "score": 5000,
        "mode": "walls",
        "username": "testuser"
    }
    response = client.post("/api/leaderboard/", json=score_data)
    assert response.status_code == 200
    assert response.json()["success"] is True
    
    # Get leaderboard
    response = client.get("/api/leaderboard/")
    assert response.status_code == 200
    entries = response.json()["data"]
    assert len(entries) > 0
    # Verify sorting
    scores = [e["score"] for e in entries]
    assert scores == sorted(scores, reverse=True)

# Game Tests
def test_save_and_load_game():
    game_state = {
        "snake": [{"x": 10, "y": 10}],
        "food": {"x": 5, "y": 5},
        "direction": "LEFT",
        "score": 100,
        "status": "playing",
        "mode": "pass-through",
        "speed": 150
    }
    
    # Save
    response = client.post("/api/game/save", json={
        "userId": "test-user-id",
        "gameState": game_state
    })
    assert response.status_code == 200
    
    # Load
    response = client.get("/api/game/load/test-user-id")
    assert response.status_code == 200
    assert response.json()["data"]["score"] == 100
