"""
Database initialization script for Supabase.

This module initializes the database schema with required tables.
Run this once to set up the database.
"""

import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def init_database():
    """
    Initialize Supabase database with required tables.
    """
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Missing SUPABASE_URL or SUPABASE_KEY")
    
    # Initialize Supabase client
    client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # SQL to create tables
    create_tables_sql = """
    -- Create users table
    CREATE TABLE IF NOT EXISTS users (
        id BIGSERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        hashed_password TEXT NOT NULL,
        email TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Create index on username for faster lookups
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

    -- Create password_logs table for history
    CREATE TABLE IF NOT EXISTS password_logs (
        id BIGSERIAL PRIMARY KEY,
        user_id TEXT NOT NULL,
        strength TEXT NOT NULL,
        entropy FLOAT NOT NULL,
        crack_time TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Create index on user_id for faster lookups
    CREATE INDEX IF NOT EXISTS idx_password_logs_user_id ON password_logs(user_id);
    
    -- Create index on created_at for sorting
    CREATE INDEX IF NOT EXISTS idx_password_logs_created_at ON password_logs(created_at DESC);
    """
    
    try:
        # Execute SQL via Supabase RPC (requires function in Supabase)
        # For now, we'll use a different approach - try to query the tables
        # If they don't exist, we'll get an error and the user needs to create them manually
        
        print("Checking if tables exist...")
        
        # Try to query users table
        try:
            users_result = client.table("users").select("*").limit(1).execute()
            print("✓ users table exists")
        except Exception as e:
            print(f"✗ users table doesn't exist: {e}")
            return False
        
        # Try to query password_logs table
        try:
            logs_result = client.table("password_logs").select("*").limit(1).execute()
            print("✓ password_logs table exists")
        except Exception as e:
            print(f"✗ password_logs table doesn't exist: {e}")
            return False
        
        print("\n✅ All required tables exist!")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\n" + "="*60)
        print("MANUAL SETUP REQUIRED")
        print("="*60)
        print("\nPlease execute the following SQL in your Supabase SQL Editor:")
        print(create_tables_sql)
        return False


if __name__ == "__main__":
    print("Initializing Supabase database...")
    print("="*60)
    success = init_database()
    print("="*60)
    if success:
        print("\n✅ Database is ready!")
    else:
        print("\n⚠️  Please create the tables manually using the SQL provided above.")
