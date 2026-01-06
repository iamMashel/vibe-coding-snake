def test_save_and_load_game(client):
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
    # Note: Game save might require auth or valid user depending on implementation.
    # The original test used "test-user-id". Let's verify if implementation enforces DB constraint.
    # Game save implementation in routers/game.py probably uses Redis or just mocks in the original?
    # Wait, the original tests.py failed because mock_db was missing.
    # Let's check routers/game.py content first to be sure.
    assert response.status_code == 200
    
    # Load
    response = client.get("/api/game/load/test-user-id")
    assert response.status_code == 200
    assert response.json()["data"]["score"] == 100
