# API Connection Fix - Troubleshooting & Setup Guide

## Problem Summary

The frontend was showing "API Error: Failed to fetch" when users clicked the "Check Strength" button or typed passwords. This is typically caused by:

- Backend not running
- Incorrect API URL configuration
- CORS not properly configured
- Frontend/Backend port mismatch

---

## What Was Fixed

### Frontend Changes

1. **Added Error State Management**
   - New `error` state to track and display API errors
   - Error messages shown in red banner to user

2. **Enhanced API Error Handling** (`frontend/src/app/services/api.ts`)
   - Added try/catch for `TypeError: Failed to fetch`
   - Provides detailed error message about backend connection
   - Logs API calls for debugging
   - Shows full URL in error message

3. **Fixed "Check Strength" Button** (`frontend/src/app/components/PasswordChecker.jsx`)
   - Previously had empty `onClick={() => {}}`
   - Now calls `manualCheckPassword()` function
   - Button shows "Analyzing..." when loading
   - Immediate API call on button click (no debounce)

4. **Improved Password Checking** 
   - Added `manualCheckPassword()` function for manual checks
   - Debounced automatic checks (500ms) via `useEffect`
   - Both manual and automatic checks share error handling

5. **Error Display UI**
   - Red error banner with icon and message
   - Displays specific error details (helpful for debugging)
   - Clears automatically when new API call succeeds

### Backend Changes

1. **Enhanced Startup Logging** (`backend/app/main.py`)
   - Shows exact server address (http://127.0.0.1:8000)
   - Lists all available endpoints
   - Displays all CORS-enabled origins
   - Better troubleshooting information

2. **Expanded CORS Configuration** (`backend/app/config.py`)
   - Added both `localhost` and `127.0.0.1` variations
   - Covers ports 3000, 5173 (Vite), 8000, 8080
   - Flexible for different network configurations

---

## Setup Instructions

### 1. Start the Backend

```bash
# Navigate to project root
cd "e:\KIIT_2430110\SELF DEV\Password_Strength_Checker"

# Activate virtual environment
.venv\Scripts\Activate

# Start FastAPI server
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

**Expected Output:**
```
==================================================================================
✓ Password Strength Checker API started successfully
==================================================================================
📍 Server running at: http://127.0.0.1:8000
📍 API Docs at: http://127.0.0.1:8000/docs
✓ CORS Enabled for Origins:
   - http://localhost:3000
   - http://localhost:5173
   - http://localhost:8000
   - http://localhost:8080
   - http://127.0.0.1:3000
   - http://127.0.0.1:5173
   - http://127.0.0.1:8000
   - http://127.0.0.1:8080
✓ Available endpoints:
   - POST /api/check-password (password strength analysis)
   - GET /api/health (health check)
==================================================================================
```

### 2. Start the Frontend

```bash
# In a new terminal
cd "e:\KIIT_2430110\SELF DEV\Password_Strength_Checker\frontend"

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### 3. Open in Browser

- Frontend: http://localhost:5173
- Backend API Docs: http://127.0.0.1:8000/docs

---

## Testing the Fix

### Test 1: Manual Check via Button
1. Open http://localhost:5173
2. Enter a password (e.g., "MyPassword123!")
3. Click "Check Strength" button
4. Results should appear WITHOUT any API error

### Test 2: Automatic Debounced Check
1. Type a password slowly in the input field
2. Wait 500ms after typing stops
3. Results should appear automatically

### Test 3: Error Handling
1. Stop the backend server
2. Try to check a password
3. You should see red error banner saying:
   ```
   Unable to connect to the password analysis server at 
   http://localhost:8000. Please ensure the backend is running.
   ```
4. Start the backend again
5. Try checking again - should work

### Test 4: Common Breach Detection
1. Check password "password123"
2. Should show red warning: "Password found in 2,254,650 breaches"

### Test 5: Safe Password
1. Check password "X9kL2mP5qR8vW1nT$uY3nO6aB"
2. Should show green message: "No breach records found"

---

## Debugging Tips

### 1. Check Backend is Running
```bash
curl http://127.0.0.1:8000/docs
```
Should return HTML (API documentation page).

### 2. Test API Endpoint Directly
```bash
# PowerShell
$body = @{password="TestPassword123"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/check-password" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

### 3. Check Browser Console
- Press F12 to open Developer Tools
- Go to Console tab
- Look for API call logs like:
  ```
  [API] POST request to: http://localhost:8000/api/check-password
  [PasswordChecker] Checking password via API...
  [API] Response success: {password: "...", score: 3, ...}
  ```

### 4. Check Network Tab
- Press F12, go to Network tab
- Click "Check Strength" or type password
- Look for request to `check-password`
- Should see Status 200 (success)

### 5. Common Issues & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Failed to fetch` | Backend not running | Start backend server |
| `CORS error` | Origins mismatch | Ensure port 5173 is in CORS list |
| `404 Not Found` | Wrong endpoint | Should be `/api/check-password` |
| `Cannot POST` | CORS preflight failed | Check backend CORS headers |
| Timeout | Backend too slow | Check password analyzer performance |

### 6. Verify Frontend URL
In browser console, run:
```javascript
const API_BASE_URL = "http://localhost:8000";
console.log("API Base URL:", API_BASE_URL);
console.log("Full endpoint:", API_BASE_URL + "/api/check-password");
```

---

## API Response Example

### Request
```json
POST http://localhost:8000/api/check-password
{
  "password": "MyStr0ng!Password"
}
```

### Response (Success - 200)
```json
{
  "password": "MyStr0ng!Password",
  "score": 4,
  "strength": "Very Strong",
  "entropy": 98.5,
  "suggestions": [],
  "estimated_crack_time": "centuries",
  "breach_count": 0
}
```

### Response (Error - 400/500)
```json
{
  "detail": "Password cannot be empty"
}
```

---

## Files Modified

### Frontend
- ✅ `frontend/src/app/services/api.ts` - Enhanced error handling & logging
- ✅ `frontend/src/app/components/PasswordChecker.jsx` - Added error state & fixed button

### Backend
- ✅ `backend/app/main.py` - Enhanced startup logging
- ✅ `backend/app/config.py` - Expanded CORS configuration

---

## Environment Variables (Optional)

You can set custom backend URL via environment variable:

```bash
# .env or .env.local in frontend folder
VITE_API_URL=http://127.0.0.1:8000
```

If not set, defaults to `http://localhost:8000`.

---

## Performance Notes

- Password checking happens automatically after 500ms of typing (debounce)
- Manual "Check Strength" button provides immediate check
- Breach checking is non-blocking (app works even if HIBP API is slow)
- Hash-based breach checking uses k-anonymity (safe & private)

---

## Next Steps

1. ✅ Start backend server
2. ✅ Start frontend dev server
3. ✅ Open http://localhost:5173
4. ✅ Test password checking
5. ✅ Verify error messages appear when backend is offline
6. ✅ Confirm green/red breach status displays correctly

---

## Support

If you still see errors:

1. **Check backend is running**: `http://127.0.0.1:8000/docs` should work
2. **Check browser console**: F12 → Console tab for API logs
3. **Check Network tab**: F12 → Network tab for HTTP requests
4. **Look for error messages**: Red banner will show specific issue

The error messages now include the exact backend URL and connection details to help with troubleshooting.
