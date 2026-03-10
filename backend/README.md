# password_checker Backend

## Overview

The backend is the engine behind password_checker. It handles all the heavy lifting — analyzing password strength, calculating entropy, checking for breaches against known databases, and estimating how long it would take to crack a password.

Built with FastAPI and Python, it processes passwords securely and returns comprehensive security metrics. The backend runs as a REST API that the frontend communicates with for all password analysis operations.

## Features

- **Password Strength Scoring** — Evaluates passwords on a 0-4 scale with detailed feedback
- **Entropy Calculation** — Measures password randomness using Shannon entropy
- **Password Breach Detection** — Checks against the Have I Been Pwned API with k-anonymity for privacy
- **Crack-Time Estimation** — Provides realistic estimates of how long passwords would take to crack
- **Security Suggestions** — Recommends specific improvements for weak passwords
- **Character Pattern Analysis** — Evaluates uppercase, lowercase, numbers, and special characters

## Tech Stack

- **Python** — The language everything is written in
- **FastAPI** — High-performance web framework for building APIs
- **Uvicorn** — ASGI server that runs the FastAPI application
- **Pydantic** — Request/response validation and type checking
- **zxcvbn** — Password strength estimation library from Dropbox

## Project Structure

```
backend/
├── app/
│   ├── main.py                   # FastAPI app setup and startup
│   ├── config.py                 # Configuration (CORS, settings)
│   ├── models/
│   │   └── password_model.py     # Data models
│   ├── routes/
│   │   └── password_routes.py    # API endpoint handlers
│   ├── services/
│   │   └── password_checker.py   # Core analysis logic
│   ├── schemas/
│   │   └── password_schema.py    # Request/response schemas
│   └── utils/
│       ├── entropy_calculator.py # Shannon entropy calculations
│       └── breach_checker.py     # Have I Been Pwned integration
├── requirements.txt              # Python dependencies
└── README.md
```

**What each folder does:**

- **models/** — Data structures that represent passwords and analysis results
- **routes/** — HTTP endpoint definitions (basically the API interface)
- **services/** — The actual logic that analyzes passwords
- **schemas/** — Pydantic validators that ensure incoming requests are properly formatted
- **utils/** — Helper utilities like entropy calculation and breach checking

## Running the Backend

### Prerequisites

You'll need Python 3.10 or higher installed. Check with:
```bash
python --version
```

### Steps

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   # On Windows
   python -m venv .venv
   .\.venv\Scripts\activate

   # On macOS/Linux
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the FastAPI server:**
   ```bash
   uvicorn app.main:app --reload
   ```

The backend will be available at:
```
http://127.0.0.1:8000
```

You'll also have access to interactive API documentation at:
- **Swagger UI** — http://127.0.0.1:8000/docs (more interactive)
- **ReDoc** — http://127.0.0.1:8000/redoc (more detailed)

## API Endpoint

### POST /api/check-password

This is the main endpoint. Submit a password and get back a complete security analysis.

**Example Request:**
```json
{
  "password": "MyP@ssw0rd123!"
}
```

**Example Response:**
```json
{
  "score": 3,
  "strength": "Strong",
  "entropy": 56.2,
  "estimated_crack_time": "3 years",
  "breach_count": 0,
  "suggestions": []
}
```

**Response Fields:**
- `score` — Strength on a scale of 0-4 (0=very weak, 4=very strong)
- `strength` — Human-readable label (Very Weak, Weak, Medium, Strong, Very Strong)
- `entropy` — Shannon entropy value in bits (higher = more random)
- `estimated_crack_time` — How long to crack with current computing power
- `breach_count` — How many times this password appears in known breaches (0 is good!)
- `suggestions` — Array of tips to improve the password

## How It Works

1. **Receives Password** — Frontend sends password to the backend
2. **Validates Input** — Pydantic ensures the request is valid
3. **Analyzes Password** — Service layer runs multiple checks:
   - Character diversity (uppercase, lowercase, numbers, symbols)
   - Length evaluation
   - Entropy calculation
   - Pattern detection (using zxcvbn)
4. **Checks Breaches** — Queries Have I Been Pwned API using k-anonymity (only first 5 chars of SHA-1 hash sent)
5. **Generates Suggestions** — Creates actionable recommendations
6. **Estimates Crack Time** — Calculates realistic time-to-crack
7. **Returns Results** — Sends all analysis back to frontend

## Security Considerations

- **Passwords are never stored** — The backend analyzes them on-the-fly and discards them
- **K-anonymity for breach checking** — We use the first 5 characters of the SHA-1 hash, never the full password
- **CORS configured** — Only allows requests from known frontend ports
- **Input validation** — All requests are validated using Pydantic schemas
- **No logging of passwords** — Passwords never appear in logs or database

## CORS Configuration

The backend accepts requests from:
- `http://localhost:3000`
- `http://localhost:5173` (Vite)
- `http://localhost:8000`
- `http://localhost:8080`
- `127.0.0.1` variants

To change this, edit `app/config.py`.

## Testing the API

The easiest way to test is using the interactive Swagger UI:

1. Go to http://127.0.0.1:8000/docs
2. Click on the POST /api/check-password endpoint
3. Click "Try it out"
4. Enter a test password (try "password123" to see breach detection in action)
5. Click "Execute"

Or use cURL:
```bash
curl -X POST http://127.0.0.1:8000/api/check-password \
  -H "Content-Type: application/json" \
  -d '{"password":"password123"}'
```

## Future Improvements

- Password manager integration
- Bulk password checking API
- Caching of common passwords
- User accounts for saved reports
- API rate limiting and authentication
- Detailed password audit logs
- Support for GPG/PGP encrypted passwords

---

**Questions?** Check out the [IMPLEMENTATION_SUMMARY.md](../IMPLEMENTATION_SUMMARY.md) for more technical details about how everything works together.

