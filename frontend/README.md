# Password Strength Checker - Frontend

A modern, responsive web application that provides real-time password strength analysis with animated visualizations and educational content. This frontend communicates with a FastAPI backend to deliver comprehensive security insights and recommendations.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Backend Connection](#backend-connection)
- [Important Notes](#important-notes)
- [Future Improvements](#future-improvements)

## Overview

The Password Strength Checker frontend is a single-page application (SPA) built with React and Vite. It provides users with an interactive interface to analyze password security in real-time. The application features a dark cybersecurity theme with smooth animations and intuitive design patterns.

## Tech Stack

| Technology | Purpose |
|---|---|
| **React** | Frontend framework for building interactive UI components |
| **TypeScript/JavaScript** | Programming language for application logic |
| **Vite** | Fast build tool and development server |
| **TailwindCSS** | Utility-first CSS framework for styling |
| **Framer Motion** | Animation library for smooth, interactive transitions |
| **Axios** | HTTP client for API communication with backend |

## Features

### 1. Password Strength Checker
Users can enter a password and receive detailed security analysis including:
- **Strength Score**: Numerical rating of password robustness
- **Entropy Value**: Measurement of password randomness and complexity
- **Estimated Crack Time**: Time required to brute-force the password
- **Security Improvement Suggestions**: Actionable recommendations to strengthen the password

### 2. Dark Cybersecurity Theme
A modern, professional user interface designed with:
- Black and grey color palette
- Developer-tool aesthetics
- High contrast for readability
- Cybersecurity-focused visual language

### 3. UI Animations
Smooth, performant animations throughout the application:
- **Scroll Reveal Animations**: Elements animate in as users scroll
- **Hover Animations**: Interactive feedback on interactive elements
- **Animated Password Strength Bar**: Real-time visual feedback as users type

### 4. Security Guide
An educational section providing:
- Best practices for password security
- Tips for creating strong passwords
- Common password vulnerabilities to avoid

### 5. Video Tutorial Section
Embedded educational content explaining:
- How to create strong passwords
- Password security principles
- Practical password management strategies

## Project Structure

```
frontend/
│
├── src/
│   ├── components/           # Reusable React components
│   │   ├── PasswordChecker.jsx
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── FeatureCards.tsx
│   │   ├── GuideSection.tsx
│   │   ├── VideoSection.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Footer.tsx
│   │   └── ui/              # UI component library
│   │
│   ├── services/            # API integration and external services
│   │   └── api.js           # Axios instance and API calls
│   │
│   ├── styles/              # Global styles and theme configuration
│   │   ├── index.css
│   │   ├── tailwind.css
│   │   ├── theme.css
│   │   └── fonts.css
│   │
│   ├── App.tsx              # Main application component
│   │
│   └── main.tsx             # Application entry point
│
├── index.html               # HTML template
├── package.json             # Project dependencies and scripts
├── vite.config.ts           # Vite configuration
├── postcss.config.mjs        # PostCSS configuration for TailwindCSS
└── README.md                # This file
```

## Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** (v7 or higher) or **yarn**

### Steps

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Verify the installation:
```bash
npm --version
node --version
```

## Running the Project

### Development Server

Start the development server with hot module replacement (HMR):

```bash
npm run dev
```

The application will be available at:
```
http://localhost:5173
```

The development server automatically reloads when you modify files.

### Production Build

Build the application for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Backend Connection

The frontend communicates with a FastAPI backend service to analyze password strength.

### API Endpoint

**Endpoint**: `POST /check-password`

**Base URL**: `http://localhost:8000` (default)

### Request Format

```json
{
  "password": "examplePassword123!"
}
```

### Response Format

The backend returns a JSON object with the following fields:

```json
{
  "score": 85,
  "strength": "Strong",
  "entropy": 56.7,
  "estimated_crack_time": "2 months",
  "suggestions": [
    "Add special characters for better security",
    "Increase password length for stronger protection"
  ]
}
```

### Response Fields

| Field | Type | Description |
|---|---|---|
| `score` | Integer (0-100) | Overall password strength score |
| `strength` | String | Categorical strength level (Weak, Fair, Good, Strong, Very Strong) |
| `entropy` | Float | Shannon entropy measurement in bits |
| `estimated_crack_time` | String | Human-readable time estimate for brute-force attack |
| `suggestions` | Array | List of actionable recommendations |

## Important Notes

### Backend Server Requirement

**The backend server must be running for the frontend to function properly.**

Start the FastAPI backend with:

```bash
cd backend
uvicorn app.main:app --reload
```

The backend will run at:
```
http://localhost:8000
```

### CORS Configuration

Ensure the backend has CORS (Cross-Origin Resource Sharing) properly configured to accept requests from the frontend development server.

### Environment Variables

If API endpoints are configurable, create a `.env` file in the frontend directory:

```
VITE_API_BASE_URL=http://localhost:8000
```

Reference environment variables in your code as:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

## Future Improvements

The following enhancements are planned for future releases:

- **Real-Time Password Strength Detection**: Analyze password strength as users type without requiring form submission
- **Password Generator**: Built-in tool to generate secure, randomized passwords with customizable criteria
- **Password Breach Checking**: Integration with breach databases to identify compromised passwords
- **Cloud Deployment**: Deploy frontend to cloud platforms (Vercel, Netlify, AWS S3, etc.)
- **Progressive Web App (PWA)**: Add offline capability and installable app experience
- **Accessibility Improvements**: Enhanced screen reader support and keyboard navigation
- **Multi-Language Support**: Internationalization (i18n) for global users
- **Dark/Light Mode Toggle**: User preference for theme selection
- **Password History**: Store and manage password analysis history
- **API Rate Limiting**: Implement client-side rate limiting for API calls

## Contributing

When contributing to this project, please ensure:

1. Code follows the existing style and conventions
2. Components are properly documented with JSDoc comments
3. API integration changes are tested with the backend
4. All animations maintain good performance (60 FPS target)

## License

This project is part of the Password Strength Checker application suite.

---

## Support

For issues, questions, or feature requests, please refer to the main project documentation or contact the development team.

**Last Updated**: March 10, 2026
