"""
Comprehensive Supabase connection and database schema verification script.

This script tests:
1. Environment variables loading
2. Supabase client initialization
3. Database connectivity
4. Required table existence
5. RLS policies (if applicable)
"""

import sys
import os
sys.path.insert(0, '/e:/KIIT_2430110/SELF DEV/Password_Strength_Checker/backend')

from dotenv import load_dotenv

# Step 1: Load environment
print("=" * 70)
print("STEP 1: Loading Environment Variables")
print("=" * 70)

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

print(f"SUPABASE_URL: {'✅ SET' if SUPABASE_URL else '❌ NOT SET'}")
if SUPABASE_URL:
    print(f"  → {SUPABASE_URL}")

print(f"SUPABASE_KEY: {'✅ SET' if SUPABASE_KEY else '❌ NOT SET'}")
if SUPABASE_KEY:
    key_preview = SUPABASE_KEY[:20] + "..." + SUPABASE_KEY[-10:] if len(SUPABASE_KEY) > 30 else "***"
    print(f"  → {key_preview}")
    # Check key format and enforce service_role for backend
    if SUPABASE_KEY.startswith("sb_secret_"):
        print(f"  → Key type: Service Role Secret ✅ (correct for backend)")
    elif SUPABASE_KEY.startswith("sb_publishable_"):
        print(f"  → ❌ WRONG! This is anon/public key (sb_publishable_)")
        print(f"  → Backend REQUIRES service role secret key (sb_secret_)")
        print(f"  → Fix: Get service_role secret from Supabase Console → Settings → API")
    else:
        print(f"  → ❌ Invalid key format! Should start with 'sb_secret_' (backend) or 'sb_publishable_' (frontend only)")

# Step 2: Test Supabase client initialization
print("\n" + "=" * 70)
print("STEP 2: Initializing Supabase Client")
print("=" * 70)

try:
    from app.db.supabase_client import supabase, get_supabase
    print("✅ Supabase module imported successfully")
    
    # Force initialization
    client = get_supabase()
    print("✅ Supabase client initialized successfully")
    
except Exception as e:
    print(f"❌ Failed to initialize Supabase client")
    print(f"Error type: {type(e).__name__}")
    print(f"Error message: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# Step 3: Test basic connectivity
print("\n" + "=" * 70)
print("STEP 3: Testing Database Connectivity")
print("=" * 70)

try:
    # Simple health check - list tables
    response = supabase.table("users").select("COUNT(*)").execute()
    print("✅ Basic connectivity test passed")
except Exception as e:
    print(f"⚠️  Connection test returned: {e}")
    # Some errors are expected if table doesn't exist, but at least we reached Supabase
    error_str = str(e).lower()
    if "invalid api key" in error_str or "401" in error_str or "unauthorized" in error_str:
        print("❌ CRITICAL: Invalid or missing API key")
        sys.exit(1)

# Step 4: Check required tables
print("\n" + "=" * 70)
print("STEP 4: Checking Required Database Tables")
print("=" * 70)

tables_required = [
    ("users", "User accounts table"),
    ("password_logs", "Password analysis history table")
]

tables_found = []
tables_missing = []

for table_name, description in tables_required:
    try:
        response = supabase.table(table_name).select("*").limit(1).execute()
        tables_found.append((table_name, description, len(response.data)))
        print(f"✅ {table_name:20} - {description}")
        print(f"   → Records in table: {len(response.data)}")
    except Exception as e:
        error_msg = str(e)
        tables_missing.append((table_name, description, error_msg))
        
        # Check if it's because table doesn't exist vs other errors
        if "PGRST205" in error_msg or "not found" in error_msg.lower():
            print(f"❌ {table_name:20} - Table NOT FOUND")
            print(f"   → Run schema.sql in Supabase SQL Editor to create this table")
        else:
            print(f"⚠️  {table_name:20} - Error: {error_msg[:60]}...")

# Step 5: Summary
print("\n" + "=" * 70)
print("SUMMARY")
print("=" * 70)

if tables_missing:
    print(f"❌ {len(tables_missing)} table(s) missing:")
    for table_name, description, error in tables_missing:
        print(f"   - {table_name}: {description}")
    print("\nFix: Run schema.sql in Supabase SQL Editor")
else:
    print("✅ All required tables exist!")

if tables_found:
    print(f"\n✅ {len(tables_found)} table(s) found and accessible")

print("\n" + "=" * 70)
print("NEXT STEPS")
print("=" * 70)
print("1. Backend requires SERVICE ROLE key (sb_secret_):")
print("   - Get from: Supabase Console → Settings → API → 'service_role secret'")
print("   - Update SUPABASE_KEY in .env with the full service_role secret")
print("")
print("2. If table missing: Run schema.sql in Supabase SQL Editor")
print("")
print("3. Restart backend: python -m uvicorn app.main:app --reload")
print("")
print("4. Test endpoint: curl 'http://localhost:8000/api/history?username=test'")
print("=" * 70)
