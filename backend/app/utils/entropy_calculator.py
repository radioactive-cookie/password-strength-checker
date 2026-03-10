"""
Entropy calculation utilities for password strength evaluation.
Uses Shannon entropy formula to measure password randomness.
"""

import math
from collections import Counter


def calculate_entropy(password: str) -> float:
    """
    Calculate Shannon entropy of a password.
    
    Shannon entropy measures the randomness/uncertainty in a password.
    Higher entropy indicates stronger password.
    
    Formula: H(X) = -Σ(p(x) * log2(p(x)))
    
    Args:
        password (str): The password to calculate entropy for.
    
    Returns:
        float: Shannon entropy value in bits.
    
    Example:
        >>> calculate_entropy("aaa")
        0.0
        >>> calculate_entropy("abc123!@#")
        23.50 (approximately)
    """
    if not password:
        return 0.0
    
    # Count frequency of each character
    frequency = Counter(password)
    
    # Calculate entropy
    entropy = 0.0
    password_length = len(password)
    
    for count in frequency.values():
        # Probability of each character
        probability = count / password_length
        # Shannon entropy formula
        entropy -= probability * math.log2(probability)
    
    # Normalize by password length to get bits per character
    # Then multiply by length to get total entropy
    return entropy * password_length


def calculate_charset_size(password: str) -> int:
    """
    Determine the size of the character set used in the password.
    
    Args:
        password (str): The password to analyze.
    
    Returns:
        int: Estimated character set size.
    """
    charset_size = 0
    
    # Check for lowercase letters
    if any(c.islower() for c in password):
        charset_size += 26
    
    # Check for uppercase letters
    if any(c.isupper() for c in password):
        charset_size += 26
    
    # Check for digits
    if any(c.isdigit() for c in password):
        charset_size += 10
    
    # Check for special characters
    if any(not c.isalnum() for c in password):
        charset_size += 32  # Common special characters
    
    return charset_size
