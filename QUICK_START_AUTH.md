# Secure Password Storage - Quick Start Guide

## Get Started in 2 Minutes

### 1️⃣ Install Dependencies (30 seconds)
```bash
cd backend
pip install -r requirements.txt
```

### 2️⃣ Start the Server (10 seconds)
```bash
python -m uvicorn app.main:app --reload
```

**Expected Output:**
```
✓ Password Strength Checker API started successfully
📍 Server running at: http://127.0.0.1:8000
📍 API Docs at: http://127.0.0.1:8000/docs
✓ Available endpoints:
   - POST /auth/register (secure user registration)
   - POST /auth/login (user authentication)
   ...
```

### 3️⃣ Test It (Use one of these methods)

#### Option A: Interactive API Docs (Easiest)
```
Open: http://localhost:8000/docs
```
- Click on `/auth/register`
- Click "Try it out"
- Paste this data:
```json
{
  "username": "testuser",
  "password": "TestPass123!",
  "email": "test@example.com"
}
```
- Click "Execute"
- You should see a 201 response with the new user

#### Option B: Test Script (Automated)
```bash
python test_auth.py
```
Runs 8 tests automatically and shows results.

#### Option C: cURL (Command Line)
**Register:**
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "TestPass123!",
    "email": "test@example.com"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "TestPass123!"
  }'
```

---

## What Was Created

| Component | File | Purpose |
|-----------|------|---------|
| 🔐 Security Utils | `app/utils/security.py` | Password hashing & verification |
| 👤 User Model | `app/models/user.py` | User data & storage |
| 🔑 Auth Routes | `app/routes/auth.py` | Login & registration endpoints |
| 📋 Tests | `test_auth.py` | Comprehensive test suite |
| 📚 Docs | `SECURE_PASSWORD_STORAGE.md` | Full documentation |

---

## Key Features

✅ **Bcrypt Hashing** - Industry-standard, slow-by-design hashing
✅ **No Plain-Text** - Passwords never stored unencrypted  
✅ **Secure Verification** - Timing-attack resistant
✅ **Input Validation** - Prevents injection attacks
✅ **Generic Errors** - Prevents user enumeration

---

## Passwords Are Hashed Like This

```
Raw Password:  "MySecurePassword123!"

Stored Hash:   "$2b$12$R9h7cIPz0gi.URNNGGFH2OPST9/PgBkqquzi.Ss7KIUgO2t0jKMm"
               (different every time - includes unique salt)

During Login:  Raw password is hashed and compared with stored value
               ✓ Match = Login Success
               ✗ No Match = Login Failed
```

---

## API Endpoints

### Register User
```
POST /auth/register
```
**Body:**
```json
{
  "username": "john_doe",
  "password": "SecurePass123!",
  "email": "john@example.com"
}
```
**Response (201):** User created

### Login User
```
POST /auth/login
```
**Body:**
```json
{
  "username": "john_doe",
  "password": "SecurePass123!"
}
```
**Response (200):** Login successful

### Other Endpoints
- `GET /auth/users/count` - Get user count
- `POST /auth/verify-password` - Test password verification

---

## Troubleshooting

**Q: "Cannot connect to http://localhost:8000"**
- Make sure the server is running: `python -m uvicorn app.main:app --reload`

**Q: "ModuleNotFoundError: bcrypt"**
- Reinstall dependencies: `pip install -r requirements.txt`

**Q: Login always fails**
- Make sure user is registered first
- Check that password is typed exactly right (case-sensitive)
- Verify `backend/data/users.json` exists

**Q: Want to use a different port?**
```bash
python -m uvicorn app.main:app --reload --port 8001
```

---

## File Structure

```
backend/
├── app/
│   ├── utils/
│   │   └── security.py                ← Password hashing
│   ├── models/
│   │   └── user.py                    ← User model & storage
│   ├── routes/
│   │   ├── password_routes.py
│   │   └── auth.py                    ← New auth endpoints
│   └── main.py                        ← Updated with auth routes
├── data/
│   └── users.json                     ← Created automatically
├── test_auth.py                       ← Test suite
└── requirements.txt                   ← Updated with bcrypt
```

---

## Next Steps

1. ✅ Register & login users securely
2. 📚 Read [SECURE_PASSWORD_STORAGE.md](./SECURE_PASSWORD_STORAGE.md) for details
3. 🔗 Integrate with your frontend
4. 🗄️ (Optional) Upgrade to SQLite database
5. 🔑 (Optional) Add JWT token authentication

---

## Security Summary

This implementation uses:
- **Bcrypt** with cost factor 12 (recommended for 2024)
- **Unique salt** per password (prevents rainbow tables)
- **Constant-time verification** (prevents timing attacks)
- **Input validation** (prevents injection attacks)
- **Generic error messages** (prevents user enumeration)

No plain-text passwords are stored anywhere. ✓

---

For more details, see: [IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md)
