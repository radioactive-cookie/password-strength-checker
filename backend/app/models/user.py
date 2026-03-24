"""
User model for secure authentication using Supabase.
Stores encrypted user credentials with bcrypt hashing.
"""

from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional


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


# Supabase-based user storage (uses Supabase for persistent data)
class UserStore:
    """
    User storage using Supabase as the backend.
    
    Replaces JSON-based file storage with remote PostgreSQL database.
    Provides a consistent API for user management operations.
    
    Required environment variables:
        SUPABASE_URL: Supabase project URL
        SUPABASE_KEY: Supabase API key
    """
    
    def __init__(self):
        """Initialize Supabase client."""
        try:
            from app.db.supabase_client import supabase
            self.supabase = supabase
            self.table_name = "users"
        except Exception as e:
            raise RuntimeError(
                f"Failed to initialize Supabase client: {str(e)}. "
                "Ensure SUPABASE_URL and SUPABASE_KEY environment variables are set."
            )
    
    def get_user_by_username(self, username: str) -> Optional[dict]:
        """
        Get user by username from Supabase.
        
        Args:
            username: The username to search for
            
        Returns:
            User dictionary if found, None otherwise
            
        Raises:
            Exception: If database query fails
        """
        try:
            response = self.supabase.table(self.table_name).select("*").eq(
                "username", username
            ).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            return None
        except Exception as e:
            print(f"Error fetching user by username: {e}")
            raise
    
    def create_user(self, username: str, hashed_password: str, email: Optional[str] = None) -> dict:
        """
        Create a new user in Supabase.
        
        Args:
            username: Unique username
            hashed_password: Bcrypt hashed password (never store plaintext)
            email: Optional email address
            
        Returns:
            The created user record
            
        Raises:
            ValueError: If username already exists
            Exception: If database operation fails
        """
        try:
            # Check if user already exists
            existing_user = self.get_user_by_username(username)
            if existing_user:
                raise ValueError(f"User '{username}' already exists")
            
            # Insert new user into Supabase
            response = self.supabase.table(self.table_name).insert({
                "username": username,
                "hashed_password": hashed_password,
                "email": email,
                "created_at": datetime.now().isoformat()
            }).execute()
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            else:
                raise Exception("Failed to create user in database")
        except ValueError:
            # Re-raise ValueError for duplicate username
            raise
        except Exception as e:
            print(f"Error creating user: {e}")
            raise
    
    def get_all_users(self) -> list:
        """
        Get all users from Supabase (admin purposes only).
        
        WARNING: This should only be used in administrative contexts.
        Never expose hashed passwords or user data to clients.
        
        Returns:
            List of all user records
        """
        try:
            response = self.supabase.table(self.table_name).select("*").execute()
            return response.data if response.data else []
        except Exception as e:
            print(f"Error fetching all users: {e}")
            raise
    
    def delete_user(self, username: str) -> bool:
        """
        Delete a user by username.
        
        Args:
            username: The username to delete
            
        Returns:
            True if user was deleted, False if not found
        """
        try:
            # Check if user exists first
            user = self.get_user_by_username(username)
            if not user:
                return False
            
            # Delete the user
            response = self.supabase.table(self.table_name).delete().eq(
                "username", username
            ).execute()
            
            return True
        except Exception as e:
            print(f"Error deleting user: {e}")
            raise


# Lazy loader for UserStore to ensure env variables are loaded first
class _LazyUserStore:
    """Lazy initialization wrapper for UserStore."""
    _instance = None
    
    def __getattr__(self, name):
        if self._instance is None:
            self._instance = UserStore()
        return getattr(self._instance, name)


# Global user store instance - lazy initialized
user_store = _LazyUserStore()

