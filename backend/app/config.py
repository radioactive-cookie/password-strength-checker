"""
Configuration settings for the Password Strength Checker API.
"""

from typing import List


class Settings:
    """
    Application settings and configuration.
    """
    
    # API Configuration
    API_TITLE: str = "Password Strength Checker API"
    API_VERSION: str = "1.0.0"
    API_DESCRIPTION: str = "A comprehensive REST API for evaluating password strength"
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",  # Vite default
        "http://localhost:8000",
        "http://localhost:8080",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8000",
        "http://127.0.0.1:8080",
    ]
    
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["*"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]
    
    # Server Configuration
    DEBUG: bool = True
    RELOAD: bool = True


# Create settings instance
settings = Settings()
