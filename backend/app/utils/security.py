"""
Security utilities for password hashing and verification.
Uses bcrypt for secure password handling.
"""

from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional
import os

# Create CryptContext with bcrypt algorithm
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12  # Cost factor for bcrypt (12 is recommended)
)

# Secret key for JWT tokens (in production, load from environment)
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def hash_password(password: str) -> str:
    """
    Hash a plaintext password using bcrypt.
    
    Args:
        password (str): The plaintext password to hash.
        
    Returns:
        str: The hashed password.
        
    Note:
        - Bcrypt automatically handles salt generation
        - The same password will produce different hashes each time (due to salt)
        - This is the secure way to store passwords
    """
    if not password:
        raise ValueError("Password cannot be empty")
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plaintext password against its hashed version.
    
    Args:
        plain_password (str): The plaintext password to verify.
        hashed_password (str): The hashed password to verify against.
        
    Returns:
        bool: True if the password matches, False otherwise.
        
    Note:
        - This is timing-attack resistant
        - Returns False if either input is empty
    """
    if not plain_password or not hashed_password:
        return False
    
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        # If verification fails for any reason, return False
        return False


def get_password_hash_info(hashed_password: str) -> dict:
    """
    Get information about a hashed password (for debugging/admin purposes).
    
    Args:
        hashed_password (str): The hashed password.
        
    Returns:
        dict: Information about the hash (algorithm, rounds, etc.)
    """
    try:
        # Extract bcrypt info from the hash
        if hashed_password.startswith("$2"):
            parts = hashed_password.split("$")
            return {
                "algorithm": "bcrypt",
                "version": parts[1],
                "cost": int(parts[2]),
                "salt_and_hash_length": len(hashed_password) - len("$2a$12$")
            }
        return {"error": "Unknown hash format"}
    except Exception as e:
        return {"error": str(e)}


def mask_password(password: str) -> str:
    """
    Create a safe masked display of a password for history.
    
    Shows only first 2 and last 2 characters, with middle masked as asterisks.
    For very short passwords, all characters are masked.
    
    Examples:
        - "Password123" → "Pa*******23"
        - "abc" → "***"
        - "ab" → "**"
        - "Secure@Pass456!" → "Se*********6!"
    
    Args:
        password (str): The plaintext password to mask.
        
    Returns:
        str: The masked password safe for display.
        
    Note:
        - This is for display purposes only in password history
        - The full password is never stored in database
        - Original password is only kept in bcrypt hash
    """
    if not password:
        return ""
    
    # For very short passwords (4 chars or less), mask all
    if len(password) <= 4:
        return "*" * len(password)
    
    # For longer passwords, show first 2 and last 2 with asterisks in middle
    # Example: "MyPassword" (10 chars) → "My*****rd"
    return password[:2] + "*" * (len(password) - 4) + password[-2:]
