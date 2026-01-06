def test_leaderboard_flow(client):
    # 1. Create User
    user_data = {
        "username": "gamer1",
        "email": "gamer1@test.com",
        "password": "pass"
    }
    client.post("/api/auth/signup", json=user_data)
    
    # 2. Submit Score
    score_data = {
        "score": 100,
        "mode": "walls",
        "username": "gamer1"
    }
    response = client.post("/api/leaderboard/", json=score_data)
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["success"] is True
    assert data["data"]["score"] == 100
    
    # 3. Get Leaderboard
    response = client.get("/api/leaderboard/")
    assert response.status_code == 200
    lb_data = response.json()["data"]
    assert len(lb_data) == 1
    assert lb_data[0]["username"] == "gamer1"
    assert lb_data[0]["score"] == 100

def test_submit_score_invalid_user(client):
    score_data = {
        "score": 500,
        "mode": "walls",
        "username": "ghost_user"
    }
    response = client.post("/api/leaderboard/", json=score_data)
    assert response.status_code == 404
    assert "User not found" in response.json()["detail"]
