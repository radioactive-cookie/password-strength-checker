"""
Test script to verify both bug fixes:
1. Email validation during registration
2. Password history storage functionality
"""

import requests
import json
from typing import Dict, Any
import time

BASE_URL = "http://localhost:8000"

# Color codes for terminal output
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
BLUE = "\033[94m"
RESET = "\033[0m"
BOLD = "\033[1m"


def print_header(text: str):
    """Print a formatted header."""
    print(f"\n{BOLD}{BLUE}{'='*70}{RESET}")
    print(f"{BOLD}{BLUE}{text}{RESET}")
    print(f"{BOLD}{BLUE}{'='*70}{RESET}")


def print_success(text: str):
    """Print success message."""
    print(f"{GREEN}✓ {text}{RESET}")


def print_error(text: str):
    """Print error message."""
    print(f"{RED}✗ {text}{RESET}")


def print_info(text: str):
    """Print info message."""
    print(f"{BLUE}ℹ {text}{RESET}")


def print_json(data: Any, indent: int = 2):
    """Pretty print JSON data."""
    print(json.dumps(data, indent=indent, default=str))


def test_invalid_email_registration():
    """Test that invalid emails are rejected during registration."""
    print_header("TEST 1: Invalid Email Validation")
    
    # Test 1.1: Invalid email format
    print_info("Testing invalid email format...")
    user_data = {
        "username": "testuser_invalid_email_1",
        "password": "SecurePassword123!",
        "email": "not_an_email"  # Invalid email
    }
    
    response = requests.post(f"{BASE_URL}/auth/register", json=user_data)
    
    if response.status_code == 422:  # Pydantic validation error
        print_success(f"Invalid email correctly rejected (Status: {response.status_code})")
        print_json(response.json())
        return True
    else:
        print_error(f"Invalid email not rejected (Status: {response.status_code})")
        print_json(response.json())
        return False


def test_valid_email_registration():
    """Test that valid emails are accepted during registration."""
    print_header("TEST 2: Valid Email Registration")
    
    # Test 2.1: Valid email format
    print_info("Testing valid email format...")
    user_data = {
        "username": "testuser_valid_email_1",
        "password": "SecurePassword123!",
        "email": "user@example.com"  # Valid email
    }
    
    response = requests.post(f"{BASE_URL}/auth/register", json=user_data)
    
    if response.status_code == 201:
        print_success(f"Valid email correctly accepted (Status: {response.status_code})")
        data = response.json()
        print_json(data)
        return True
    else:
        print_error(f"Valid email registration failed (Status: {response.status_code})")
        print_json(response.json())
        return False


def test_password_history_storage():
    """Test that password history is stored correctly."""
    print_header("TEST 3: Password History Storage")
    
    # First register a user
    print_info("Registering user for history test...")
    username = f"historytest_{int(time.time())}"
    user_data = {
        "username": username,
        "password": "SecurePassword123!",
        "email": f"{username}@example.com"
    }
    
    response = requests.post(f"{BASE_URL}/auth/register", json=user_data)
    
    if response.status_code != 201:
        print_error(f"Registration failed (Status: {response.status_code})")
        return False
    
    print_success(f"User registered: {username}")
    
    # Now check a password with the username (which should store it)
    print_info("Checking password to store in history...")
    password_data = {
        "password": "TestPassword123!@#",
        "username": username
    }
    
    response = requests.post(f"{BASE_URL}/api/check-password", json=password_data)
    
    if response.status_code != 200:
        print_error(f"Password check failed (Status: {response.status_code})")
        print_json(response.json())
        return False
    
    print_success(f"Password checked (Status: {response.status_code})")
    print_json(response.json())
    
    # Wait a moment for the database to process
    time.sleep(1)
    
    # Now retrieve the history
    print_info("Retrieving password history...")
    response = requests.get(f"{BASE_URL}/api/user-history?username={username}")
    
    if response.status_code != 200:
        print_error(f"History retrieval failed (Status: {response.status_code})")
        print_json(response.json())
        return False
    
    data = response.json()
    print_success(f"History retrieved (Status: {response.status_code})")
    print_json(data)
    
    # Check if the history contains the password we just checked
    if data.get("history") and len(data["history"]) > 0:
        print_success(f"Password history contains {len(data['history'])} entries")
        print_json(data["history"][0])
        return True
    else:
        print_error("No password history found")
        return False


def test_login_with_valid_credentials():
    """Test that login still works with valid credentials."""
    print_header("TEST 4: Login with Valid Credentials")
    
    # Register a new user
    print_info("Registering test user...")
    username = f"logintest_{int(time.time())}"
    password = "SecurePassword123!"
    user_data = {
        "username": username,
        "password": password,
        "email": f"{username}@example.com"
    }
    
    response = requests.post(f"{BASE_URL}/auth/register", json=user_data)
    
    if response.status_code != 201:
        print_error(f"Registration failed (Status: {response.status_code})")
        return False
    
    print_success(f"User registered: {username}")
    
    # Try to login
    print_info("Attempting login...")
    credentials = {
        "username": username,
        "password": password
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=credentials)
    
    if response.status_code == 200:
        data = response.json()
        if data.get("success"):
            print_success(f"Login successful (Status: {response.status_code})")
            print_json(data)
            return True
        else:
            print_error("Login returned non-success response")
            print_json(data)
            return False
    else:
        print_error(f"Login failed (Status: {response.status_code})")
        print_json(response.json())
        return False


def run_all_tests():
    """Run all tests and report results."""
    print(f"\n{BOLD}Password Strength Checker - Bug Fix Tests{RESET}")
    print(f"{BOLD}Connecting to: {BASE_URL}{RESET}")
    
    results = {
        "Invalid Email Validation": test_invalid_email_registration(),
        "Valid Email Registration": test_valid_email_registration(),
        "Password History Storage": test_password_history_storage(),
        "Login with Valid Credentials": test_login_with_valid_credentials()
    }
    
    # Print summary
    print_header("TEST SUMMARY")
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = f"{GREEN}PASSED{RESET}" if result else f"{RED}FAILED{RESET}"
        print(f"{test_name}: {status}")
    
    print(f"\n{BOLD}Total: {passed}/{total} tests passed{RESET}\n")
    
    return passed == total


if __name__ == "__main__":
    success = run_all_tests()
    exit(0 if success else 1)
