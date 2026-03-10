
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

## 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/password_checker.git
cd password_checker
```

---

# ▶ Running the Backend

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

The backend will run at:

```
http://127.0.0.1:8000
```

API documentation:

```
http://127.0.0.1:8000/docs
```

---

# ▶ Running the Frontend

Open another terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will run at:

```
http://localhost:5173
```

---

# 🔗 API Endpoint

The frontend communicates with the backend using the following endpoint:

```
POST /check-password
```

Example request:

```json
{
  "password": "examplePassword"
}
```

Example response:

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

---

# 📌 Future Improvements

Some ideas for expanding the project in the future:

* Password manager integration
* Password history checks
* User accounts and saved reports
* Browser extension
* Cloud deployment

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
