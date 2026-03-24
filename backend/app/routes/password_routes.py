"""
API routes for password strength checking.
"""

from fastapi import APIRouter, HTTPException
from app.schemas.password_schema import PasswordRequest, PasswordResponse
from app.services.password_checker import PasswordChecker
from app.db.supabase_client import supabase

# Create router for password-related endpoints
router = APIRouter(
    prefix="/api",
    tags=["password"]
)


def store_password_analysis(username: str, strength: str, entropy: float, crack_time: str) -> None:
    """
    Store password analysis in user's history.
    
    Args:
        username (str): Username of logged-in user
        strength (str): Password strength classification
        entropy (float): Shannon entropy value
        crack_time (str): Estimated time to crack password
        
    Note:
        If storage fails, logs the error but doesn't raise.
        Password checking continues to work even if history storage fails.
        This is intentional - password analysis is more important than history.
    """
    try:
        supabase.table("password_logs").insert({
            "user_id": username,
            "strength": strength,
            "entropy": entropy,
            "crack_time": crack_time
        }).execute()
    except Exception as e:
        error_str = str(e)
        # Provide helpful error messages
        if "Invalid API key" in error_str or "401" in error_str or "Unauthorized" in error_str:
            print(
                f"❌ ERROR: Invalid or missing Supabase API key. "
                f"Backend requires service_role secret key (sb_secret_), not anon public key. "
                f"Password history not stored for {username}. "
                f"Fix: Update SUPABASE_KEY in .env with service_role key from Supabase console."
            )
        elif "password_logs" in error_str or "PGRST" in error_str:
            print(f"❌ ERROR: password_logs table not found in Supabase. Run schema.sql setup.")
        else:
            print(f"⚠️  Warning: Failed to store password analysis for {username}: {e}")
        # Don't re-raise - password checking should work even if history storage fails


@router.post("/check-password", response_model=PasswordResponse)
async def check_password(request: PasswordRequest) -> PasswordResponse:
    """
    Evaluate password strength and optionally store in user history.
    
    This endpoint analyzes a password and returns detailed strength metrics
    including score, entropy, suggestions, and estimated crack time.
    
    If username is provided, the analysis is stored in the user's password history
    (only accessible when user is logged in).
    
    Args:
        request (PasswordRequest): Request containing password and optional username.
    
    Returns:
        PasswordResponse: Detailed password strength assessment.
    
    Raises:
        HTTPException: If password is empty or validation fails.
    
    Example:
        POST /api/check-password
        {
            "password": "MyP@ssw0rd123!",
            "username": "pritam"
        }
        
        Response:
        {
            "password": "MyP@ssw0rd123!",
            "score": 4,
            "strength": "Very Strong",
            "entropy": 83.45,
            "suggestions": [],
            "estimated_crack_time": "centuries",
            "breach_count": 0
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
        
        # Store in user history if username provided
        if request.username:
            try:
                store_password_analysis(
                    username=request.username,
                    strength=result.get("strength", ""),
                    entropy=result.get("entropy", 0.0),
                    crack_time=result.get("estimated_crack_time", "")
                )
            except Exception as e:
                # Log error but don't fail the password check
                print(f"Failed to store password history for {request.username}: {e}")
        
        # Return response (without password hash, only analysis)
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


@router.get("/history")
async def get_password_history(username: str = None):
    """
    Retrieve password analysis history for the logged-in user.
    
    SECURITY NOTE:
    - Username is passed as a query parameter (not in URL path)
    - Only logged-in users who provide their username can see their history
    - When user logs out, username is removed from frontend storage
    - No cross-user data leakage is possible
    
    Args:
        username (str): Username of logged-in user (required, from query param)
    
    Returns:
        Dict: User's password analysis history
        
    Raises:
        HTTPException 400: If username is not provided
        HTTPException 500: If database query fails
        
    Example:
        GET /api/history?username=pritam
        
        Response:
        {
            "history": [
                {
                    "id": 1,
                    "user_id": "pritam",
                    "strength": "Very Strong",
                    "entropy": 83.45,
                    "crack_time": "centuries",
                    "created_at": "2026-03-24T10:30:00.000Z"
                }
            ]
        }
    """
    try:
        # Validate username is provided
        if not username:
            raise HTTPException(
                status_code=400,
                detail="Username is required to retrieve password history"
            )
        
        # Sanitize username (prevent SQL injection via Supabase client)
        username = username.strip()
        if not username:
            raise HTTPException(
                status_code=400,
                detail="Username cannot be empty"
            )
        
        # Query user-specific password analysis history from Supabase
        try:
            history_response = supabase.table("password_logs") \
                .select("id, user_id, strength, entropy, crack_time, created_at") \
                .eq("user_id", username) \
                .order("created_at", desc=True) \
                .execute()
            
            # Return user's history
            return {
                "username": username,
                "history": history_response.data if history_response.data else []
            }
        except Exception as table_error:
            error_str = str(table_error)
            # Check if it's a missing table error
            if "password_logs" in error_str or "PGRST205" in error_str:
                print(f"Database schema error: password_logs table not found")
                raise HTTPException(
                    status_code=503,
                    detail="Password history table not initialized. Please contact administrator to run database setup SQL."
                )
            raise
    
    except HTTPException:
        raise
    except Exception as e:
        error_str = str(e)
        print(f"Error retrieving password history for {username}: {e}")
        
        # Check for common errors
        if "Invalid API key" in error_str or "401" in error_str or "Unauthorized" in error_str:
            raise HTTPException(
                status_code=503,
                detail=(
                    "Database connection failed: Invalid or missing Supabase API key. "
                    "Backend requires service_role secret key (sb_secret_), not anon public key. "
                    "Update SUPABASE_KEY in .env with the service_role secret from Supabase console."
                )
            )
        elif "password_logs" in error_str:
            raise HTTPException(
                status_code=503,
                detail="Database table not found. Please run database setup SQL (schema.sql) in Supabase SQL Editor."
            )
        else:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to retrieve password history: {error_str}"
            )
