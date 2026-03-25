import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, registerUser, verifyEmail, LoginResponse, RegisterResponse, VerifyEmailResponse } from '../services/api';

export interface User {
  id: number;
  username: string;
  email?: string;
  is_verified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  requiresVerification: boolean;
  verificationEmail: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, email?: string) => Promise<boolean>;
  verifyEmail: (username: string, otp: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);

  // Restore user from localStorage on mount (only user info, never passwords)
  useEffect(() => {
    const stored = localStorage.getItem('securepass_user');
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        setUser(userData as User);
      } catch {
        localStorage.removeItem('securepass_user');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Call backend API for authentication
      // Password is hashed on the server, never stored in plaintext
      const response: LoginResponse = await loginUser(username, password);

      if (response.success && response.user) {
        // Check if email verification is required
        if (response.user.email && response.user.is_verified === false) {
          setRequiresVerification(true);
          setVerificationEmail(response.user.email);
          setError(null);
          setIsLoading(false);
          return false;
        }

        // Store only user info (id, username, email)
        // Never store password or hash
        const userData: User = {
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
          is_verified: response.user.is_verified ?? true,
        };

        setUser(userData);
        setRequiresVerification(false);
        setVerificationEmail(null);
        // Only store user data, not credentials
        localStorage.setItem('securepass_user', JSON.stringify(userData));
        setIsLoading(false);
        return true;
      }

      setError('Invalid username or password');
      setIsLoading(false);
      return false;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Authentication failed. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (
    username: string,
    password: string,
    email?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // Username validation
      if (!username || username.length < 3) {
        setError('Username must be at least 3 characters');
        setIsLoading(false);
        return false;
      }

      // Password validation (minimum 8 characters required by backend)
      if (!password || password.length < 8) {
        setError('Password must be at least 8 characters');
        setIsLoading(false);
        return false;
      }

      // Call backend API for registration
      // Password is hashed on the server before storage
      const response: RegisterResponse = await registerUser(username, password, email);

      if (response && response.success && response.user) {
        // Check if email verification is required
        if (response.requires_verification && response.verification_sent_to) {
          // Don't auto-login - user needs to verify email first
          setRequiresVerification(true);
          setVerificationEmail(response.verification_sent_to);
          setUser(null); // Don't set user until verified
          localStorage.removeItem('securepass_user');
          setIsLoading(false);
          return true; // Registration successful, but requires verification
        }

        // No verification required - auto-login
        const userData: User = {
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
          is_verified: true,
        };

        setUser(userData);
        setRequiresVerification(false);
        setVerificationEmail(null);
        // Only store user data, not credentials
        localStorage.setItem('securepass_user', JSON.stringify(userData));
        setIsLoading(false);
        return true;
      }

      setError('Registration failed. Please try again.');
      setIsLoading(false);
      return false;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  const verifyUserEmail = async (username: string, otp: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response: VerifyEmailResponse = await verifyEmail(username, otp);

      if (response.success && response.verified) {
        // Email verified successfully - now login the user
        // We need to call login to get the full user data
        const userData: User = {
          id: 0, // Will be set from login
          username: username,
          email: verificationEmail || undefined,
          is_verified: true,
        };

        setUser(userData);
        setRequiresVerification(false);
        setVerificationEmail(null);
        localStorage.setItem('securepass_user', JSON.stringify(userData));
        setIsLoading(false);
        return true;
      }

      setError('Email verification failed. Please check the code and try again.');
      setIsLoading(false);
      return false;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Email verification failed. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    setRequiresVerification(false);
    setVerificationEmail(null);
    localStorage.removeItem('securepass_user');
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        error,
        requiresVerification,
        verificationEmail,
        login,
        register,
        verifyEmail: verifyUserEmail,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
