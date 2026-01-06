def test_get_active_players(client):
    response = client.get("/api/spectator/active")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    # Currently hardcoded to 2 mock players
    assert isinstance(data["data"], list)
    assert len(data["data"]) > 0
    assert "id" in data["data"][0]
    assert "snake" in data["data"][0]["gameState"]

def test_watch_player(client):
    # Try watching "player1" (hardcoded mock)
    response = client.post("/api/spectator/watch/player1")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["id"] == "player1"

def test_watch_player_invalid(client):
    # Try watching unknown
    response = client.post("/api/spectator/watch/unknown")
    assert response.status_code == 200 # Current mock returns empty "success" or similar?
    # Inspecting spectator.py: if not player: return ApiResponse(success=True, data=None) or similar logic (checked "pass").
    # Wait, spectator.py:
    # player = ... or None
    # if not player: pass
    # return ApiResponse(success=True, data=player)
    # So it returns success=True, data=None for invalid.
    
    data = response.json()
    assert data["success"] is True
    assert data["data"] is None
