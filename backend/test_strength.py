#!/usr/bin/env python3
import sys
sys.path.insert(0, "e:\\KIIT_2430110\\SELF DEV\\Password_Strength_Checker\\backend")

from app.services.password_checker import PasswordChecker

# Test a variety of passwords
test_passwords = [
    "12345",           # Very simple, should be Very Weak
    "password",        # Common password, should be Weak
    "Password1",       # Medium complexity
    "Pass@word123",    # Good complexity
    "MyC0mpl3x!P@ssw0rd789", # Very complex
]

print("Password Strength Test Results:\n")
for pwd in test_passwords:
    result = PasswordChecker.evaluate_password(pwd)
    print(f"Password: {pwd[:20]}")
    print(f"  Score: {result['score']}/4")
    print(f"  Strength: {result['strength']}")
    print(f"  Entropy: {result['entropy']} bits")
    print(f"  Crack Time: {result['estimated_crack_time']}")
    print()
