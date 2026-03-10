# Quick Start Guide - Password Strength Checker

## 🚀 Start the Application

### Step 1: Start the Backend API
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
✓ Password Strength Checker API started successfully
```

Backend runs on: **http://localhost:8000**
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/api/health

### Step 2: Start the Frontend
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

Frontend runs on: **http://localhost:5173**

### Step 3: Open the Application
Visit: **http://localhost:5173** in your browser

---

## ✨ Feature Demo

### Feature 1: Real-Time Password Strength
1. Type a password in the input field
2. Watch the **strength meter bar** update in real-time
3. Bar color changes based on strength:
   - 🔴 Red = Weak
   - 🟡 Yellow = Medium  
   - 🟢 Green = Strong

### Feature 2: Breach Detection
1. Enter "password" or "123456"
2. See the ⚠️ breach warning appear with count
3. Example: "⚠️ This password appeared in 12,394 data breaches"

### Feature 3: Generate Strong Password
1. Click **"⚡ Generate Secure Password"** button
2. Random 16-character password appears in field
3. Strength analysis runs automatically
4. See entropy and crack time instantly

---

## 📊 Response Example

When checking password "MyP@ssw0rd123!":

```json
{
  "password": "MyP@ssw0rd123!",
  "score": 4,
  "strength": "Very Strong",
  "entropy": 83.45,
  "suggestions": [],
  "estimated_crack_time": "centuries",
  "breach_count": 0
}
```

---

## 🔧 API Endpoints

### Check Password Strength
**POST** `/api/check-password`

Request:
```json
{
  "password": "MyPassword123!"
}
```

Response:
```json
{
  "password": "MyPassword123!",
  "score": 3,
  "strength": "Strong",
  "entropy": 71.25,
  "suggestions": ["Consider using special characters"],
  "estimated_crack_time": "days",
  "breach_count": 0
}
```

### Health Check
**GET** `/api/health`

Response:
```json
{
  "status": "healthy",
  "service": "Password Strength Checker API"
}
```

---

## 🧪 Test Cases

### Test 1: Weak Password
Input: `password`
- Score: 0-1 (Very Weak/Weak)
- Breach Count: High (likely in database)
- Crack Time: Seconds

### Test 2: Medium Password
Input: `MyPassword123`
- Score: 2 (Medium)
- Entropy: ~40 bits
- Crack Time: Hours to days

### Test 3: Strong Password
Input: `MyP@ssw0rd123!XyZ`
- Score: 4 (Very Strong)
- Entropy: >80 bits
- Crack Time: Centuries

### Test 4: Generated Password
Click "Generate Secure Password"
- Automatically fills field
- Score: 4 (Very Strong)
- Entropy: >75 bits
- Breach Count: 0 (unique)

---

## 🔐 Security Features Explained

### Password Breach Detection
- Uses **Have I Been Pwned API**
- **K-anonymity model**: Only first 5 characters of SHA-1 hash sent
- Your full password never exposed
- Returns count: "appeared in X breaches"

### Real-Time Analysis
- **Debounced**: Waits 500ms after you stop typing
- **No button needed**: Checks automatically
- **Instant feedback**: Color-coded meter
- **Non-blocking**: All features work even if API fails

### Entropy Calculation  
- Measures randomness of password
- Higher entropy = stronger password
- Formula: Shannon entropy
- Display: Bits (e.g., 83.45 bits)

### Crack Time Estimation
- Based on offline fast hashing attack
- Assumes 1e10 guesses per second
- Ranges: seconds → centuries

---

## 📱 Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

---

## ⚠️ Troubleshooting

### "Cannot connect to API" Error
1. Ensure backend is running: `python -m uvicorn app.main:app --reload`
2. Check backend is on port 8000
3. Verify CORS is configured in `backend/app/config.py`

### Breach Check Fails Silently
1. Check internet connection
2. HIBP API might be rate-limited
3. Check browser console for errors (F12)

### Strength Meter Not Updating
1. Ensure frontend API is imported correctly
2. Check that `api.js` is not empty
3. Verify debounce timer in component

---

## 📝 Files Modified/Created

**Created:**
- `frontend/src/services/api.js` - API service layer
- `IMPLEMENTATION_SUMMARY.md` - Feature documentation
- `QUICK_START.md` - This file

**Updated:**
- `backend/app/schemas/password_schema.py` - Added breach_count example

**Already Implemented:**
- `backend/app/utils/breach_checker.py` - Breach detection
- `backend/app/services/password_checker.py` - Analysis engine
- `frontend/src/app/components/PasswordChecker.jsx` - UI component

---

## 🎯 Next Steps

1. **Start Backend**: Run uvicorn command
2. **Start Frontend**: Run npm run dev
3. **Open Browser**: Visit http://localhost:5173
4. **Test Features**: Try all three features
5. **Check Console**: F12 to debug if needed

---

Happy Password Checking! 🔐
