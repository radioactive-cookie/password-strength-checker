# Password Strength Checker - Backend API

A production-ready FastAPI-based REST API for evaluating password strength with comprehensive security analysis.

## 🎯 Project Overview

The Password Strength Checker API provides a robust backend service that evaluates passwords using multiple strength metrics including:

- **Password Length Analysis**: Evaluates minimum length requirements
- **Character Variety**: Checks for uppercase, lowercase, numbers, and special characters
- **Shannon Entropy Calculation**: Measures password randomness
- **Dictionary Attack Resistance**: Uses zxcvbn library for pattern recognition
- **Estimated Crack Time**: Provides realistic crack time estimates
- **Smart Suggestions**: Offers specific recommendations for password improvement

## 📋 Requirements

- Python 3.10 or higher
- pip (Python package manager)

## 🚀 Installation

### Step 1: Navigate to Backend Directory
```bash
cd backend
```

### Step 2: Create Virtual Environment (Optional but Recommended)
```bash
# On Windows
python -m venv .venv
.\.venv\Scripts\activate

# On macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

## ▶️ How to Run

Start the development server with automatic reload:

```bash
uvicorn app.main:app --reload
```

Or with custom host and port:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at:
- **Main API**: http://localhost:8000
- **API Documentation (Swagger UI)**: http://localhost:8000/docs
- **Alternative Docs (ReDoc)**: http://localhost:8000/redoc

## 📡 API Endpoints

### 1. Health Check
**GET** `/api/health`

Check if the API is running and healthy.

**Response:**
```json
{
  "status": "healthy",
  "service": "Password Strength Checker API"
}
```

### 2. Check Password Strength
**POST** `/api/check-password`

Evaluate the strength of a password.

**Request Body:**
```json
{
  "password": "MyP@ssw0rd123!"
}
```

**Response:**
```json
{
  "password": "MyP@ssw0rd123!",
  "score": 4,
  "strength": "Very Strong",
  "entropy": 83.45,
  "suggestions": [],
  "estimated_crack_time": "centuries"
}
```

## 🔑 Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `password` | string | The evaluated password |
| `score` | integer | Strength score (0-4) |
| `strength` | string | Strength label (Very Weak, Weak, Medium, Strong, Very Strong) |
| `entropy` | float | Shannon entropy value in bits |
| `suggestions` | array | List of improvement suggestions |
| `estimated_crack_time` | string | Estimated time to crack the password |

## 📊 Strength Scoring

| Score | Label | Description |
|-------|-------|-------------|
| 0 | Very Weak | Does not meet minimum security requirements |
| 1 | Weak | Basic minimum but still vulnerable |
| 2 | Medium | Acceptable but could be stronger |
| 3 | Strong | Good security level |
| 4 | Very Strong | Excellent security level |

## 📝 Example API Requests

### Using cURL

```bash
# Basic request
curl -X POST http://localhost:8000/api/check-password \
  -H "Content-Type: application/json" \
  -d '{"password":"MyP@ssw0rd123!"}'

# Response
{
  "password": "MyP@ssw0rd123!",
  "score": 4,
  "strength": "Very Strong",
  "entropy": 83.45,
  "suggestions": [],
  "estimated_crack_time": "centuries"
}
```

### Using JavaScript/Fetch

```javascript
const response = await fetch('http://localhost:8000/api/check-password', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    password: 'MyP@ssw0rd123!'
  })
});

const data = await response.json();
console.log(data);
```

### Using Python/Requests

```python
import requests

response = requests.post(
    'http://localhost:8000/api/check-password',
    json={'password': 'MyP@ssw0rd123!'}
)

print(response.json())
```

## 🏗️ Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Configuration settings
│   ├── models/
│   │   ├── __init__.py
│   │   └── password_model.py   # Password data model
│   ├── routes/
│   │   ├── __init__.py
│   │   └── password_routes.py  # API route handlers
│   ├── services/
│   │   ├── __init__.py
│   │   └── password_checker.py # Core password evaluation logic
│   ├── utils/
│   │   ├── __init__.py
│   │   └── entropy_calculator.py # Shannon entropy calculations
│   └── schemas/
│       ├── __init__.py
│       └── password_schema.py  # Pydantic request/response schemas
├── requirements.txt            # Python dependencies
└── README.md                   # This file
```

## 🔐 Security Features

1. **Input Validation**: Pydantic schemas validate all inputs
2. **CORS Configuration**: Configured for frontend communication
3. **Error Handling**: Comprehensive error handling with appropriate HTTP status codes
4. **Type Hints**: Full type annotations for code clarity and IDE support

## 🛠️ Architecture

The backend follows a modular layered architecture:

- **Routes Layer** (`password_routes.py`): HTTP endpoint handlers
- **Service Layer** (`password_checker.py`): Business logic for password evaluation
- **Utility Layer** (`entropy_calculator.py`): Helper functions and calculations
- **Schema Layer** (`password_schema.py`): Request/response validation using Pydantic
- **Config Layer** (`config.py`): Application configuration and settings

## 🔄 CORS Configuration

The API is configured to accept requests from:
- http://localhost:3000 (React development server)
- http://localhost:5173 (Vite development server)
- http://localhost:8000
- http://localhost:8080
- 127.0.0.1:3000

To modify CORS settings, edit `app/config.py`.

## 📚 Dependencies

- **FastAPI**: Modern web framework for building APIs
- **Uvicorn**: ASGI server for running FastAPI
- **Pydantic**: Data validation and settings management
- **zxcvbn**: Password strength estimation and crack time calculation
- **python-multipart**: Support for file uploads and form data

## 🧪 Testing

To test the API endpoints:

1. Open the interactive API documentation at http://localhost:8000/docs
2. Navigate to the POST /api/check-password endpoint
3. Click "Try it out"
4. Enter a test password
5. Click "Execute"

## 📖 Additional Resources

- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **Uvicorn Documentation**: https://www.uvicorn.org/
- **zxcvbn Documentation**: https://github.com/dropbox/zxcvbn
- **Pydantic Documentation**: https://docs.pydantic.dev/

## 🤝 Contributing

When adding new features or modifying existing code:

1. Maintain the modular architecture
2. Follow Python PEP 8 style guidelines
3. Add proper type hints to all functions
4. Include docstrings for all functions and classes
5. Test changes thoroughly

## 📄 License

This project is open-source and available for educational purposes.

---

**Version**: 1.0.0  
**Last Updated**: March 2026  
**Status**: Production Ready
