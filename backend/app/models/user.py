"""
User model for secure authentication.
Stores user credentials with hashed passwords.
"""

from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional
import json
import os
from pathlib import Path


# Pydantic models for API validation
class UserCreate(BaseModel):
    """Schema for user registration."""
    username: str = Field(..., min_length=3, max_length=50, description="Username (3-50 characters)")
    password: str = Field(..., min_length=8, description="Password (minimum 8 characters)")
    email: Optional[str] = Field(None, description="Optional email address")
    
    @validator('username')
    def username_alphanumeric(cls, v):
        """Ensure username contains only alphanumeric characters and underscores."""
        if not v.replace('_', '').replace('-', '').isalnum():
            raise ValueError('Username must contain only alphanumeric characters, hyphens, and underscores')
        return v
    
    @validator('password')
    def password_not_empty(cls, v):
        """Ensure password is not empty or just whitespace."""
        if not v or v.isspace():
            raise ValueError('Password cannot be empty')
        return v


class UserLogin(BaseModel):
    """Schema for user login."""
    username: str = Field(..., description="Username")
    password: str = Field(..., description="Password")


class UserResponse(BaseModel):
    """Schema for user response (never includes password)."""
    id: Optional[int] = None
    username: str
    email: Optional[str] = None
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class UserInDB(BaseModel):
    """Schema for user in database (internal use only)."""
    id: Optional[int] = None
    username: str
    hashed_password: str
    email: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)


# Simple file-based storage (for development; use SQLite for production)
class UserStore:
    """
    Simple JSON-based user storage.
    For production use SQLAlchemy with SQLite or PostgreSQL.
    """
    
    def __init__(self, db_path: str = None):
        if db_path is None:
            db_path = os.path.join(
                os.path.dirname(__file__),
                "../../data/users.json"
            )
        
        self.db_path = db_path
        self._ensure_db_exists()
    
    def _ensure_db_exists(self):
        """Create the database file if it doesn't exist."""
        directory = os.path.dirname(self.db_path)
        if directory and not os.path.exists(directory):
            os.makedirs(directory, exist_ok=True)
        
        if not os.path.exists(self.db_path):
            with open(self.db_path, 'w') as f:
                json.dump({"users": []}, f)
    
    def _load_users(self) -> list:
        """Load users from JSON file."""
        try:
            with open(self.db_path, 'r') as f:
                data = json.load(f)
                return data.get("users", [])
        except Exception as e:
            print(f"Error loading users: {e}")
            return []
    
    def _save_users(self, users: list):
        """Save users to JSON file."""
        try:
            with open(self.db_path, 'w') as f:
                json.dump({"users": users}, f, indent=2, default=str)
        except Exception as e:
            print(f"Error saving users: {e}")
    
    def get_user_by_username(self, username: str) -> Optional[dict]:
        """Get user by username."""
        users = self._load_users()
        for user in users:
            if user.get("username") == username:
                return user
        return None
    
    def create_user(self, username: str, hashed_password: str, email: Optional[str] = None) -> dict:
        """Create a new user with hashed password."""
        users = self._load_users()
        
        # Check if user already exists
        if any(u.get("username") == username for u in users):
            raise ValueError(f"User '{username}' already exists")
        
        # Create new user
        user_id = max([u.get("id", 0) for u in users], default=0) + 1
        new_user = {
            "id": user_id,
            "username": username,
            "hashed_password": hashed_password,
            "email": email,
            "created_at": datetime.now().isoformat()
        }
        
        users.append(new_user)
        self._save_users(users)
        
        return new_user
    
    def get_all_users(self) -> list:
        """Get all users (for admin purposes only - never expose hashed passwords)."""
        return self._load_users()
    
    def delete_user(self, username: str) -> bool:
        """Delete a user by username."""
        users = self._load_users()
        original_count = len(users)
        users = [u for u in users if u.get("username") != username]
        
        if len(users) < original_count:
            self._save_users(users)
            return True
        return False
    
    def user_count(self) -> int:
        """Get total number of registered users."""
        return len(self._load_users())


# Global user store instance
user_store = UserStore()
