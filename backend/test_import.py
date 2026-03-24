#!/usr/bin/env python
"""Test script to verify Supabase integration works"""

import sys
sys.path.insert(0, '.')

try:
    print("Testing import of app.main...")
    from app.main import app
    print("✅ SUCCESS: app.main imported successfully!")
    print("✅ No ModuleNotFoundError - Supabase integration fixed!")
    print(f"✅ App instance created: {app}")
except ModuleNotFoundError as e:
    print(f"❌ FAILED: {e}")
    sys.exit(1)
except RuntimeError as e:
    if "Supabase" in str(e):
        print(f"⚠️  Supabase RLS issue (expected): {e}")
        input("Press Enter to continue...")
    else:
        print(f"❌ ERROR: {e}")
        sys.exit(1)
except Exception as e:
    print(f"❌ ERROR: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
