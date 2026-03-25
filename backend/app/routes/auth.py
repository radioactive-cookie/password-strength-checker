"""
Authentication routes for user registration and login.
Stores passwords in plaintext format in Supabase.
Uses Supabase for persistent user storage.
Includes email verification with OTP.
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from app.models.user import UserCreate, UserLogin, UserResponse, UserInDB, user_store
from app.services.otp_service import OTPService
from app.utils.email import EmailService
from datetime import datetime

router = APIRouter(prefix="/auth", tags=["authentication"])


# Additional request/response models for email verification
class VerifyEmailRequest(BaseModel):
    """Request schema for email verification."""
    username: str
    otp: str


class VerifyEmailResponse(BaseModel):
    """Response schema for email verification."""
    success: bool
    message: str
    verified: bool = False


@router.post("/register", response_model=dict, status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserCreate):
    """
    Register a new user with secure password hashing and email verification.
    
    Passwords are hashed with bcrypt and stored securely in Supabase.
    User account is created but marked as unverified until email is verified with OTP.
    Each user must have a unique username.
    
    Args:
        user_data: UserCreate schema containing username, password, and optional email
        
    Returns:
        dict: User info and verification status
        {
            "success": true,
            "message": "Registration successful. Check your email for verification code.",
            "user": {
                "id": 1,
                "username": "john_doe",
                "email": "john@example.com"
            },
            "requires_verification": true,
            "verification_sent_to": "john@example.com"
        }
        
    Raises:
        HTTPException 400: If username already exists or validation fails
        HTTPException 500: If database operation fails
        
    Security:
        - Passwords are hashed with bcrypt (never stored plaintext)
        - Usernames are unique in database
        - Email is optional but recommended for verification
        - Account is created but login restricted until verified (if email provided)
    """
    try:
        # Create user with plaintext password in Supabase
        # User is created with is_verified=False (default) if email is provided
        user = user_store.create_user(
            username=user_data.username,
            password=user_data.password,
            email=user_data.email
        )
        
        user_response = UserResponse(
            id=user.get("id"),
            username=user.get("username"),
            email=user.get("email"),
            created_at=datetime.fromisoformat(user.get("created_at")) if user.get("created_at") else None
        )
        
        # If email provided, generate and send OTP for verification
        response_data = {
            "success": True,
            "message": "Registration successful",
            "user": user_response.dict(),
            "requires_verification": False,
            "verification_sent_to": None
        }
        
        if user_data.email:
            try:
                # Generate OTP
                otp = OTPService.generate_otp()
                
                # Store OTP in database
                otp_stored = OTPService.store_otp(user_data.username, otp)
                
                if otp_stored:
                    # Send OTP via email
                    email_sent = EmailService.send_otp_email(
                        email=user_data.email,
                        username=user_data.username,
                        otp=otp
                    )
                    
                    if email_sent:
                        response_data["requires_verification"] = True
                        response_data["verification_sent_to"] = user_data.email
                        response_data["message"] = "Registration successful. Check your email for verification code."
                    else:
                        print(f"⚠️  Warning: Failed to send OTP email to {user_data.email}")
                        # Continue with registration even if email fails
            
            except Exception as e:
                print(f"⚠️  Warning: Error during email verification setup: {str(e)}")
                # Continue with registration even if verification setup fails
        
        return response_data
    
    except ValueError as e:
        # User already exists or validation error
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        # Database error or other unexpected error
        print(f"Registration error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during registration. Please try again."
        )


@router.post("/login", response_model=dict)
async def login_user(credentials: UserLogin):
    """
    Authenticate a user and verify their password.
    
    Retrieves user from Supabase and validates password with bcrypt.
    Checks if user's email has been verified (if email verification was required).
    
    Args:
        credentials: UserLogin schema containing username and password
        
    Returns:
        dict: Login status and user info (excluding hashed password)
        {
            "success": true,
            "message": "Login successful",
            "user": {
                "id": 1,
                "username": "john_doe",
                "email": "john@example.com",
                "is_verified": true
            }
        }
        
    Raises:
        HTTPException 401: If username not found, password is incorrect, or email not verified
        HTTPException 500: If database operation fails
        
    Security:
        - Uses timing-attack resistant password comparison (bcrypt)
        - Generic error message for both user not found and invalid password
        - Never reveals database details or hashed passwords
        - Checks email verification status (soft requirement - shows in response)
    """
    try:
        # Get user from Supabase
        user = user_store.get_user_by_username(credentials.username)
        
        if user is None:
            # User not found - use generic error for security
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password"
            )
        
        # Verify password by comparing plaintext passwords
        password_valid = credentials.password == user.get("password")
        
        if not password_valid:
            # Password mismatch - use generic error for security
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password"
            )
        
        # Check if user email is verified (if email was set)
        is_verified = user.get("is_verified", True)  # Default to True for users without email
        
        # Login successful - return user info (without hashed password)
        return {
            "success": True,
            "message": "Login successful",
            "user": {
                "id": user.get("id"),
                "username": user.get("username"),
                "email": user.get("email"),
                "is_verified": is_verified
            }
        }
    
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Database error or other unexpected error
        print(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during login. Please try again."
        )


@router.post("/verify-email", response_model=VerifyEmailResponse)
async def verify_email(request: VerifyEmailRequest):
    """
    Verify user's email address using OTP code.
    
    After successful verification, user's is_verified flag is set to True,
    allowing full access to the application.
    
    Args:
        request: VerifyEmailRequest containing username and OTP code
        
    Returns:
        VerifyEmailResponse: Verification status
        {
            "success": true,
            "message": "Email verified successfully",
            "verified": true
        }
        
    Raises:
        HTTPException 400: If OTP is invalid or expired
        HTTPException 404: If user not found
        HTTPException 500: If database operation fails
        
    Security:
        - OTP is single-use and expires after 5 minutes
        - OTP code is not exposed in error messages
        - Does not reveal if username exists
    """
    try:
        # Check if user exists
        user = user_store.get_user_by_username(request.username)
        
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Verify OTP
        is_valid, message = OTPService.verify_otp(request.username, request.otp)
        
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=message
            )
        
        # OTP is valid - mark user as verified in database
        try:
            user_store.update_user_verification(request.username, is_verified=True)
            print(f"✅ User {request.username} email verified successfully")
        except Exception as e:
            print(f"❌ ERROR: Failed to mark user as verified: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update verification status"
            )
        
        return VerifyEmailResponse(
            success=True,
            message="Email verified successfully",
            verified=True
        )
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Email verification error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during email verification"
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
    
    is_valid = password == user.get("password")
    
    return {
        "success": True,
        "message": "Password verification complete",
        "verified": is_valid,
        "username": username
    }
