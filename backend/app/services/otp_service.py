"""
OTP (One-Time Password) service for email verification.
Generates, stores, and validates OTP codes with expiration.
"""

import random
import os
from datetime import datetime, timedelta
from typing import Optional, Dict, Tuple
from app.db.supabase_client import supabase


class OTPService:
    """
    Service for managing OTP codes for email verification.
    
    Stores OTP codes in Supabase with expiration time.
    Supports generation, validation, and cleanup of expired codes.
    """
    
    # OTP expiration time in seconds (5 minutes)
    OTP_EXPIRY_SECONDS = int(os.getenv("OTP_EXPIRY_MINUTES", "5")) * 60
    
    @staticmethod
    def generate_otp() -> str:
        """
        Generate a random 6-digit OTP code.
        
        Returns:
            str: 6-digit OTP code
            
        Example:
            "123456"
        """
        return str(random.randint(100000, 999999))
    
    @staticmethod
    def store_otp(username: str, otp: str) -> bool:
        """
        Store OTP code for user with expiration.
        
        Args:
            username (str): Username to associate with OTP
            otp (str): The OTP code to store
            
        Returns:
            bool: True if stored successfully, False otherwise
            
        Note:
            Stores in Supabase email_otps table.
            Old OTPs for the user are automatically deleted when new one is generated.
        """
        try:
            # Delete any existing OTP for this user (allow only one active OTP)
            try:
                supabase.table("email_otps").delete().eq("username", username).execute()
            except Exception:
                # Ignore error if no existing OTP
                pass
            
            # Calculate expiration time
            expires_at = datetime.utcnow() + timedelta(seconds=OTPService.OTP_EXPIRY_SECONDS)
            
            # Store new OTP
            response = supabase.table("email_otps").insert({
                "username": username,
                "otp_code": otp,
                "expires_at": expires_at.isoformat()
            }).execute()
            
            print(f"✅ OTP stored for user {username}, expires at {expires_at}")
            return True
        
        except Exception as e:
            print(f"❌ ERROR: Failed to store OTP for {username}: {str(e)}")
            return False
    
    @staticmethod
    def verify_otp(username: str, otp: str) -> Tuple[bool, str]:
        """
        Verify OTP code for user.
        
        Args:
            username (str): Username to verify OTP for
            otp (str): OTP code to verify
            
        Returns:
            Tuple[bool, str]: (is_valid, message)
                - (True, "OTP verified successfully") if valid and not expired
                - (False, "Invalid OTP") if doesn't match
                - (False, "OTP expired") if valid but expired
                - (False, "No OTP found") if no OTP stored
                
        Note:
            Automatically deletes OTP after verification (successful or not).
        """
        try:
            # Fetch OTP for this user
            response = (
                supabase.table("email_otps")
                .select("*")
                .eq("username", username)
                .execute()
            )
            
            if not response.data or len(response.data) == 0:
                return False, "No OTP found for this user"
            
            otp_record = response.data[0]
            stored_otp = otp_record.get("otp_code")
            expires_at_str = otp_record.get("expires_at")
            
            # Check if OTP matches (case-sensitive)
            if stored_otp != otp:
                # Delete invalid OTP attempt
                try:
                    supabase.table("email_otps").delete().eq("username", username).execute()
                except Exception:
                    pass
                return False, "Invalid OTP code"
            
            # Check if OTP is expired
            expires_at = datetime.fromisoformat(expires_at_str.replace('Z', '+00:00'))
            if datetime.utcnow() > expires_at:
                # Delete expired OTP
                try:
                    supabase.table("email_otps").delete().eq("username", username).execute()
                except Exception:
                    pass
                return False, "OTP has expired"
            
            # OTP is valid - delete it (one-time use)
            try:
                supabase.table("email_otps").delete().eq("username", username).execute()
            except Exception as e:
                print(f"⚠️  Warning: Failed to delete used OTP: {str(e)}")
            
            return True, "OTP verified successfully"
        
        except Exception as e:
            print(f"❌ ERROR: Failed to verify OTP for {username}: {str(e)}")
            return False, f"Error verifying OTP: {str(e)}"
    
    @staticmethod
    def cleanup_expired_otps() -> int:
        """
        Delete all expired OTP codes from database.
        
        Returns:
            int: Number of expired OTPs deleted
            
        Note:
            Should be called periodically (e.g., in background job).
            Call this in startup event or scheduled task.
        """
        try:
            now = datetime.utcnow().isoformat()
            response = (
                supabase.table("email_otps")
                .delete()
                .lt("expires_at", now)
                .execute()
            )
            deleted_count = len(response.data) if response.data else 0
            if deleted_count > 0:
                print(f"🧹 Cleaned up {deleted_count} expired OTP codes")
            return deleted_count
        
        except Exception as e:
            print(f"⚠️  Warning: Failed to cleanup expired OTPs: {str(e)}")
            return 0
