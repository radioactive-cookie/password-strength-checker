"""
Test script for the secure password storage implementation.
Tests registration, login, and password verification.
"""

import requests
import json
from typing import Dict, Any

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


def test_registration():
    """Test user registration with valid and invalid data."""
    print_header("TEST 1: User Registration")
    
    # Test 1.1: Valid registration
    print_info("Testing valid registration...")
    user_data = {
        "username": "testuser123",
        "password": "SecurePassword123!",
        "email": "test@example.com"
    }
    
    response = requests.post(f"{BASE_URL}/auth/register", json=user_data)
    
    if response.status_code == 201:
        print_success(f"User registered successfully (Status: {response.status_code})")
        data = response.json()
        print(f"  - User ID: {data.get('id')}")
        print(f"  - Username: {data.get('username')}")
        print(f"  - Email: {data.get('email')}")
        return True
    else:
        print_error(f"Registration failed (Status: {response.status_code})")
        print_json(response.json())
        return False


def test_duplicate_registration(username: str = "testuser123"):
    """Test that duplicate usernames are rejected."""
    print_header("TEST 2: Duplicate Username Prevention")
    
    print_info(f"Attempting to register duplicate username: {username}")
    user_data = {
        "username": username,
        "password": "DifferentPassword456!",
        "email": "different@example.com"
    }
    
    response = requests.post(f"{BASE_URL}/auth/register", json=user_data)
    
    if response.status_code == 400:
        print_success(f"Duplicate registration correctly rejected (Status: {response.status_code})")
        error = response.json()
        print(f"  - Error: {error.get('detail')}")
        return True
    else:
        print_error(f"Duplicate registration not rejected (Status: {response.status_code})")
        print_json(response.json())
        return False


def test_login(username: str = "testuser123", password: str = "SecurePassword123!"):
    """Test user login with correct password."""
    print_header("TEST 3: User Login (Correct Password)")
    
    print_info(f"Logging in as: {username}")
    credentials = {
        "username": username,
        "password": password
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=credentials)
    
    if response.status_code == 200:
        data = response.json()
        if data.get("success"):
            print_success(f"Login successful (Status: {response.status_code})")
            user = data.get("user", {})
            print(f"  - User: {user.get('username')}")
            print(f"  - Email: {user.get('email')}")
            return True
        else:
            print_error("Login returned non-success response")
            print_json(response.json())
            return False
    else:
        print_error(f"Login failed (Status: {response.status_code})")
        print_json(response.json())
        return False


def test_wrong_password(username: str = "testuser123"):
    """Test login rejection with wrong password."""
    print_header("TEST 4: Login (Wrong Password)")
    
    print_info(f"Attempting login with wrong password for: {username}")
    credentials = {
        "username": username,
        "password": "WrongPassword789@"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=credentials)
    
    if response.status_code == 401:
        print_success(f"Wrong password correctly rejected (Status: {response.status_code})")
        error = response.json()
        print(f"  - Error: {error.get('detail')}")
        return True
    else:
        print_error(f"Wrong password not rejected (Status: {response.status_code})")
        print_json(response.json())
        return False


def test_nonexistent_user():
    """Test login with non-existent username."""
    print_header("TEST 5: Login (Non-existent User)")
    
    print_info("Attempting login with non-existent username")
    credentials = {
        "username": "nonexistentuser999",
        "password": "SomePassword123!"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=credentials)
    
    if response.status_code == 401:
        print_success(f"Non-existent user correctly rejected (Status: {response.status_code})")
        error = response.json()
        print(f"  - Error: {error.get('detail')}")
        return True
    else:
        print_error(f"Non-existent user not rejected (Status: {response.status_code})")
        print_json(response.json())
        return False


def test_verify_password(username: str = "testuser123", password: str = "SecurePassword123!"):
    """Test password verification endpoint."""
    print_header("TEST 6: Password Verification")
    
    print_info(f"Verifying password for: {username}")
    response = requests.post(
        f"{BASE_URL}/auth/verify-password",
        params={"username": username, "password": password}
    )
    
    if response.status_code == 200:
        data = response.json()
        if data.get("verified"):
            print_success(f"Password verification successful (Status: {response.status_code})")
            print(f"  - Verified: {data.get('verified')}")
            return True
        else:
            print_error("Password verification failed")
            print_json(response.json())
            return False
    else:
        print_error(f"Verification request failed (Status: {response.status_code})")
        print_json(response.json())
        return False


def test_user_count():
    """Test user count endpoint."""
    print_header("TEST 7: Get User Count")
    
    response = requests.get(f"{BASE_URL}/auth/users/count")
    
    if response.status_code == 200:
        data = response.json()
        count = data.get("total_users", 0)
        print_success(f"Retrieved user count: {count}")
        return True
    else:
        print_error(f"Failed to get user count (Status: {response.status_code})")
        print_json(response.json())
        return False


def test_invalid_inputs():
    """Test with invalid input data."""
    print_header("TEST 8: Input Validation")
    
    tests_passed = 0
    tests_total = 0
    
    # Test 8.1: Too short username
    print_info("Testing username too short (< 3 characters)...")
    tests_total += 1
    response = requests.post(
        f"{BASE_URL}/auth/register",
        json={"username": "ab", "password": "ValidPass123!", "email": "test@ex.com"}
    )
    if response.status_code == 422:  # Validation error
        print_success("Short username correctly rejected")
        tests_passed += 1
    else:
        print_error(f"Short username not rejected (Status: {response.status_code})")
    
    # Test 8.2: Too short password
    print_info("Testing password too short (< 8 characters)...")
    tests_total += 1
    response = requests.post(
        f"{BASE_URL}/auth/register",
        json={"username": "newuser", "password": "Short1!", "email": "test@ex.com"}
    )
    if response.status_code == 422:  # Validation error
        print_success("Short password correctly rejected")
        tests_passed += 1
    else:
        print_error(f"Short password not rejected (Status: {response.status_code})")
    
    # Test 8.3: Invalid characters in username
    print_info("Testing invalid characters in username...")
    tests_total += 1
    response = requests.post(
        f"{BASE_URL}/auth/register",
        json={"username": "invalid@user", "password": "ValidPass123!", "email": "test@ex.com"}
    )
    if response.status_code == 422:  # Validation error
        print_success("Invalid username characters correctly rejected")
        tests_passed += 1
    else:
        print_error(f"Invalid characters not rejected (Status: {response.status_code})")
    
    return tests_passed == tests_total


def main():
    """Run all tests."""
    print_header("SECURE PASSWORD STORAGE - TEST SUITE")
    
    print_info("Make sure the FastAPI server is running at http://localhost:8000")
    print_info("Run: python -m uvicorn app.main:app --reload")
    
    try:
        # Connection test
        response = requests.get(f"{BASE_URL}/", timeout=3)
        print_success("Connected to API successfully\n")
    except requests.exceptions.ConnectionError:
        print_error("Cannot connect to FastAPI server at http://localhost:8000")
        print_info("Please start the server first:")
        print_info("  cd backend")
        print_info("  python -m uvicorn app.main:app --reload")
        return
    except Exception as e:
        print_error(f"Unexpected error: {e}")
        return
    
    # Run tests
    results = {
        "Registration": test_registration(),
        "Duplicate Prevention": test_duplicate_registration(),
        "Login (Correct)": test_login(),
        "Login (Wrong Password)": test_wrong_password(),
        "Login (Non-existent)": test_nonexistent_user(),
        "Password Verification": test_verify_password(),
        "User Count": test_user_count(),
        "Input Validation": test_invalid_inputs(),
    }
    
    # Summary
    print_header("TEST SUMMARY")
    
    total = len(results)
    passed = sum(1 for v in results.values() if v)
    
    for test_name, result in results.items():
        status = f"{GREEN}PASSED{RESET}" if result else f"{RED}FAILED{RESET}"
        symbol = "✓" if result else "✗"
        print(f"{symbol} {test_name}: {status}")
    
    print(f"\n{BOLD}Total: {passed}/{total} tests passed{RESET}\n")
    
    if passed == total:
        print_success("All tests passed! Secure password storage is working correctly.")
    else:
        print_error(f"{total - passed} test(s) failed. Check the implementation.")


if __name__ == "__main__":
    main()
