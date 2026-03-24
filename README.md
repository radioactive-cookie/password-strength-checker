
---

# 🔐 password_checker

**password_checker** is a small cybersecurity-focused web application that helps you understand how strong your password actually is.

Instead of just telling you *“weak”* or *“strong”*, the app analyzes your password using multiple security metrics and explains **why** a password is secure or insecure.

It was built as a learning project around password security concepts such as entropy, breach detection, and brute-force attack resistance.

---

# 🚀 What This Project Does

When you enter a password, the application analyzes it in real time and shows useful security information like:

* How strong the password is
* Whether the password has appeared in known data breaches
* How unpredictable the password is (entropy score)
* How long it might take an attacker to crack it
* Suggestions to improve password security

The goal is simple: **help people create stronger passwords and understand password security better.**

---

# ✨ Features

### 🔍 Real-Time Password Strength Analysis

As you type a password, the application evaluates its strength instantly and updates the result on the screen.

### 🔑 Strong Password Generator

Need a secure password? The built-in generator can create a random password using a mix of letters, numbers, and special characters.

### ⚠️ Password Breach Detection

The system checks whether your password has appeared in known data breaches using the **Have I Been Pwned password database**.

### 📊 Entropy Calculation

The app calculates password entropy to measure how unpredictable and secure the password really is.

### ⏳ Crack-Time Estimation

It estimates how long a brute-force attack would take to crack the password.

### 🎨 Color-Coded Strength Indicator

Password strength is displayed visually:

* 🔴 Weak
* 🟡 Medium
* 🟢 Strong

This makes it easy to understand the security level at a glance.

---

# 📚 Documentation Guide

**Getting Started?** Start here based on your needs:

| Document | Purpose |
|----------|---------|
| [SETUP.md](SETUP.md) | **Start here!** Complete setup, configuration, and troubleshooting guide |
| [SYSTEM_ARCHITECTURE.md](SYSTEM_ARCHITECTURE.md) | Understand the application architecture and data flow |
| [SECURE_PASSWORD_STORAGE.md](SECURE_PASSWORD_STORAGE.md) | Learn about security practices and how passwords are handled |
| [ATTRIBUTIONS.md](ATTRIBUTIONS.md) | Credits and acknowledgments |

---

# 🧠 How It Works

1. The user enters or generates a password.
2. The frontend sends the password to the backend for analysis.
3. The backend evaluates the password using several security metrics.
4. The results are returned and displayed instantly in the UI.

---

# 🛠 Tech Stack

### Frontend

* React
* Vite
* TypeScript
* TailwindCSS

### Backend

* Python
* FastAPI
* Uvicorn

### Security Concepts Used

* Password entropy calculation
* Password breach detection (Have I Been Pwned API)
* Password strength scoring
* Brute-force crack time estimation

---

# 📂 Project Structure

```
password_checker
│
├── frontend
│   ├── src
│   │   ├── app
│   │   │   ├── App.tsx
│   │   │   └── components
│   │   └── main.tsx
│   └── index.html
│
└── backend
    ├── app
    │   ├── main.py
    │   ├── services
    │   └── utils
```

---

# ⚙️ Installation & Setup

> **👉 For complete setup instructions, see [SETUP.md](SETUP.md)**

## Quick Start

1. **Install dependencies**
   ```bash
   # Backend (Python 3.10+)
   cd backend && pip install -r requirements.txt
   
   # Frontend (Node.js 16+)
   cd ../frontend && npm install
   ```

2. **Configure Supabase**
   - Create `.env` file in `backend/` directory
   - Add Supabase URL and Service Role Key
   - See [SETUP.md](SETUP.md) for detailed instructions

3. **Run the Application**
   
   **Backend** (Terminal 1):
   ```bash
   cd backend
   python -m uvicorn app.main:app --reload
   ```
   - Backend at: http://localhost:8000
   - API docs at: http://localhost:8000/docs

   **Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```
   - Frontend at: http://localhost:5173

4. **Access the Application**
   
   Open http://localhost:5173 in your browser

---

# 🔗 API Endpoints

### Check Password Strength
```
POST /api/check-password
Content-Type: application/json

{
  "password": "examplePassword",
  "username": "optional_username"
}
```

**Response:**
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

### Get Password History
```
GET /api/history?username=your_username
```

### Health Check
```
GET /api/health
```

For full API documentation when running, visit: http://localhost:8000/docs

---

# 🐛 Troubleshooting

Common issues and solutions can be found in [SETUP.md - Troubleshooting](SETUP.md#troubleshooting) section.

Key issues:
- **"Invalid API Key" Error**: Make sure you're using the **Service Role Key**, not the Anon key
- **Password History Not Saving**: Verify the `password_logs` table exists in Supabase
- **Dashboard Shows Black Screen**: Try a hard refresh (Ctrl+Shift+R)

---

# 📌 Implemented Features

✅ **User Authentication** - Register and login system
✅ **Dashboard** - View password history and analysis dashboard
✅ **Password History** - Track all password analyses over time
✅ **Secure Storage** - Supabase-powered database with Row-Level Security
✅ **Dark Theme UI** - Modern, accessible user interface
✅ **Responsive Design** - Works on desktop and mobile devices

---

# 🚀 Future Improvements

Potential enhancements for the project:

* Browser extension for real-time password analysis
* Password manager integration
* Advanced security reports and analytics
* Team/organizational password policies
* Password strength enforcement rules
* Scheduled security audits
* Biometric authentication options
* Cloud deployment (AWS, Vercel, Heroku)

---

# 🤝 Contributing

Contributions are welcome!
If you'd like to improve the project:

1. Fork the repository
2. Create a new branch
3. Submit a pull request

---

# ⭐ If You Like the Project

If you found this project helpful or interesting, consider giving it a **star on GitHub**.
It helps others discover the project and motivates further development.

---

# 📜 License

This project is open source and available under the MIT License.

---
