"""
Safe Supabase client (Render-compatible)

• Does NOT crash app if env missing
• Lazy initialization
• Works in production (Render)
"""

import os
from typing import Optional
from supabase import create_client, Client

SUPABASE_URL: Optional[str] = os.getenv("SUPABASE_URL")
SUPABASE_KEY: Optional[str] = os.getenv("SUPABASE_KEY")

_supabase: Optional[Client] = None


def get_supabase() -> Optional[Client]:
    global _supabase

    if _supabase:
        return _supabase

    if not SUPABASE_URL or not SUPABASE_KEY:
        print("⚠️ Supabase env vars missing — app running without DB")
        return None

    try:
        _supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Supabase connected successfully")
        return _supabase
    except Exception as e:
        print(f"❌ Supabase init failed: {e}")
        return None


# Safe proxy (prevents crash)
class SupabaseProxy:
    def __getattr__(self, name):
        client = get_supabase()
        if client:
            return getattr(client, name)
        raise RuntimeError("Supabase not initialized")

    def table(self, name):
        client = get_supabase()
        if client:
            return client.table(name)
        raise RuntimeError("Supabase not initialized")


supabase = SupabaseProxy()
