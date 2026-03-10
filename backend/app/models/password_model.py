"""
Database models for password-related data.
Currently reserved for future use with database integration.
"""

from typing import Optional


class Password:
    """
    Password model for potential database storage.
    
    This model can be extended for database integration using SQLAlchemy
    to store password evaluations and user history.
    """
    
    def __init__(
        self,
        password: str,
        score: int,
        strength: str,
        entropy: float,
        estimated_crack_time: Optional[str] = None,
        user_id: Optional[str] = None,
        timestamp: Optional[str] = None
    ):
        self.password = password
        self.score = score
        self.strength = strength
        self.entropy = entropy
        self.estimated_crack_time = estimated_crack_time
        self.user_id = user_id
        self.timestamp = timestamp
    
    def __repr__(self):
        return f"<Password(score={self.score}, strength={self.strength})>"
