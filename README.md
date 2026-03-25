# 🔐 password_checker

A robust, security-focused web application that helps you understand password strength through advanced analysis, breach detection, and entropy calculations.

Instead of just "weak" or "strong", the app explains **why** a password is secure or insecure using multiple security metrics.

---

## 🚀 Features

✅ Real-Time Password Strength Analysis  
✅ Strong Password Generator  
✅ Password Breach Detection (Have I Been Pwned API)  
✅ Entropy Calculation  
✅ Crack-Time Estimation  
✅ Safe Password History with Masked Passwords  
✅ Email Verification (OTP-Based)  
✅ User Authentication & Dashboard  

---

## 🛠 Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React, Vite, TypeScript, TailwindCSS, Framer Motion |
| **Backend** | Python, FastAPI, Uvicorn, Pydantic |
| **Database** | Supabase (PostgreSQL) |
| **Security** | bcrypt, HIBP API, JWT tokens |

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[SETUP.md](SETUP.md)** | Installation, Supabase config, email setup, troubleshooting |
| **[SECURITY.md](SECURITY.md)** | Architecture, security practices, password storage |

---

## ⚡ Quick Start

### Prerequisites
- Python 3.10+
- Node.js 16+
- Supabase account (free tier available)

### Installation

```bash
# 1. Clone & setup
git clone <repository-url>
cd Password_Strength_Checker
python -m venv .venv
.venv\Scripts\Activate  # Windows
# source .venv/bin/activate  # Mac/Linux

# 2. Backend
cd backend
pip install -r requirements.txt
# Create .env with Supabase credentials (see SETUP.md)
python -m uvicorn app.main:app --reload

# 3. Frontend (new terminal)
cd frontend
npm install
npm run dev
```

**Frontend:** http://localhost:5173  
**Backend:** http://localhost:8000  
**API Docs:** http://localhost:8000/docs

---

## 🔗 API Endpoints

**Check Password Strength**
```http
POST /api/check-password
{
  "password": "MyP@ssw0rd123!",
  "username": "optional_username"
}
```

**Get Password History**
```http
GET /api/user-history?username=john_doe
```

**User Registration**
```http
POST /auth/register
{
  "username": "john_doe",
  "password": "SecurePass123!",
  "email": "john@example.com"
}
```

**User Login**
```http
POST /auth/login
{
  "username": "john_doe",
  "password": "SecurePass123!"
}
```

---

## 🔐 Security Highlights

✅ **No Plaintext Passwords** - bcrypt hashing with 12 rounds  
✅ **Breach Detection** - k-anonymity protected Have I Been Pwned checks  
✅ **Input Validation** - Pydantic schemas prevent injection attacks  
✅ **Masked History** - Password history shows only first/last 2 characters  
✅ **Email Verification** - OTP-based account verification  

---

## 📂 Project Structure

```
frontend/
├── src/app/pages/       # Dashboard, Login, Register pages
├── src/app/components/  # Password checker, strength bar, etc.
└── src/app/services/    # API client (api.ts)

backend/
├── app/routes/          # API endpoints (auth, history, password)
├── app/services/        # Password checking, OTP handling
├── app/utils/           # Hashing, email, entropy, breach detection
└── schema.sql           # Database setup
```

---

## 🧪 Testing

```bash
cd backend
pytest test_strength.py      # Password strength tests
pytest test_auth.py          # Authentication tests

# Manual API test
curl -X POST http://localhost:8000/api/check-password \
  -H "Content-Type: application/json" \
  -d '{"password": "Test1234!"}'
```

---

## ❓ Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| Dashboard blank | Hard refresh: Ctrl+Shift+R |
| History not saving | Check `masked_password` column exists in Supabase |
| Backend won't start | Check Python 3.10+: `python --version` |
| Invalid API key | Use Service Role Key, NOT Anon key in `.env` |
| Password history errors | Verify Supabase URL and key in `.env` |

See **SETUP.md** for detailed troubleshooting.

---

## 📄 License

MIT License - See LICENSE file for details
