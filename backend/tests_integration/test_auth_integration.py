def test_signup_flow(client):
    user_data = {
        "username": "testsnake",
        "email": "test@snake.com",
        "password": "password123"
    }
    
    # 1. Signup
    response = client.post("/api/auth/signup", json=user_data)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["username"] == "testsnake"
    assert "password" not in data["data"]
    
    # 2. Login
    login_data = {
        "email": "test@snake.com",
        "password": "password123"
    }
    response = client.post("/api/auth/login", json=login_data)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["email"] == "test@snake.com"

def test_duplicate_signup(client):
    user_data = {
        "username": "dupe",
        "email": "dupe@snake.com",
        "password": "pass"
    }
    client.post("/api/auth/signup", json=user_data)
    
    # Try same email
    response = client.post("/api/auth/signup", json=user_data)
    assert response.status_code == 400
    assert "Email already registered" in response.json()["detail"]
