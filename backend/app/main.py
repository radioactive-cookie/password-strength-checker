"""
Main FastAPI application for Password Strength Checker API.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import password_routes, auth


# Create FastAPI application instance
app = FastAPI(
    title=settings.API_TITLE,
    version=settings.API_VERSION,
    description=settings.API_DESCRIPTION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)


# Add CORS middleware to allow cross-origin requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_ALLOW_CREDENTIALS,
    allow_methods=settings.CORS_ALLOW_METHODS,
    allow_headers=settings.CORS_ALLOW_HEADERS,
)


# Include routers
app.include_router(password_routes.router)
app.include_router(auth.router)


# Root endpoint
@app.get("/")
async def root():
    """
    Root endpoint providing API information.
    
    Returns:
        Dict: API metadata and available endpoints.
    """
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
    """
    Application startup event handler.
    """
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
    """
    Application shutdown event handler.
    """
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
