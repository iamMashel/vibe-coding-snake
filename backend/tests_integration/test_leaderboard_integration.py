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

def test_leaderboard_sorting_and_filtering(client):
    # Setup users
    u1 = {"username": "algo", "email": "a@t.com", "password": "p"}
    u2 = {"username": "bob", "email": "b@t.com", "password": "p"}
    client.post("/api/auth/signup", json=u1)
    client.post("/api/auth/signup", json=u2)
    
    # Submit scores (mixed modes)
    submissions = [
        {"username": "algo", "score": 100, "mode": "walls"},
        {"username": "bob",  "score": 200, "mode": "walls"},
        {"username": "algo", "score": 50,  "mode": "pass-through"},
        {"username": "bob",  "score": 300, "mode": "pass-through"}
    ]
    
    for s in submissions:
        client.post("/api/leaderboard/", json=s)
        
    # Test 1: Global Sorting (No mode filter)
    res = client.get("/api/leaderboard/")
    data = res.json()["data"]
    # Expect: 300 (bob), 200 (bob), 100 (algo), 50 (algo) - strictly desc
    scores = [d["score"] for d in data]
    assert scores == [300, 200, 100, 50]
    assert data[0]["username"] == "bob"
    assert data[0]["rank"] == 1
    
    # Test 2: Filter by 'walls'
    res = client.get("/api/leaderboard/?mode=walls")
    data = res.json()["data"]
    scores = [d["score"] for d in data]
    # Expect: 200 (bob), 100 (algo)
    assert scores == [200, 100]
    assert all(d["mode"] == "walls" for d in data)
    
    # Test 3: Filter by 'pass-through'
    res = client.get("/api/leaderboard/?mode=pass-through")
    data = res.json()["data"]
    scores = [d["score"] for d in data]
    # Expect: 300 (bob), 50 (algo)
    assert scores == [300, 50]
