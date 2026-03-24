"""
Supabase database client initialization.

IMPORTANT: This backend server MUST use the service_role secret key (sb_secret_*).

The service role key:
    - Bypasses Row Level Security (RLS) policies
    - Has full access to all tables and data
    - Should ONLY be used on server-side (never expose to frontend)
    - Is required for backend operations like storing password history

The anon/public key (sb_publishable_*) is for frontend-only and cannot access
backend operations protected by RLS.

Environment variables required:
    - SUPABASE_URL: The Supabase project URL (https://xxxxx.supabase.co)
    - SUPABASE_KEY: The Supabase service_role key (MUST start with sb_secret_)

Example:
    SUPABASE_URL=https://zrvafblufscqbqbjoxqy.supabase.co
    SUPABASE_KEY=sb_secret_abcdef123456...

Getting the service_role key:
    1. Go to Supabase Console: https://app.supabase.com
    2. Select your project
    3. Settings → API → "service_role secret"
    4. Copy the entire key (it's long)

Note:
    In production, use environment variables to store sensitive credentials.
    Never commit .env to version control.
"""

import os
import sys
import json
import base64
from pathlib import Path
from supabase import create_client, Client
from dotenv import load_dotenv

# Step 1: Load environment variables from .env file (local development)
# Path resolution: backend/app/db/supabase_client.py → backend/.env
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
print(f"[Supabase Init] Loading .env from: {env_path}")
load_dotenv(dotenv_path=env_path, override=False)

# Step 2: Get Supabase credentials from environment
# System env vars take precedence over .env file values (important for deployment)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Step 2a: Debug logging (helpful for troubleshooting)
print(f"[Supabase Init] SUPABASE_URL loaded: {'✅ YES' if SUPABASE_URL else '❌ NOT SET'}")
if SUPABASE_KEY:
    key_type = "SERVICE ROLE" if SUPABASE_KEY.startswith("sb_secret_") else "ANON/PUBLIC (⚠️  WRONG!)"
    print(f"[Supabase Init] SUPABASE_KEY loaded: ✅ YES (type: {key_type}, length: {len(SUPABASE_KEY)})")
else:
    print(f"[Supabase Init] SUPABASE_KEY loaded: ❌ NOT SET")

# Step 2b: Validate credentials are set
if not SUPABASE_URL or not SUPABASE_KEY:
    error_msg = (
        "Missing Supabase environment variables. "
        f"SUPABASE_URL: {'SET' if SUPABASE_URL else 'NOT SET'}, "
        f"SUPABASE_KEY: {'SET' if SUPABASE_KEY else 'NOT SET'}. "
        "Please set these in .env file or environment variables."
    )
    print(f"[Supabase Init] ❌ ERROR: {error_msg}")
    raise RuntimeError(error_msg)

# Step 2c: ENFORCE SERVICE ROLE KEY for backend server
# Accept either: keys starting with "sb_secret_" OR JWT tokens with role="service_role"
is_service_role_jwt = False

# Try to decode JWT if it looks like a JWT (has 3 parts separated by dots)
if "." in SUPABASE_KEY:
    try:
        parts = SUPABASE_KEY.split(".")
        if len(parts) == 3:
            # Decode the payload (second part)
            payload = parts[1]
            # Add padding if needed for base64 decoding
            padding = 4 - (len(payload) % 4)
            if padding != 4:
                payload += "=" * padding
            decoded = base64.urlsafe_b64decode(payload)
            payload_json = json.loads(decoded)
            print(f"[Supabase Init] JWT payload decoded: role='{payload_json.get('role')}'")
            if payload_json.get("role") == "service_role":
                is_service_role_jwt = True
                print(f"[Supabase Init] ✅ JWT token with service_role detected")
    except Exception as e:
        # If JWT decoding fails, continue with other checks
        print(f"[Supabase Init] JWT decoding attempt failed ({type(e).__name__}: {str(e)}), checking for sb_secret_ prefix...")

if not (SUPABASE_KEY.startswith("sb_secret_") or is_service_role_jwt):
    error_msg = (
        f"Invalid Supabase key for backend server. "
        f"Backend MUST use service_role secret key (starts with 'sb_secret_' OR is a JWT with role=service_role), "
        f"but got: {SUPABASE_KEY[:30]}... "
        f"\n\nWhy? The anon/public key cannot perform backend operations like storing password history. "
        f"\n\nFix: "
        f"\n1. Go to Supabase Console → Settings → API → 'service_role secret' "
        f"\n2. Copy the full key (starts with 'sb_secret_' or is a JWT token) "
        f"\n3. Update SUPABASE_KEY in .env with the service role key"
    )
    print(f"[Supabase Init] ❌ CRITICAL ERROR: {error_msg}")
    raise RuntimeError(error_msg)
else:
    print(f"[Supabase Init] ✅ Valid service role key detected")

# Step 3: Initialize Supabase client (global, initialized once)
_supabase_client: Client = None
_initialization_error: Exception = None

def get_supabase() -> Client:
    """
    Get or initialize the Supabase client.
    
    Lazy initialization allows the app to start even if Supabase keys are invalid,
    but endpoints will fail with a clear error message.
    
    Returns:
        Client: Initialized Supabase client
        
    Raises:
        RuntimeError: If Supabase credentials are missing or invalid
    """
    global _supabase_client, _initialization_error
    
    # If we already tried and failed, raise the saved error
    if _initialization_error is not None:
        raise _initialization_error
    
    # If already initialized, return cached client
    if _supabase_client is not None:
        return _supabase_client
    
    # Step 3a: Validate credentials before creating client
    if not SUPABASE_URL or not SUPABASE_KEY:
        error = RuntimeError(
            f"Cannot initialize Supabase: Missing credentials. "
            f"SUPABASE_URL={'SET' if SUPABASE_URL else 'NOT SET'}, "
            f"SUPABASE_KEY={'SET' if SUPABASE_KEY else 'NOT SET'}"
        )
        _initialization_error = error
        raise error
    
    # Step 3b: ENFORCE SERVICE ROLE KEY (backend requirement)
    # Accept either: keys starting with "sb_secret_" OR JWT tokens with role="service_role"
    is_service_role_jwt = False
    
    # Try to decode JWT if it looks like a JWT (has 3 parts separated by dots)
    if "." in SUPABASE_KEY:
        try:
            parts = SUPABASE_KEY.split(".")
            if len(parts) == 3:
                # Decode the payload (second part)
                payload = parts[1]
                # Add padding if needed for base64 decoding
                padding = 4 - (len(payload) % 4)
                if padding != 4:
                    payload += "=" * padding
                decoded = base64.urlsafe_b64decode(payload)
                payload_json = json.loads(decoded)
                if payload_json.get("role") == "service_role":
                    is_service_role_jwt = True
        except (ValueError, KeyError, json.JSONDecodeError, TypeError):
            # If JWT decoding fails, continue with other checks
            pass
    
    if not (SUPABASE_KEY.startswith("sb_secret_") or is_service_role_jwt):
        error = RuntimeError(
            f"Invalid Supabase key for backend. Backend MUST use service_role secret key (sb_secret_* or JWT with role=service_role). "
            f"Got: {SUPABASE_KEY[:30]}... "
            f"\n\nThe anon public key (sb_publishable_) cannot perform backend operations. "
            f"\n\nFix: Update SUPABASE_KEY in .env to use the service_role secret (sb_secret_) from "
            f"Supabase Console → Settings → API → 'service_role secret'"
        )
        _initialization_error = error
        raise error
    
    # Step 3c: Create client with error handling
    try:
        print(f"[Supabase Init] Creating Supabase client with service_role key...")
        _supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print(f"[Supabase Init] ✅ SUCCESS: Supabase client initialized with service_role")
        return _supabase_client
    except Exception as e:
        error = RuntimeError(
            f"Failed to initialize Supabase client: {type(e).__name__}: {str(e)}. "
            f"Verify SUPABASE_URL and SUPABASE_KEY are correct (using service_role secret) in .env"
        )
        _initialization_error = error
        print(f"[Supabase Init] ❌ FAILED: {error}")
        raise error


# For backward compatibility, create a lazy proxy
class SupabaseProxy:

    def __getattr__(self, name):
        return getattr(get_supabase(), name)
    
    def table(self, name):
        return get_supabase().table(name)
    
    def auth(self):
        return get_supabase().auth

supabase = SupabaseProxy()


"""
REQUIRED SUPABASE TABLE SCHEMA:

Execute the following SQL in Supabase SQL Editor to create the users table:

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    email TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Enable Row Level Security (RLS) - optional but recommended
ALTER TABLE users ENABLE ROW LEVEL SECURITY;


REQUIRED: Password History Table

CREATE TABLE IF NOT EXISTS password_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    strength TEXT NOT NULL,
    entropy FLOAT NOT NULL,
    crack_time TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on user_id for faster lookups of user history
CREATE INDEX IF NOT EXISTS idx_password_logs_user_id ON password_logs(user_id);

-- Create an index on created_at for ordering by date
CREATE INDEX IF NOT EXISTS idx_password_logs_created_at ON password_logs(created_at DESC);

-- Optional: Enable RLS for added security
ALTER TABLE password_logs ENABLE ROW LEVEL SECURITY;
"""
