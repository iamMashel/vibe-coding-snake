from fastapi import APIRouter, HTTPException, Depends
from uuid import uuid4
from ..models import LoginCredentials, SignupCredentials, User, ApiResponse
from ..mock_db import db, verify_password

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login", response_model=ApiResponse)
async def login(credentials: LoginCredentials):
    user_in_db = db.get_user_by_email(credentials.email)
    if not user_in_db:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Verify password using bcrypt
    if not verify_password(credentials.password, user_in_db.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    token = str(uuid4())
    db.sessions[token] = user_in_db.id
    
    # Return public User model without password
    return ApiResponse(success=True, data=user_in_db.to_user())

@router.post("/signup", response_model=ApiResponse)
async def signup(credentials: SignupCredentials):
    if db.get_user_by_email(credentials.email):
        raise HTTPException(status_code=400, detail="Email already registered")
        
    if db.get_user_by_username(credentials.username):
        raise HTTPException(status_code=400, detail="Username already taken")
        
    user_in_db = db.create_user(credentials.username, credentials.email, credentials.password)
    token = str(uuid4())
    db.sessions[token] = user_in_db.id
    
    # Return public User model without password
    return ApiResponse(success=True, data=user_in_db.to_user())

@router.post("/logout", response_model=ApiResponse)
async def logout():
    # In a real app we'd need the token from cookies/headers
    return ApiResponse(success=True)

@router.get("/session", response_model=ApiResponse)
async def get_session():
    # Mock always returning first user for now if we can't accept cookies comfortably in this mock
    # For a real implementation we would parse the cookie
    return ApiResponse(success=True, data=None) # Start with no session
