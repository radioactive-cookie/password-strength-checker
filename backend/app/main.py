"""
Main FastAPI application for Password Strength Checker API.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import password_routes


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


# Include password routes
app.include_router(password_routes.router)


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
    print("✓ Password Strength Checker API started successfully")
    print(f"✓ Allowed Origins: {settings.CORS_ORIGINS}")


# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """
    Application shutdown event handler.
    """
    print("✓ Password Strength Checker API shutdown")


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.RELOAD,
        log_level="info"
    )
