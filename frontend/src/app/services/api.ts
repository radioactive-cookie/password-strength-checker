/**
 * SecurePass API Service
 * Configure your FastAPI backend URL via the VITE_API_URL environment variable.
 * Default: http://localhost:8000
 *
 * Expected endpoints:
 *   POST /api/check-password — { password: string } → PasswordCheckResult
 */

const API_BASE_URL =
  (import.meta as unknown as { env: Record<string, string> }).env?.VITE_API_URL ||
  "https://password-strength-checker-6-5j06.onrender.com/analyze";

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
    
    const data = await res.json() as T;
    console.log(`[API] Response success:`, data);
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
      console.error("[API] Network error - Backend may not be running at", API_BASE_URL);
      throw new Error(`Unable to connect to the password analysis server at ${API_BASE_URL}. Please ensure the backend is running.`);
    }
    throw error;
  }
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request to ${path} failed (${res.status}): ${text}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  // No longer needed - checkPassword includes all data
};

/**
 * Check password strength with integrated breach detection
 * Calls the backend /api/check-password endpoint that combines:
 * - Password strength analysis
 * - Shannon entropy calculation
 * - Estimated crack time
 * - Have I Been Pwned breach detection
 * 
 * @param password - The password to check
 * @returns Promise with strength analysis and breach status
 */
export const checkPassword = (password: string): Promise<PasswordCheckResult> => {
  return post<PasswordCheckResult>("/api/check-password", { password });
};

// ───────────────────────────────────────────────
// Client-side fallback strength calculation
// Used for real-time bar updates while the user types
// ───────────────────────────────────────────────
export function clientSideStrength(password: string): {
  strength: StrengthLevel;
  score: number;
} {
  if (!password) return { strength: "very_weak", score: 0 };

  let score = 0;

  // Length scoring
  if (password.length >= 8) score += 15;
  if (password.length >= 12) score += 15;
  if (password.length >= 16) score += 15;
  if (password.length >= 20) score += 5;

  // Character set scoring
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
