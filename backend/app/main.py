"""
Main FastAPI application for Password Strength Checker API.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import password_routes


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


# Include password routes
app.include_router(password_routes.router)


# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to Password Strength Checker API",
        "version": settings.API_VERSION,
        "endpoints": {
            "docs": "/docs",
            "redoc": "/redoc",
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
    print("✓ Available endpoints:")
    print("   - POST /api/check-password")
    print("   - GET /api/health")
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
