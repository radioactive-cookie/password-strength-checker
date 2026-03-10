"""
API routes for password strength checking.
"""

from fastapi import APIRouter, HTTPException
from app.schemas.password_schema import PasswordRequest, PasswordResponse
from app.services.password_checker import PasswordChecker

# Create router for password-related endpoints
router = APIRouter(
    prefix="/api",
    tags=["password"]
)


@router.post("/check-password", response_model=PasswordResponse)
async def check_password(request: PasswordRequest) -> PasswordResponse:
    """
    Evaluate password strength.
    
    This endpoint analyzes a password and returns detailed strength metrics
    including score, entropy, suggestions, and estimated crack time.
    
    Args:
        request (PasswordRequest): Request containing the password to check.
    
    Returns:
        PasswordResponse: Detailed password strength assessment.
    
    Raises:
        HTTPException: If password is empty or validation fails.
    
    Example:
        POST /api/check-password
        {
            "password": "MyP@ssw0rd123!"
        }
        
        Response:
        {
            "password": "MyP@ssw0rd123!",
            "score": 4,
            "strength": "Very Strong",
            "entropy": 83.45,
            "suggestions": [],
            "estimated_crack_time": "centuries"
        }
    """
    try:
        # Validate password input
        if not request.password or len(request.password.strip()) == 0:
            raise HTTPException(
                status_code=400,
                detail="Password cannot be empty"
            )
        
        # Evaluate password strength
        result = PasswordChecker.evaluate_password(request.password)
        
        # Return response
        return PasswordResponse(**result)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error evaluating password: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """
    Health check endpoint.
    
    Returns:
        Dict: Service status.
    """
    return {"status": "healthy", "service": "Password Strength Checker API"}
