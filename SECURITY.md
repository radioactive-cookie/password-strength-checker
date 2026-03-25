# 🔒 Security & Architecture Guide

Complete security architecture, system design, and password storage implementation details.

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Password Storage & Hashing](#password-storage--hashing)
3. [Security Features](#security-features)
4. [Data Flow](#data-flow)
5. [API Endpoints](#api-endpoints)
6. [Security Best Practices](#security-best-practices)

---

## System Architecture

### High-Level Overview

```
┌─────────────────┐
│    FRONTEND     │ React + TypeScript
│   (localhost:   │ • Real-time analysis
│     5173)       │ • User dashboard
└────────┬────────┘
         │ HTTPS/HTTP
         ▼
┌─────────────────────────────────────────────┐
│          FASTAPI BACKEND SERVER             │
│         (localhost:8000)                    │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │  Authentication Routes (auth.py)    │  │
│  │  • POST /auth/register              │  │
│  │  • POST /auth/login                 │  │
│  │  • POST /auth/verify-password       │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │  Password Analysis (password_routes │  │
│  │  • POST /api/check-password         │  │
│  │  • GET /api/user-history            │  │
│  │  • GET /api/health                  │  │
│  └─────────────────────────────────────┘  │
│                                             │
│  ┌─────────────────────────────────────┐  │
│  │  Services & Utils                   │  │
│  │  • password_checker.py              │  │
│  │  • security.py (hash/verify)        │  │
│  │  • breach_checker.py (HIBP API)    │  │
│  │  • entropy_calculator.py            │  │
│  │  • email.py (OTP delivery)          │  │
│  └─────────────────────────────────────┘  │
│                                             │
└─────────────────┬──────────────────────────┘
                  │
                  ▼
         ┌────────────────────┐
         │ SUPABASE DATABASE  │
         │ (PostgreSQL)       │
         ├────────────────────┤
         │ • users            │
         │ • password_logs    │
         │ • email_otps       │
         └────────────────────┘

         ┌────────────────────┐
         │  HIBP API          │
         │ (Breach Detection) │
         └────────────────────┘
```

---

## Password Storage & Hashing

### Never Store Plaintext Passwords

The backend uses **bcrypt hashing** with a cost factor of 12 rounds:

```
Plain Password → Bcrypt (12 rounds) → Unique Hash → Store in DB
"MyPass123!"  → (deterministic salt generation)
                → "$2b$12$R9h7cIPz0gi.URNNGGFH2O..."
                → Only hash is stored ✅
```

### Hash Format Explanation

Example: `$2b$12$R9h7cIPz0gi.URNNGGFH2OPST9/PgBkqquzi.Ss7KIUgO2t0jKMm`

```
$2b    $12    $R9h7cIPz0gi.URNNGGFH2O    $PST9/PgBkqquzi.Ss7KIUgO2t0jKMm
  │     │                    │                         │
  │     │                    │                         └─ Hash (31 chars)
  │     │                    └─────────────────────── Salt (22 chars)
  │     └──────────────────────────────────────────── Cost Factor (12 = 2^12 = 4096 iterations)
  └────────────────────────────────────────────────── Algorithm (bcrypt version 2b)
```

### Password Masking for History

When passwords are checked, they're stored in history with a **masked version** only:

```
Original: "Password123"
Masked:   "Pa*****23"    ← First 2 and last 2 chars only
```

Short passwords (≤4 chars) are fully masked:
```
Original: "abc"
Masked:   "***"
```

---

## Security Features

### ✅ 1. Password Hashing with Bcrypt

**Why Bcrypt?**
- Intentionally slow (protects against brute-force)
- Automatically salts each password
- Adaptive cost factor (increase as CPUs get faster)

**Configuration:**
```python
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12  # Current recommendation for 2024
)
```

Cost factor meaning:
- $10 = 2^10 = 1,024 iterations (~10ms)
- $12 = 2^12 = 4,096 iterations (~100ms) ← **CURRENT**
- $14 = 2^14 = 16,384 iterations (~500ms)

### ✅ 2. Timing-Attack Resistant Verification

Password verification uses constant-time comparison:

```python
def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False
```

Protects against timing-based attacks that could reveal password length.

### ✅ 3. Generic Error Messages

Login endpoint returns:
```json
{"error": "Invalid username or password"}
```

Same message for both wrong username AND wrong password prevents user enumeration.

### ✅ 4. Input Validation

Pydantic schemas validate all inputs:
```python
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8)
    email: Optional[str] = None
```

Validators check:
- ✅ Username: 3-50 chars, alphanumeric + hyphens/underscores
- ✅ Password: Minimum 8 characters
- ✅ Email: Valid email format

### ✅ 5. No Plaintext Logged

- Password is never logged to files
- Hashes are never sent to client
- API responses never include password data

### ✅ 6. Breach Detection (k-Anonymity)

Have I Been Pwned API integration:
- First 5 chars of SHA-1 hash sent (`k-anonymity`)
- Full password never transmitted
- Server returns similar hashes
- Client locally checks for exact match

```python
# Example: "password123"
# SHA1: e38ad214943daaa1d64c102faec29de4afe9da3d

# Request sent: only "e38ad" to HIBP API
# Response: list of matching hashes starting with "e38ad"
# Client: checks if our full hash matches any response
```

### ✅ 7. JWT Token Support

FastAPI can issue JWT tokens for stateless authentication:
```python
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
```

---

## Data Flow

### Registration Flow

```
User Input
  username: john_doe
  password: SecurePass123!
  email: john@example.com
         │
         ▼
[1] VALIDATE INPUT
    ✓ Username: alphanumeric, 3-50 chars
    ✓ Password: minimum 8 chars
    ✓ Email: valid format
         │
         ▼
[2] CHECK DUPLICATE
    Query: Does "john_doe" already exist?
    Result: No → continue
         │
         ▼
[3] HASH PASSWORD
    Plain: SecurePass123!
    Hash:  $2b$12$R9h7cIPz0gi...
         │
         ▼
[4] STORE USER
    {
      "id": 1,
      "username": "john_doe",
      "hashed_password": "$2b$12$...",
      "email": "john@example.com",
      "is_verified": false,
      "created_at": "2026-03-25T10:30:00"
    }
         │
         ▼
RESPONSE TO CLIENT
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "created_at": "2026-03-25T10:30:00"
}
✓ Password/hash NOT in response
```

### Login Flow

```
User Input
  username: john_doe
  password: SecurePass123!
         │
         ▼
[1] GET USER
    Query database for username
    Found: { id: 1, hashed_password: "$2b$12$..." }
         │
         ▼
[2] VERIFY PASSWORD
    Input:  "SecurePass123!"
    Hash:   "$2b$12$..."
    
    Bcrypt verify:
    ├─ Extract salt from hash
    ├─ Hash input password with same salt
    ├─ Constant-time compare hashes
    └─ Result: ✓ MATCH
         │
         ▼
[3] RETURN SUCCESS
    {
      "success": true,
      "user": {
        "id": 1,
        "username": "john_doe",
        "is_verified": true
      }
    }
    ✓ No password/hash exposed
```

### Password Check & History Flow

```
User enters password
         │
         ▼
[1] ANALYZE PASSWORD (client-side + backend)
    ├─ Score: 0-4 scale
    ├─ Entropy: Shannon entropy bits
    ├─ Crack time: brute-force estimate
    └─ Breach check: HIBP API (k-anonymity)
         │
         ▼
[2] MASK PASSWORD
    Plain:  "MyPassword123"
    Masked: "My*****123"
         │
         ▼
[3] STORE IN HISTORY (if logged in)
    INSERT into password_logs:
    {
      "user_id": "john_doe",
      "masked_password": "My*****123",
      "strength": "Very Strong",
      "entropy": 83.5,
      "crack_time": "centuries",
      "created_at": "2026-03-25T10:30:00"
    }
    ✓ Only masked version stored
    ✓ Never full password
         │
         ▼
[4] RETURN ANALYSIS
    Display results in dashboard
    Show updated history table
```

---

## API Endpoints

### Authentication

```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123!",
  "email": "john@example.com"
}

Response (201 Created):
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "created_at": "2026-03-25T10:30:00"
}
```

```http
POST /auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "SecurePass123!"
}

Response (200 OK):
{
  "success": true,
  "user": {
    "id": 1,
    "username": "john_doe",
    "is_verified": true
  }
}
```

### Password Analysis

```http
POST /api/check-password
Content-Type: application/json

{
  "password": "MyPassword123!",
  "username": "john_doe"  # Optional, stores in history if provided
}

Response:
{
  "score": 4,
  "strength": "Very Strong",
  "entropy": 83.5,
  "estimated_crack_time": "centuries",
  "breach_count": 0,
  "suggestions": []
}
```

### Password History

```http
GET /api/user-history?username=john_doe

Response:
{
  "username": "john_doe",
  "history": [
    {
      "id": 1,
      "masked_password": "My*****23",
      "strength": "Very Strong",
      "entropy": 83.5,
      "crack_time": "centuries",
      "created_at": "2026-03-25T10:30:00"
    }
  ]
}
```

---

## Security Best Practices

| Practice | Implementation | Status |
|----------|-----------------|--------|
| **Hash passwords** | Bcrypt, 12 rounds | ✅ Implemented |
| **No plaintext storage** | Only hashes stored | ✅ Implemented |
| **Unique per user** | Bcrypt salts each password | ✅ Implemented |
| **Timing-attack resistant** | PassLib constant-time compare | ✅ Implemented |
| **Generic error messages** | Same message for all login failures | ✅ Implemented |
| **Input validation** | Pydantic schemas all inputs | ✅ Implemented |
| **Breach detection** | HIBP API with k-anonymity | ✅ Implemented |
| **Masked history** | Show only first/last 2 chars | ✅ Implemented |
| **Email verification** | OTP-based account verification | ✅ Implemented |
| **HTTPS/TLS** | Should configure in production | ⚠️ Not required for dev |
| **Rate limiting** | Should add before production | ⚠️ Future enhancement |
| **Audit logging** | Should implement for enterprise | ⚠️ Future enhancement |
| **Account lockout** | Should add after N failed attempts | ⚠️ Future enhancement |

---

## Threat Model & Mitigations

| Threat | Attack | Mitigation | Status |
|--------|--------|-----------|--------|
| **Brute Force** | Try all passwords | Slow bcrypt hashing (~100ms/attempt) | ✅ |
| **Rainbow Tables** | Pre-computed hashes | Random salt per password | ✅ |
| **Timing Attacks** | Measure verification time | Constant-time comparison | ✅ |
| **User Enumeration** | Determine if user exists | Generic error messages | ✅ |
| **SQL Injection** | Malicious SQL in inputs | Parameterized queries (Pydantic) | ✅ |
| **Password Reuse** | Dictionary attacks | Min 8 chars enforced | ✅ |
| **Man-in-the-Middle** | Intercept traffic | Use HTTPS/TLS in production | ⚠️ Dev only |
| **Shoulder Surfing** | Watch user enter password | Browser masking (user responsibility) | ℹ️ |
| **Data Breach** | Entire DB exposed | Only hashes stored, not plaintext | ✅ |
| **Breach Detection** | Check if password compromised | HIBP k-anonymity API | ✅ |

---

## Deployment Recommendations

Before going to production:

- [ ] Enable HTTPS/TLS (certificates from Let's Encrypt)
- [ ] Increase bcrypt cost factor if performance allows (to $14)
- [ ] Add rate limiting on authentication endpoints
- [ ] Implement account lockout after N failed attempts (e.g., 5 attempts)
- [ ] Add email verification before full account access
- [ ] Set up audit logging for all auth events
- [ ] Configure CORS to allow only your domain
- [ ] Use environment variables for all secrets
- [ ] Implement password complexity rules if needed
- [ ] Add breach detection on password change
- [ ] Set up monitoring/alerting for failed attempts
- [ ] Regular security audits and penetration testing

---

## Performance Characteristics

| Operation | Time | Bottleneck |
|-----------|------|-----------|
| Hash password | 50-100ms | Bcrypt intentionally slow |
| Verify password | 50-100ms | Bcrypt verification |
| Check breach | 200-500ms | Network to HIBP API |
| Store history | <50ms | Database write |
| Get history | <50ms | Database read |
| **Total login** | 50-200ms | Depends on network |

---

## References

- **bcrypt:** Niels Provos & David Mazières (https://en.wikipedia.org/wiki/Bcrypt)
- **Have I Been Pwned:** Troy Hunt (https://haveibeenpwned.com/)
- **OWASP Password Storage:** (https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- **PassLib:** (https://passlib.readthedocs.io/)

