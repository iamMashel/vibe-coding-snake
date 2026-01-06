from src.db.database import SessionLocal
from src.db.models import User, Score

def list_data():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        print(f"--- USERS ({len(users)}) ---")
        for u in users:
            print(f"ID: {u.id}, Username: '{u.username}', Email: {u.email}")

        scores = db.query(Score).all()
        print(f"--- SCORES ({len(scores)}) ---")
        for s in scores:
            print(f"User: {s.user_id}, Score: {s.score}, Mode: {s.mode}")
            
    finally:
        db.close()

if __name__ == "__main__":
    list_data()
