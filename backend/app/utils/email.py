"""
Email utility for sending OTP verification codes.
Supports SMTP (Gmail) and test/mock mode.
"""

import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional


class EmailService:
    """
    Email service for sending verification codes via SMTP.
    
    Supports multiple SMTP providers:
    - Gmail (requires app password)
    - Other SMTP servers (configure in environment)
    
    For development/testing, set ENABLE_EMAIL=False to use mock mode.
    """
    
    # Configuration from environment variables
    ENABLE_EMAIL = os.getenv("ENABLE_EMAIL", "False").lower() == "true"
    SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
    SENDER_EMAIL = os.getenv("SENDER_EMAIL", "")
    SENDER_PASSWORD = os.getenv("SENDER_PASSWORD", "")
    
    @staticmethod
    def send_otp_email(email: str, username: str, otp: str) -> bool:
        """
        Send OTP verification email to user.
        
        Args:
            email (str): Recipient email address
            username (str): Username for personalization
            otp (str): 6-digit OTP code
            
        Returns:
            bool: True if email sent successfully, False otherwise
            
        Note:
            If ENABLE_EMAIL=False, logs OTP to console for testing.
            In production, ensure SMTP credentials are set in environment.
        """
        if not email:
            print(f"⚠️  Warning: No email provided for user {username}")
            return False
        
        # In development/testing, just print the OTP
        if not EmailService.ENABLE_EMAIL:
            print(f"[EMAIL TEST MODE] OTP for {username} ({email}): {otp}")
            return True
        
        # Production: send via SMTP
        try:
            # Validate SMTP credentials
            if not EmailService.SENDER_EMAIL or not EmailService.SENDER_PASSWORD:
                print(
                    f"❌ ERROR: Email credentials not set. "
                    f"Set SENDER_EMAIL and SENDER_PASSWORD in .env file."
                )
                return False
            
            # Compose email
            subject = "Verify Your SecurePass Account"
            
            body_html = f"""
            <html>
                <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                    <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <h2 style="color: #00c8ff; text-align: center;">SecurePass - Email Verification</h2>
                        
                        <p>Hello <strong>{username}</strong>,</p>
                        
                        <p>Thank you for signing up for SecurePass! To complete your registration, please verify your email address with the code below:</p>
                        
                        <div style="background: #f0f0f0; border-left: 4px solid #00c8ff; padding: 20px; margin: 20px 0; text-align: center;">
                            <p style="font-size: 14px; color: #666;">Verification Code</p>
                            <p style="font-size: 32px; font-weight: bold; color: #00c8ff; letter-spacing: 2px; margin: 10px 0;">{otp}</p>
                            <p style="font-size: 12px; color: #999;">This code expires in 5 minutes</p>
                        </div>
                        
                        <p><strong>How to verify your email:</strong></p>
                        <ol>
                            <li>Go back to the verification page</li>
                            <li>Enter the code: <strong>{otp}</strong></li>
                            <li>Click "Verify Email"</li>
                        </ol>
                        
                        <p style="color: #666; font-size: 12px; margin-top: 30px;">
                            <strong>Security Note:</strong> Never share this code with anyone. 
                            SecurePass support will never ask for this code.
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        
                        <p style="text-align: center; color: #999; font-size: 12px;">
                            © 2024 SecurePass. All rights reserved.
                        </p>
                    </div>
                </body>
            </html>
            """
            
            # Create message
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = EmailService.SENDER_EMAIL
            message["To"] = email
            
            # Attach HTML body
            part = MIMEText(body_html, "html")
            message.attach(part)
            
            # Send email via SMTP
            with smtplib.SMTP(EmailService.SMTP_SERVER, EmailService.SMTP_PORT) as server:
                server.starttls()  # Encrypt connection
                server.login(EmailService.SENDER_EMAIL, EmailService.SENDER_PASSWORD)
                server.send_message(message)
            
            print(f"✅ OTP email sent successfully to {email} for user {username}")
            return True
        
        except smtplib.SMTPAuthenticationError:
            print(
                f"❌ ERROR: SMTP authentication failed. "
                f"Check SENDER_EMAIL and SENDER_PASSWORD in .env (Gmail requires app password, not regular password)"
            )
            return False
        
        except smtplib.SMTPException as e:
            print(f"❌ ERROR: Failed to send email to {email}: {str(e)}")
            return False
        
        except Exception as e:
            print(f"❌ ERROR: Unexpected error sending email: {str(e)}")
            return False
