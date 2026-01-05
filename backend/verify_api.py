import httpx
import sys
import time
from uuid import uuid4

BASE_URL = "http://127.0.0.1:8000"

def run_verification():
    print(f"Verifying API at {BASE_URL}...")
    
    try:
        # 1. Health Check
        print("\n1. Testing Health Check...")
        resp = httpx.get(f"{BASE_URL}/health")
        assert resp.status_code == 200
        print("✅ Health check passed")

        # 2. Auth Flow
        print("\n2. Testing Auth Flow...")
        username = f"user_{uuid4().hex[:8]}"
        email = f"{username}@test.com"
        password = "password123"
        
        # Signup
        print(f"   Signing up {username}...")
        resp = httpx.post(f"{BASE_URL}/api/auth/signup", json={
            "username": username,
            "email": email,
            "password": password
        })
        assert resp.status_code == 200
        user_data = resp.json()["data"]
        user_id = user_data["id"]
        print("✅ Signup passed")

        # Login
        print("   Logging in...")
        resp = httpx.post(f"{BASE_URL}/api/auth/login", json={
            "email": email,
            "password": password
        })
        assert resp.status_code == 200
        print("✅ Login passed")

        # 3. Leaderboard
        print("\n3. Testing Leaderboard...")
        # Submit Score
        resp = httpx.post(f"{BASE_URL}/api/leaderboard/", json={
            "score": 1234,
            "mode": "walls",
            "username": username
        })
        assert resp.status_code == 200
        print("✅ Score submission passed")

        # Get Leaderboard
        resp = httpx.get(f"{BASE_URL}/api/leaderboard/", params={"mode": "walls"})
        assert resp.status_code == 200
        entries = resp.json()["data"]
        assert any(e["username"] == username for e in entries)
        print("✅ Get leaderboard passed")

        # 4. Game Persistence
        print("\n4. Testing Game Persistence...")
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
        resp = httpx.post(f"{BASE_URL}/api/game/save", json={
            "userId": user_id,
            "gameState": game_state
        })
        assert resp.status_code == 200
        print("✅ Save game passed")

        # Load
        resp = httpx.get(f"{BASE_URL}/api/game/load/{user_id}")
        assert resp.status_code == 200
        loaded_state = resp.json()["data"]
        assert loaded_state["score"] == 100
        print("✅ Load game passed")

        # 5. Spectator
        print("\n5. Testing Spectator...")
        resp = httpx.get(f"{BASE_URL}/api/spectator/active")
        assert resp.status_code == 200
        print("✅ Active players check passed")

        print("\n🎉 ALL CHECKS PASSED!")
        return 0

    except Exception as e:
        print(f"\n❌ VERIFICATION FAILED: {str(e)}")
        return 1

if __name__ == "__main__":
    sys.exit(run_verification())
