-- ============================================================
-- Password Strength Checker Database Schema
-- Execute this SQL in your Supabase SQL Editor
-- https://app.supabase.com -> Your Project -> SQL Editor
-- ============================================================

-- Create users table (if not exists)
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Migration: Rename hashed_password to password if column exists
-- ALTER TABLE users RENAME COLUMN hashed_password TO password;

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Create password_logs table for storing password analysis history
CREATE TABLE IF NOT EXISTS password_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    masked_password TEXT,
    strength TEXT NOT NULL,
    entropy FLOAT NOT NULL,
    crack_time TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_password_logs_user_id ON password_logs(user_id);

-- Create index on created_at for sorting by date
CREATE INDEX IF NOT EXISTS idx_password_logs_created_at ON password_logs(created_at DESC);

-- Create OTP storage table for email verification
CREATE TABLE IF NOT EXISTS email_otps (
    id BIGSERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    otp_code TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on username for OTP lookups
CREATE INDEX IF NOT EXISTS idx_email_otps_username ON email_otps(username);

-- ============================================================
-- Optional: Enable Row Level Security (RLS)
-- Uncomment if you want to restrict user access to their own data
-- ============================================================

-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE password_logs ENABLE ROW LEVEL SECURITY;

-- -- Policy for users table (allow users to see own data)
-- CREATE POLICY "Users can view own data" ON users
--   FOR SELECT USING (auth.uid() = id::text);

-- -- Policy for password_logs table (allow users to see own logs)
-- CREATE POLICY "Users can view own password logs" ON password_logs
--   FOR SELECT USING (auth.uid() = user_id);
