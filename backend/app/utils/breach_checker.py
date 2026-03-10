"""
Password breach detection using the Have I Been Pwned API.
Implements k-anonymity model for secure breach checking without exposing full password hash.
"""

import hashlib
import requests
from typing import Dict, Optional


class BreachChecker:
    """
    Check if a password has appeared in known security breaches
    using the Have I Been Pwned Pwned Passwords API.
    
    Uses the k-anonymity model: only the first 5 characters of the SHA-1 hash
    are sent to the API, protecting password privacy.
    """
    
    # Have I Been Pwned API endpoint
    HIBP_API_URL = "https://api.pwnedpasswords.com/range"
    
    # Request timeout in seconds
    REQUEST_TIMEOUT = 5
    
    @staticmethod
    def hash_password(password: str) -> str:
        """
        Generate SHA-1 hash of the password.
        
        Args:
            password (str): The password to hash.
        
        Returns:
            str: SHA-1 hash in uppercase.
        """
        return hashlib.sha1(password.encode()).hexdigest().upper()
    
    @classmethod
    def check_breach(cls, password: str) -> Dict[str, Optional[int]]:
        """
        Check if password appears in known data breaches.
        
        Uses k-anonymity model:
        1. Generate SHA-1 hash of password
        2. Send first 5 characters (prefix) to HIBP API
        3. Receive list of matching hashes (suffixes)
        4. Locally compare if full hash is in the list
        5. Return breach count if found, 0 if safe
        
        Args:
            password (str): The password to check.
        
        Returns:
            Dict: Contains:
                - breach_count (int): Number of times seen in breaches (0 = not found)
                - error (Optional[str]): Error message if check failed
        """
        try:
            # Generate SHA-1 hash
            password_hash = cls.hash_password(password)
            
            # Split hash: first 5 chars (prefix) + remaining (suffix)
            prefix = password_hash[:5]
            suffix = password_hash[5:]
            
            # Request to HIBP API with prefix (k-anonymity)
            response = requests.get(
                f"{cls.HIBP_API_URL}/{prefix}",
                headers={"User-Agent": "PasswordStrengthChecker/1.0"},
                timeout=cls.REQUEST_TIMEOUT
            )
            
            # Check for successful response
            if response.status_code == 200:
                # Parse response: each line contains "SUFFIX:COUNT"
                hashes = (line.split(':') for line in response.text.splitlines())
                
                # Look for matching suffix
                for hash_suffix, count in hashes:
                    if hash_suffix == suffix:
                        # Password found in breach database
                        return {
                            "breach_count": int(count),
                            "error": None
                        }
                
                # Hash not found in breach database
                return {
                    "breach_count": 0,
                    "error": None
                }
            
            elif response.status_code == 404:
                # Prefix not found (password is safe)
                return {
                    "breach_count": 0,
                    "error": None
                }
            
            else:
                # API error
                return {
                    "breach_count": None,
                    "error": f"API returned status code {response.status_code}"
                }
        
        except requests.Timeout:
            # API request timed out
            return {
                "breach_count": None,
                "error": "Breach check timed out. API unavailable."
            }
        
        except requests.ConnectionError:
            # Cannot connect to API
            return {
                "breach_count": None,
                "error": "Cannot connect to breach check service."
            }
        
        except Exception as e:
            # Unexpected error
            return {
                "breach_count": None,
                "error": f"Breach check failed: {str(e)}"
            }
