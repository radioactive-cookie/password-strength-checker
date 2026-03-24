# 🔧 Setup & Configuration Guide

Complete guide for setting up and configuring the Password Strength Checker application.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Supabase Configuration](#supabase-configuration)
4. [Database Setup](#database-setup)
5. [Running the Application](#running-the-application)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Python 3.10+** (for backend)
- **Node.js 16+** (for frontend)
- **Git** 
- **Supabase Account** (free tier available at https://supabase.com)

---

## Environment Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Password_Strength_Checker
```

### 2. Create Python Virtual Environment

```bash
python -m venv .venv
.venv\Scripts\Activate  # Windows
source .venv/bin/activate  # macOS/Linux
```

### 3. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 4. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## Supabase Configuration

### Getting Your API Keys

1. Log in to [Supabase Console](https://app.supabase.com)
2. Select your project
3. Go to **Settings → API**
4. Copy the following values:
   - **Project URL**: `SUPABASE_URL`
   - **Service Role Secret**: `SUPABASE_KEY` (NOT the anon/public key)

### Important: Use Service Role Key, NOT Anon Key

The backend **requires the service role secret key** (`sb_secret_*`), not the anon/public key (`sb_publishable_*`).

- **Service Role Secret**: Backend operations, bypasses Row Level Security
- **Anon/Public Key**: Frontend-only, respects RLS restrictions

### Create `.env` File

Create `backend/.env`:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=sb_secret_your_actual_service_role_key_here

# JWT Secret for FastAPI (generate a random string)
SECRET_KEY=your_random_secret_key_here

# API Configuration
API_VERSION=1.0.0
```

### Generate a Secure Secret Key

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## Database Setup

### Create Password Logs Table

Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS password_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    strength TEXT NOT NULL,
    entropy FLOAT NOT NULL,
    crack_time TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_password_logs_user_id ON password_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_password_logs_created_at ON password_logs(created_at DESC);
```

---

## Running the Application

### Start Backend Server

```bash
cd backend
python -m uvicorn app.main:app --reload
```

Backend runs on: `http://localhost:8000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend runs on: `http://localhost:5173`

### Access the Application

Open your browser and go to: **`http://localhost:5173`**

---

## Troubleshooting

### Issue: "Invalid API Key" Error

**Problem**: Backend shows "Invalid Supabase key for backend server"

**Solutions**:
1. Verify you're using the **service role secret key** (starts with `sb_secret_`)
2. Not the anon/public key (starts with `sb_publishable_`)
3. Check `.env` file has correct values with no extra spaces
4. Restart backend: `python -m uvicorn app.main:app --reload`

### Issue: Password History Not Saving

**Problem**: Password checks work but history isn't stored

**Solutions**:
1. Ensure `password_logs` table exists (run SQL script above)
2. Verify Supabase API key is valid
3. Check backend is running: `curl http://localhost:8000/api/health`
4. Review browser console (F12) for error messages

### Issue: Dashboard Shows Black Screen

**Problem**: Dashboard appears blank or black

**Solutions**:
1. Hard refresh browser: **Ctrl+Shift+R** (Windows) or **Cmd+Shift+R** (macOS)
2. Ensure you're logged in (try homepage first)
3. Check backend is running and responding
4. Open browser console (F12 → Console) and look for error messages

### Issue: "Cannot read property of undefined" React Error

**Problem**: React component throws error

**Solutions**:
1. Hard refresh with cache clear: **Ctrl+Shift+Delete** → Clear browsing data
2. Delete `frontend/node_modules` and reinstall: `npm install`
3. Check backend health: `curl http://localhost:8000/api/health`

### Test Supabase Connection

Run the diagnostic script:

```bash
cd backend
python test_supabase_connection.py
```

This will verify:
- ✅ Environment variables are loaded
- ✅ Supabase client initializes
- ✅ Database tables are accessible

---

## API Endpoints

### Check Password Strength

```
POST /api/check-password
Content-Type: application/json

{
  "password": "MyPassword123!",
  "username": "hello"
}
```

### Get Password History

```
GET /api/history?username=hello
```

### Health Check

```
GET /api/health
```

---

## Features

- ✅ Real-time password strength analysis
- ✅ Password breach detection (Have I Been Pwned)
- ✅ Entropy calculation
- ✅ Crack-time estimation
- ✅ Secure password generator
- ✅ User authentication
- ✅ Password history tracking
- ✅ Responsive dark theme UI

---

## Security Notes

- Passwords are **never stored on your device** or transmitted to third parties
- All analysis runs locally in your browser
- Breach checking uses API with privacy protection
- Backend uses JWT authentication
- Row-level security ensures users only see their own data

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console (F12 → Console tab)
3. Check backend logs in terminal
4. Verify Supabase connection with diagnostic script
