"""
Pydantic schemas for password validation API requests and responses.
"""

from pydantic import BaseModel, Field
from typing import List, Optional


class PasswordRequest(BaseModel):
    """
    Schema for password strength check request.
    
    Attributes:
        password (str): The password to evaluate for strength.
        username (Optional[str]): Optional username for storing analysis history (for logged-in users only).
    """
    password: str = Field(..., min_length=1, max_length=256, description="Password to check")
    username: Optional[str] = Field(None, description="Username of logged-in user (for history tracking)")

    class Config:
        json_schema_extra = {
            "example": {
                "password": "MyP@ssw0rd123!",
                "username": "pritam"
            }
        }


class PasswordLogEntry(BaseModel):
    """
    Schema for a password analysis log entry (history).
    
    Attributes:
        id (int): Unique log entry ID
        user_id (str): Username who performed the analysis
        strength (str): Password strength classification
        entropy (float): Shannon entropy value
        crack_time (str): Estimated time to crack
        created_at (str): Timestamp of analysis
    """
    id: int = Field(..., description="Log entry ID")
    user_id: str = Field(..., description="Username")
    strength: str = Field(..., description="Strength classification")
    entropy: float = Field(..., description="Shannon entropy value")
    crack_time: str = Field(..., description="Estimated crack time")
    created_at: str = Field(..., description="Timestamp")

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "user_id": "pritam",
                "strength": "Very Strong",
                "entropy": 83.45,
                "crack_time": "centuries",
                "created_at": "2026-03-24T10:30:00.000Z"
            }
        }


class PasswordHistoryResponse(BaseModel):
    """
    Schema for password history retrieval response.
    
    Attributes:
        history (List[PasswordLogEntry]): List of password analyses
    """
    history: List[PasswordLogEntry] = Field(..., description="User's password analysis history")

    class Config:
        json_schema_extra = {
            "example": {
                "history": [
                    {
                        "id": 1,
                        "user_id": "pritam",
                        "strength": "Very Strong",
                        "entropy": 83.45,
                        "crack_time": "centuries",
                        "created_at": "2026-03-24T10:30:00.000Z"
                    }
                ]
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
                "estimated_crack_time": "centuries",
                "breach_count": 0
            }
        }
