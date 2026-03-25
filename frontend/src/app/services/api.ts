/**
 * SecurePass API Service
 * Configure your FastAPI backend URL via the VITE_API_URL environment variable.
 */

const RAW_API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://password-strength-checker-5-vbg8.onrender.com";

// Remove trailing slash if present (prevents //api issues)
const API_BASE_URL = RAW_API_BASE.replace(/\/+$/, "");

console.log("[API] Base URL:", API_BASE_URL);

export type StrengthLevel =
  | "very_weak"
  | "weak"
  | "medium"
  | "strong"
  | "very_strong";

export interface PasswordCheckResult {
  password: string;
  score: number;
  strength: string;
  entropy: number;
  suggestions: string[];
  estimated_crack_time: string;
  breach_count: number;
}

async function post<T>(path: string, body: object): Promise<T> {
  try {
    const fullUrl = `${API_BASE_URL}${path}`;
    console.log(`[API] POST request to: ${fullUrl}`);

    const res = await fetch(fullUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`[API] Response error (${res.status}):`, text);
      throw new Error(`Request to ${path} failed (${res.status}): ${text}`);
    }

    const data = (await res.json()) as T;
    console.log(`[API] Response success:`, data);
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
      console.error(
        "[API] Network error - Backend may not be reachable at",
        API_BASE_URL
      );
      throw new Error(
        `Unable to connect to backend at ${API_BASE_URL}. Check if Render service is live.`
      );
    }
    throw error;
  }
}

async function get<T>(path: string): Promise<T> {
  const fullUrl = `${API_BASE_URL}${path}`;
  console.log(`[API] GET request to: ${fullUrl}`);

  const res = await fetch(fullUrl);

  if (!res.ok) {
    const text = await res.text();
    console.error(`[API] GET error (${res.status}):`, text);
    throw new Error(`Request to ${path} failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<T>;
}

export const api = {};

/**
 * Check password strength
 */
export const checkPassword = (
  password: string,
  username?: string
): Promise<PasswordCheckResult> => {
  const body: { password: string; username?: string } = { password };
  if (username) {
    body.username = username;
  }
  return post<PasswordCheckResult>("/api/check-password", body);
};

/**
 * Fetch password history
 */
export interface PasswordHistoryItem {
  id: string;
  username: string;
  strength: number;
  entropy: number;
  crack_time: string;
  created_at: string;
}

export const getPasswordHistory = async (
  username: string
): Promise<PasswordHistoryItem[]> => {
  const response = await get<{
    username: string;
    history: PasswordHistoryItem[];
  }>(`/api/history?username=${encodeURIComponent(username)}`);

  return response.history || [];
};

// ───────────────────────────────────────────────
// Client-side fallback strength calculation
// ───────────────────────────────────────────────
export function clientSideStrength(password: string): {
  strength: StrengthLevel;
  score: number;
} {
  if (!password) return { strength: "very_weak", score: 0 };

  let score = 0;

  if (password.length >= 8) score += 15;
  if (password.length >= 12) score += 15;
  if (password.length >= 16) score += 15;
  if (password.length >= 20) score += 5;

  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^a-zA-Z0-9]/.test(password)) score += 15;

  score = Math.min(score, 100);

  let strength: StrengthLevel;
  if (score < 20) strength = "very_weak";
  else if (score < 40) strength = "weak";
  else if (score < 60) strength = "medium";
  else if (score < 80) strength = "strong";
  else strength = "very_strong";

  return { strength, score };
}

// ───────────────────────────────────────────────
// AUTH
// ───────────────────────────────────────────────

export interface RegisterResponse {
  id: number;
  username: string;
  email?: string;
  created_at?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    username: string;
    email?: string;
  };
}

export const registerUser = (
  username: string,
  password: string,
  email?: string
): Promise<RegisterResponse> => {
  return post<RegisterResponse>("/auth/register", {
    username,
    password,
    email,
  });
};

export const loginUser = (
  username: string,
  password: string
): Promise<LoginResponse> => {
  return post<LoginResponse>("/auth/login", {
    username,
    password,
  });
};
