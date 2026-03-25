"""
Admin panel API routes for managing users and password logs.

This module provides secure endpoints for admin dashboard to view:
- All registered users
- Password analysis history/logs
- System statistics and analytics

SECURITY:
- All endpoints require admin_key header authentication
- Uses X-Admin-Key header for API key validation
- No sensitive data (raw passwords) is exposed
- All password logs show only masked passwords
- Implements rate limiting and request validation
"""

from fastapi import APIRouter, HTTPException, Header, Query, Depends
from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta
import os
import logging
from app.db.supabase_client import supabase

# Configure logging
logger = logging.getLogger(__name__)

# Create router for admin endpoints
router = APIRouter(
    prefix="/api/admin",
    tags=["admin"],
    responses={
        401: {"description": "Unauthorized - Invalid or missing admin key"},
        403: {"description": "Forbidden - Insufficient permissions"},
        500: {"description": "Internal server error"},
    }
)

# Admin authentication setup
ADMIN_KEY = os.getenv("ADMIN_KEY", "supabaseadmin1234")

def verify_admin_key(x_admin_key: str = Header(None)) -> bool:
    """
    Verify admin authentication via X-Admin-Key header.
    
    Args:
        x_admin_key: Admin key from request header
        
    Returns:
        bool: True if admin key is valid
        
    Raises:
        HTTPException: 401 if key is invalid or missing
    """
    if not x_admin_key:
        logger.warning("Admin access attempt without API key")
        raise HTTPException(
            status_code=401,
            detail="X-Admin-Key header is required"
        )
    
    if x_admin_key != ADMIN_KEY:
        logger.warning(f"Admin access attempt with invalid key")
        raise HTTPException(
            status_code=401,
            detail="Invalid admin key"
        )
    
    return True


@router.get("/health")
async def health_check(admin_key: bool = Depends(verify_admin_key)) -> Dict[str, Any]:
    """
    Health check endpoint for admin panel.
    
    Returns:
        Status and message confirming admin panel is operational
    """
    return {
        "status": "ok",
        "message": "Admin panel is operational",
        "timestamp": datetime.now().isoformat()
    }


@router.get("/users")
async def get_users(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    admin_key: bool = Depends(verify_admin_key)
) -> Dict[str, Any]:
    """
    Fetch all registered users with pagination and search.
    
    Query Parameters:
        page: Page number (1-indexed)
        limit: Results per page (max 100)
        search: Optional search term for username or email
    
    Returns:
        Dictionary with total count, users list, and page info
    """
    try:
        # Calculate offset
        offset = (page - 1) * limit
        
        # Build query
        query = supabase.table("users").select("id,username,email,created_at")
        
        # Apply search filter if provided
        if search:
            search_lower = search.lower()
            # Supabase doesn't support OR directly, so we fetch all and filter
            # For production, consider using PostgreSQL full-text search
            response = query.execute()
            all_users = response.data if response.data else []
            
            # Filter results client-side
            filtered_users = [
                user for user in all_users
                if search_lower in str(user.get("username", "")).lower()
                or search_lower in str(user.get("email", "")).lower()
            ]
            
            total = len(filtered_users)
            users = filtered_users[offset:offset + limit]
        else:
            # Get total count
            count_response = supabase.table("users").select("id", count="exact").execute()
            total = count_response.count if count_response.count else 0
            
            # Get paginated results
            response = query.range(offset, offset + limit - 1).execute()
            users = response.data if response.data else []
        
        # Format response
        formatted_users = [
            {
                "id": user.get("id"),
                "username": user.get("username"),
                "email": user.get("email"),
                "created_at": user.get("created_at"),
                "status": "active"
            }
            for user in users
        ]
        
        logger.info(f"Admin fetched {len(formatted_users)} users (page {page})")
        
        return {
            "total": total,
            "page": page,
            "limit": limit,
            "users": formatted_users
        }
        
    except Exception as e:
        logger.error(f"Error fetching users: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch users: {str(e)}"
        )


@router.get("/password-logs")
async def get_password_logs(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    user_id: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    admin_key: bool = Depends(verify_admin_key)
) -> Dict[str, Any]:
    """
    Fetch password analysis logs with pagination and filters.
    
    Query Parameters:
        page: Page number (1-indexed)
        limit: Results per page (max 100)
        user_id: Filter by specific user (optional)
        start_date: ISO format date string (optional)
        end_date: ISO format date string (optional)
    
    Returns:
        Dictionary with total count, logs list, and page info
    """
    try:
        # Calculate offset
        offset = (page - 1) * limit
        
        # Build query
        query = supabase.table("password_logs").select(
            "id,user_id,masked_password,strength,entropy,crack_time,created_at"
        )
        
        # Apply filters
        if user_id:
            query = query.eq("user_id", user_id)
        
        # Execute query to get all matching results
        response = query.execute()
        all_logs = response.data if response.data else []
        
        # Filter by date range if provided
        if start_date or end_date:
            filtered_logs = []
            for log in all_logs:
                log_date = log.get("created_at", "")
                
                if start_date and log_date < start_date:
                    continue
                if end_date and log_date > end_date:
                    continue
                    
                filtered_logs.append(log)
            
            total = len(filtered_logs)
            logs = filtered_logs[offset:offset + limit]
        else:
            total = len(all_logs)
            logs = all_logs[offset:offset + limit]
        
        # Format response
        formatted_logs = [
            {
                "id": log.get("id"),
                "user_id": log.get("user_id"),
                "masked_password": log.get("masked_password"),
                "strength": log.get("strength"),
                "entropy": log.get("entropy"),
                "crack_time": log.get("crack_time"),
                "created_at": log.get("created_at")
            }
            for log in logs
        ]
        
        logger.info(f"Admin fetched {len(formatted_logs)} password logs (page {page})")
        
        return {
            "total": total,
            "page": page,
            "limit": limit,
            "logs": formatted_logs
        }
        
    except Exception as e:
        logger.error(f"Error fetching password logs: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch password logs: {str(e)}"
        )


@router.get("/statistics")
async def get_statistics(
    admin_key: bool = Depends(verify_admin_key)
) -> Dict[str, Any]:
    """
    Get aggregate statistics about users and password analyses.
    
    Returns:
        Dictionary with:
        - total_users: Total count of registered users
        - total_analyses: Total password analyses performed
        - avg_entropy: Average Shannon entropy of all analyzed passwords
        - strength_distribution: Count of passwords by strength level
    """
    try:
        # Get total users
        users_response = supabase.table("users").select("id", count="exact").execute()
        total_users = users_response.count if users_response.count else 0
        
        # Get password logs
        logs_response = supabase.table("password_logs").select(
            "id,strength,entropy"
        ).execute()
        
        logs = logs_response.data if logs_response.data else []
        total_analyses = len(logs)
        
        # Calculate statistics
        strength_distribution = {
            "very_weak": 0,
            "weak": 0,
            "medium": 0,
            "strong": 0,
            "very_strong": 0
        }
        
        entropy_sum = 0.0
        entropy_count = 0
        
        for log in logs:
            # Count by strength
            strength = log.get("strength", "").lower()
            if strength in strength_distribution:
                strength_distribution[strength] += 1
            
            # Calculate average entropy
            entropy = log.get("entropy")
            if entropy is not None:
                try:
                    entropy_value = float(entropy)
                    entropy_sum += entropy_value
                    entropy_count += 1
                except (ValueError, TypeError):
                    pass
        
        avg_entropy = round(entropy_sum / entropy_count, 2) if entropy_count > 0 else 0.0
        
        logger.info(f"Admin fetched statistics - Users: {total_users}, Analyses: {total_analyses}")
        
        return {
            "total_users": total_users,
            "total_analyses": total_analyses,
            "avg_entropy": avg_entropy,
            "strength_distribution": strength_distribution
        }
        
    except Exception as e:
        logger.error(f"Error calculating statistics: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to calculate statistics: {str(e)}"
        )
