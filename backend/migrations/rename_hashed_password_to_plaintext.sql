-- Migration: Rename hashed_password to password (update to plaintext storage)
-- Execute this SQL in your Supabase SQL Editor
-- https://app.supabase.com -> Your Project -> SQL Editor
-- ============================================================

-- Step 1: Check if hashed_password column exists
-- If it exists, rename it to password
ALTER TABLE users 
RENAME COLUMN hashed_password TO password;

-- Note: If you want to keep the old hashed passwords intact for existing users,
-- you can skip the above and instead add a new column:
-- ALTER TABLE users ADD COLUMN password TEXT;
-- Then manually migrate data and drop hashed_password column when ready.

-- This migration assumes you want to:
-- 1. Rename the column from hashed_password to password
-- 2. All NEW registrations will store passwords in plaintext format
-- 3. Existing hashed passwords will remain unchanged unless manually updated

-- ============================================================
-- Migration: For existing users with hashed passwords
-- If you want to also convert existing hashed passwords to plaintext,
-- you would need to:
-- 1. Export all user data
-- 2. Decrypt/regenerate plaintext passwords (if possible)
-- 3. Update the database with plaintext passwords
--
-- WARNING: This is a security consideration. Storing plaintext passwords
-- is less secure than hashed passwords. Ensure you have proper security
-- measures in place for the plaintext password storage.
-- ============================================================
