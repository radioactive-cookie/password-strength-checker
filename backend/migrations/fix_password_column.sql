-- Fix: Add or rename password column in users table
-- Execute this in Supabase SQL Editor if the previous migration didn't work

-- Option 1: If hashed_password column exists, rename it to password
-- Uncomment this if you have hashed_password column:
-- ALTER TABLE users RENAME COLUMN hashed_password TO password;

-- Option 2: If neither column exists, add password column
-- Uncomment this if you need to add the column:
ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;

-- Option 3: If you have hashed_password and want to keep it but also add password
-- First, copy data from hashed_password to password (if both exist)
-- UPDATE users SET password = hashed_password WHERE password IS NULL;

-- Verify the column exists
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users';
