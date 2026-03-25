-- Migration: Add masked_password column to password_logs table
-- Date: 2026-03-25
-- Purpose: Store masked passwords for display in user history
-- 
-- INSTRUCTIONS:
-- 1. Go to Supabase Dashboard: https://app.supabase.com
-- 2. Select your project
-- 3. Go to SQL Editor (left sidebar)
-- 4. Create a new query
-- 5. Copy and paste the SQL below
-- 6. Click "Run" button
-- ============================================================

-- Add masked_password column if it doesn't exist
ALTER TABLE password_logs
ADD COLUMN IF NOT EXISTS masked_password TEXT;

-- Verify the column was added
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name='password_logs' AND column_name='masked_password';
