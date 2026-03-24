"""
Main FastAPI application for Password Strength Checker API.
"""

# Load environment variables first, before any other imports
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import password_routes, auth


# Create FastAPI application instance
app = FastAPI()

# Allow requests from frontend and local development
origins = [
    "http://localhost:5173",
    "https://password-strength-checker-three-pi.vercel.app",
    "https://password-strength-checker-87hzp3twq.vercel.app",
    "https://password-strength-check-git-634659-radioactive-cookies-projects.vercel.app",
]

# Add CORS middleware BEFORE including routers
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or ["*"] for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(password_routes.router)
app.include_router(auth.router)


# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to Password Strength Checker API",
        "version": settings.API_VERSION,
        "endpoints": {
            "docs": "/docs",
            "redoc": "/redoc",
            "auth_register": "/auth/register",
            "auth_login": "/auth/login",
            "check_password": "/api/check-password",
            "health": "/api/health"
        }
    }


# Startup event
@app.on_event("startup")
async def startup_event():
    print("\n" + "="*70)
    print("✓ Password Strength Checker API started successfully")
    print("="*70)
    print(f"📍 Server running at: http://127.0.0.1:8000")
    print(f"📍 API Docs at: http://127.0.0.1:8000/docs")
    print(f"✓ CORS Enabled for Origins:")
    for origin in settings.CORS_ORIGINS:
        print(f"   - {origin}")
    print(f"✓ Available endpoints:")
    print(f"   - POST /auth/register (secure user registration)")
    print(f"   - POST /auth/login (user authentication)")
    print(f"   - POST /api/check-password (password strength analysis)")
    print(f"   - GET /api/health (health check)")
    print("="*70 + "\n")


# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    print("\n✓ Password Strength Checker API shutdown\n")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.RELOAD,
        log_level="info"
    )
