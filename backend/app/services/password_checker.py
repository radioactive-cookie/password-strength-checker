"""
Password strength evaluation service.
Implements comprehensive password strength checking using multiple criteria.
"""

import re
from typing import List, Dict, Tuple
from zxcvbn import zxcvbn
from app.utils.entropy_calculator import calculate_entropy, calculate_charset_size
from app.utils.breach_checker import BreachChecker


class PasswordChecker:
    """
    Service for evaluating password strength using multiple criteria.
    
    Evaluates passwords based on:
    - Length
    - Character variety (uppercase, lowercase, numbers, special chars)
    - Shannon entropy
    - Dictionary attack resistance (via zxcvbn)
    """
    
    # Strength score thresholds
    SCORE_THRESHOLDS = {
        0: (0, "Very Weak"),      # Score 0
        1: (1, "Weak"),           # Score 1
        2: (2, "Medium"),         # Score 2
        3: (3, "Strong"),         # Score 3
        4: (4, "Very Strong"),    # Score 4
    }
    
    # Length-based score contributions
    LENGTH_SCORES = {
        8: 1,    # Minimum acceptable length
        12: 2,   # Better length
        16: 3,   # Good length
        20: 4,   # Excellent length
    }
    
    @staticmethod
    def _has_lowercase(password: str) -> bool:
        """Check if password contains lowercase letters."""
        return bool(re.search(r'[a-z]', password))
    
    @staticmethod
    def _has_uppercase(password: str) -> bool:
        """Check if password contains uppercase letters."""
        return bool(re.search(r'[A-Z]', password))
    
    @staticmethod
    def _has_digits(password: str) -> bool:
        """Check if password contains digits."""
        return bool(re.search(r'\d', password))
    
    @staticmethod
    def _has_special_chars(password: str) -> bool:
        """Check if password contains special characters."""
        return bool(re.search(r'[!@#$%^&*()_+\-=\[\]{};:\'",.<>?/\\|`~]', password))
    
    @staticmethod
    def _calculate_character_variety(password: str) -> int:
        """
        Calculate character variety score.
        
        Returns:
            int: Score from 0 to 4 based on character types present.
        """
        variety_score = 0
        
        if PasswordChecker._has_lowercase(password):
            variety_score += 1
        if PasswordChecker._has_uppercase(password):
            variety_score += 1
        if PasswordChecker._has_digits(password):
            variety_score += 1
        if PasswordChecker._has_special_chars(password):
            variety_score += 1
        
        return variety_score
    
    @staticmethod
    def _calculate_length_score(password: str) -> float:
        """
        Calculate score based on password length.
        
        Returns:
            float: Length-based score component.
        """
        length = len(password)
        
        if length < 8:
            return 0
        elif length < 12:
            return 1
        elif length < 16:
            return 2
        elif length < 20:
            return 3
        else:
            return 4
    
    @staticmethod
    def _get_zxcvbn_data(password: str) -> Dict:
        """
        Get password analysis from zxcvbn library.
        
        Args:
            password (str): Password to analyze.
        
        Returns:
            Dict: zxcvbn analysis result.
        """
        try:
            result = zxcvbn(password)
            return result
        except Exception as e:
            print(f"Error in zxcvbn analysis: {e}")
            return {
                'score': 0,
                'feedback': {'suggestions': []},
                'crack_times_display': {'offline_fast_hashing_1e10_per_second': 'less than a second'}
            }
    
    @staticmethod
    def _format_crack_time(seconds: float) -> str:
        """
        Format crack time in human-readable format.
        
        Args:
            seconds (float): Seconds to crack.
        
        Returns:
            str: Human-readable crack time.
        """
        if seconds < 1:
            return "less than a second"
        elif seconds < 60:
            return f"{int(seconds)} seconds"
        elif seconds < 3600:
            return f"{int(seconds / 60)} minutes"
        elif seconds < 86400:
            return f"{int(seconds / 3600)} hours"
        elif seconds < 2592000:
            return f"{int(seconds / 86400)} days"
        elif seconds < 31536000:
            return f"{int(seconds / 2592000)} months"
        elif seconds < 3153600000:
            return f"{int(seconds / 31536000)} years"
        else:
            return "centuries"
    
    @classmethod
    def evaluate_password(cls, password: str) -> Dict:
        """
        Comprehensive password strength evaluation.
        
        Combines multiple strength metrics to produce a final score and assessment.
        
        Args:
            password (str): Password to evaluate.
        
        Returns:
            Dict: Contains:
                - password: The evaluated password
                - score: 0-4 strength score
                - strength: Human-readable strength label
                - entropy: Shannon entropy value
                - suggestions: List of improvement suggestions
                - estimated_crack_time: Estimated time to crack
        """
        # Calculate individual strength factors
        length_score = cls._calculate_length_score(password)
        variety_score = cls._calculate_character_variety(password)
        entropy = calculate_entropy(password)
        
        # Get zxcvbn analysis for common patterns and crack time
        zxcvbn_result = cls._get_zxcvbn_data(password)
        zxcvbn_score = zxcvbn_result.get('score', 0)
        
        # Extract suggestions from zxcvbn
        suggestions = []
        if 'feedback' in zxcvbn_result:
            feedback = zxcvbn_result['feedback']
            if 'suggestions' in feedback:
                suggestions = feedback['suggestions'][:3]  # Limit to 3 suggestions
        
        # Get estimated crack time from zxcvbn
        crack_time_display = zxcvbn_result.get(
            'crack_times_display',
            {}
        ).get('offline_fast_hashing_1e10_per_second', 'less than a second')
        
        # Calculate final score (0-4)
        # Use weighted combination of factors
        final_score = (
            (length_score * 0.3) +
            (variety_score * 0.4) +
            (zxcvbn_score * 0.3)
        )
        
        # Round to nearest integer (0-4)
        final_score = min(4, max(0, round(final_score)))
        
        # Special case: if very high entropy and good variety, boost score
        if entropy > 60 and variety_score >= 3 and length_score >= 2:
            final_score = 4
        
        # Get strength label
        strength_label = cls.SCORE_THRESHOLDS[final_score][1]
        
        # Check for password breaches (Have I Been Pwned)
        # This is non-blocking: if it fails, we still return the strength assessment
        breach_result = BreachChecker.check_breach(password)
        breach_count = breach_result.get("breach_count", 0)
        
        # If breach check failed due to API error, set to None to indicate unknown status
        if breach_count is None:
            breach_count = 0  # Default to 0 if API unavailable
        
        return {
            "password": password,
            "score": final_score,
            "strength": strength_label,
            "entropy": round(entropy, 2),
            "suggestions": suggestions,
            "estimated_crack_time": crack_time_display,
            "breach_count": breach_count
        }
