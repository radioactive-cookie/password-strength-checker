import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, registerUser, LoginResponse, RegisterResponse } from '../services/api';

export interface User {
  id: number;
  username: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, email?: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        // Store only user info (id, username, email)
        // Never store password or hash
        const userData: User = {
          id: response.user.id,
          username: response.user.username,
          email: response.user.email,
        };

        setUser(userData);
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

      if (response && response.id) {
        // Store only user info after successful registration
        const userData: User = {
          id: response.id,
          username: response.username,
          email: response.email,
        };

        setUser(userData);
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

  const logout = () => {
    setUser(null);
    setError(null);
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
        login,
        register,
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
