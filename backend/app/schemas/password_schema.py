"""
Pydantic schemas for password validation API requests and responses.
"""

from pydantic import BaseModel, Field
from typing import List


class PasswordRequest(BaseModel):
    """
    Schema for password strength check request.
    
    Attributes:
        password (str): The password to evaluate for strength.
    """
    password: str = Field(..., min_length=1, max_length=256, description="Password to check")

    class Config:
        json_schema_extra = {
            "example": {
                "password": "MyP@ssw0rd123!"
            }
        }


class PasswordResponse(BaseModel):
    """
    Schema for password strength check response.
    
    Attributes:
        password (str): The evaluated password.
        score (int): Strength score from 0 to 4.
        strength (str): Human-readable strength label.
        entropy (float): Shannon entropy value.
        suggestions (List[str]): Improvement suggestions from zxcvbn.
        estimated_crack_time (str): Estimated time to crack the password.
        breach_count (int): Number of times password appears in known data breaches.
    """
    password: str = Field(..., description="The password evaluated")
    score: int = Field(..., ge=0, le=4, description="Strength score (0-4)")
    strength: str = Field(..., description="Strength label")
    entropy: float = Field(..., description="Shannon entropy value")
    suggestions: List[str] = Field(..., description="Improvement suggestions")
    estimated_crack_time: str = Field(..., description="Estimated crack time")
    breach_count: int = Field(..., ge=0, description="Times seen in known data breaches")

    class Config:
        json_schema_extra = {
            "example": {
                "password": "MyP@ssw0rd123!",
                "score": 4,
                "strength": "Very Strong",
                "entropy": 83.45,
                "suggestions": [],
                "estimated_crack_time": "centuries"
            }
        }
