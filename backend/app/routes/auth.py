"""
Authentication routes for secure user registration and login.
Implements secure password hashing with bcrypt.
"""

from fastapi import APIRouter, HTTPException, status
from app.models.user import UserCreate, UserLogin, UserResponse, UserInDB, user_store
from app.utils.security import hash_password, verify_password
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserCreate):
    """
    Register a new user with secure password hashing.
    
    Args:
        user_data: UserCreate schema containing username and password
        
    Returns:
        UserResponse: The created user (without password)
        
    Raises:
        HTTPException: If username already exists or validation fails
    """
    try:
        # Hash the password using bcrypt
        hashed_password = hash_password(user_data.password)
        
        # Create user with hashed password
        user = user_store.create_user(
            username=user_data.username,
            hashed_password=hashed_password,
            email=user_data.email
        )
        
        # Return user without exposing hashed password
        return UserResponse(
            id=user.get("id"),
            username=user.get("username"),
            email=user.get("email"),
            created_at=datetime.fromisoformat(user.get("created_at")) if user.get("created_at") else None
        )
    
    except ValueError as e:
        # User already exists or validation error
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during registration"
        )


@router.post("/login", response_model=dict)
async def login_user(credentials: UserLogin):
    """
    Authenticate a user and verify their password.
    
    Args:
        credentials: UserLogin schema containing username and password
        
    Returns:
        dict: Login status and user info
        
    Raises:
        HTTPException: If username not found or password is incorrect
        
    Security:
        - Uses timing-attack resistant password comparison
        - Never reveals whether username or password is wrong (both return same error)
        - Hashed passwords are verified using bcrypt
    """
    try:
        # Get user from storage
        user = user_store.get_user_by_username(credentials.username)
        
        if user is None:
            # User not found - use generic error for security
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password"
            )
        
        # Verify password using bcrypt (timing-attack resistant)
        password_valid = verify_password(
            credentials.password,
            user.get("hashed_password")
        )
        
        if not password_valid:
            # Password mismatch - use generic error for security
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password"
            )
        
        # Login successful - return user info (without hashed password)
        return {
            "success": True,
            "message": "Login successful",
            "user": {
                "id": user.get("id"),
                "username": user.get("username"),
                "email": user.get("email")
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during login"
        )


@router.get("/users/count", response_model=dict)
async def get_user_count():
    """
    Get the total number of registered users (for statistics).
    
    Returns:
        dict: Total user count
    """
    return {
        "total_users": user_store.user_count()
    }


@router.post("/verify-password", response_model=dict)
async def verify_stored_password(username: str, password: str):
    """
    Verify a password for an existing user (for testing purposes).
    
    Args:
        username: The username to verify
        password: The password to verify
        
    Returns:
        dict: Verification result
    """
    user = user_store.get_user_by_username(username)
    
    if not user:
        return {
            "success": False,
            "message": "User not found",
            "verified": False
        }
    
    is_valid = verify_password(password, user.get("hashed_password"))
    
    return {
        "success": True,
        "message": "Password verification complete",
        "verified": is_valid,
        "username": username
    }
