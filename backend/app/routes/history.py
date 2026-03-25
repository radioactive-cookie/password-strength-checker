from fastapi import APIRouter, Query
from app.db.supabase_client import supabase

router = APIRouter(prefix="/api", tags=["history"])


@router.get("/history")
async def get_history(username: str = Query(...)):
    try:
        response = (
            supabase
            .table("password_logs")
            .select("*")
            .eq("username", username)
            .order("created_at", desc=True)
            .execute()
        )

        return {
            "username": username,
            "history": response.data or []
        }

    except Exception as e:
        return {
            "error": "Failed to fetch history",
            "details": str(e)
        }
