from fastapi import APIRouter, Query
from app.db.supabase_client import supabase
import json
import os

router = APIRouter(prefix="/api", tags=["history"])


@router.get("/user-history")
async def get_user_history(username: str = Query(...)):
    """
    Get password checking history for a user.
    
    Returns masked passwords only - never exposes raw passwords.
    Tries Supabase first, then falls back to JSON file storage.
    
    Args:
        username: The username to fetch history for
        
    Returns:
        {
            "username": "...",
            "history": [
                {
                    "id": int,
                    "masked_password": "Pa****23",
                    "strength": "strong",
                    "entropy": 72.5,
                    "crack_time": "years",
                    "created_at": "2024-01-15T10:30:00"
                }
            ]
        }
    """
    # Try Supabase first
    try:
        response = (
            supabase
            .table("password_logs")
            .select("id, masked_password, strength, entropy, crack_time, created_at")
            .eq("user_id", username)
            .order("created_at", desc=True)
            .execute()
        )
        
        if response.data:
            print(f"✓ Password history retrieved for {username}: {len(response.data)} records")
            print(f"📊 First record sample: {response.data[0] if response.data else 'N/A'}")
            return {
                "username": username,
                "history": response.data,
                "source": "supabase"
            }
    except Exception as e:
        # Log error and continue to JSON fallback
        print(f"⚠️  Supabase query failed, trying JSON fallback: {e}")
    
    # Fallback: Try JSON file storage
    try:
        json_file = "data/password_history.json"
        
        if os.path.exists(json_file):
            with open(json_file, 'r') as f:
                history = json.load(f)
            
            if username in history:
                # Sort by created_at descending
                user_history = sorted(
                    history[username],
                    key=lambda x: x.get('created_at', ''),
                    reverse=True
                )
                return {
                    "username": username,
                    "history": user_history,
                    "source": "json"
                }
        
        # No history found
        return {
            "username": username,
            "history": [],
            "source": "none"
        }
        
    except Exception as e:
        return {
            "username": username,
            "error": "Failed to fetch history",
            "details": str(e)
        }


@router.get("/history")
async def get_history(username: str = Query(...)):
    """
    Deprecated: Use /api/user-history instead.
    Kept for backward compatibility.
    """
    return await get_user_history(username)
