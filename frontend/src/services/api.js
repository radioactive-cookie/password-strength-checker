/**
 * API Service for Password Strength Checker
 * Handles all HTTP requests to the backend FastAPI server
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * Check password strength with real-time analysis
 * 
 * Sends the password to the backend API for comprehensive evaluation including:
 * - Strength score (0-4)
 * - Entropy calculation
 * - Estimated crack time
 * - Password breach detection (Have I Been Pwned)
 * - Improvement suggestions
 * 
 * @param {string} password - The password to check
 * @returns {Promise<Object>} Password strength result with metrics
 * @throws {Error} If API request fails
 */
export const checkPassword = async (password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/check-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `API Error: ${response.status} ${response.statusText}`
      );
    }

    // Return parsed JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    // Log error for debugging
    console.error("Password check error:", error);
    
    // Re-throw with user-friendly message
    throw new Error(
      error.message || "Failed to check password. Please try again."
    );
  }
};

/**
 * Health check endpoint for API status verification
 * 
 * @returns {Promise<Object>} Health check status
 */
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Health check error:", error);
    throw error;
  }
};
