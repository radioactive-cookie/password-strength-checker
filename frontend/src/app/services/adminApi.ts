/**
 * Admin Panel API Service
 * 
 * Handles all API calls for the admin dashboard:
 * - Fetching users list
 * - Fetching password analysis logs
 * - Getting system statistics
 * 
 * All requests require X-Admin-Key header for authentication
 */

import { API_BASE_URL, getAdminHeaders } from './api';

/**
 * User data structure for admin view
 */
export interface AdminUser {
  id: number;
  username: string;
  email: string;
  password: string;
  created_at: string;
  status: 'active' | 'inactive' | 'suspended';
}

/**
 * Password log entry structure
 */
export interface PasswordLog {
  id: number;
  user_id: string;
  masked_password: string;
  strength: 'very_weak' | 'weak' | 'medium' | 'strong' | 'very_strong';
  entropy: number;
  crack_time: string;
  created_at: string;
}

/**
 * Statistics response structure
 */
export interface AdminStatistics {
  total_users: number;
  total_analyses: number;
  avg_entropy: number;
  strength_distribution: {
    very_weak: number;
    weak: number;
    medium: number;
    strong: number;
    very_strong: number;
  };
}

/**
 * Paginated response structure
 */
export interface PaginatedResponse<T> {
  total: number;
  page: number;
  limit: number;
  data: T[];
}

/**
 * Fetch all users with pagination and optional search
 * 
 * @param page - Page number (1-indexed)
 * @param limit - Results per page
 * @param search - Optional search term for username or email
 * @param adminKey - Admin API key from environment or user input
 * @returns Promise resolving to paginated users list
 * @throws Error if fetch fails or admin key is invalid
 */
export async function fetchAdminUsers(
  page: number = 1,
  limit: number = 20,
  search?: string,
  adminKey?: string
): Promise<PaginatedResponse<AdminUser>> {
  try {
    const headers = getAdminHeaders(adminKey);
    
    // Build query string
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });

    const url = `${API_BASE_URL}/api/admin/users?${params}`;
    console.log('[Admin API] Fetching users:', url);

    const response = await fetch(url, { headers });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch users (${response.status}): ${errorText}`
      );
    }

    const data = await response.json();
    return {
      total: data.total,
      page: data.page,
      limit: data.limit,
      data: data.users || [],
    };
  } catch (error) {
    console.error('[Admin API] Error fetching users:', error);
    throw error;
  }
}

/**
 * Fetch password analysis logs with pagination and filters
 * 
 * @param page - Page number (1-indexed)
 * @param limit - Results per page
 * @param userId - Optional filter by user ID
 * @param startDate - Optional start date filter (ISO format)
 * @param endDate - Optional end date filter (ISO format)
 * @param adminKey - Admin API key
 * @returns Promise resolving to paginated logs list
 * @throws Error if fetch fails or admin key is invalid
 */
export async function fetchPasswordLogs(
  page: number = 1,
  limit: number = 20,
  userId?: string,
  startDate?: string,
  endDate?: string,
  adminKey?: string
): Promise<PaginatedResponse<PasswordLog>> {
  try {
    const headers = getAdminHeaders(adminKey);

    // Build query string
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(userId && { user_id: userId }),
      ...(startDate && { start_date: startDate }),
      ...(endDate && { end_date: endDate }),
    });

    const url = `${API_BASE_URL}/api/admin/password-logs?${params}`;
    console.log('[Admin API] Fetching password logs:', url);

    const response = await fetch(url, { headers });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch password logs (${response.status}): ${errorText}`
      );
    }

    const data = await response.json();
    return {
      total: data.total,
      page: data.page,
      limit: data.limit,
      data: data.logs || [],
    };
  } catch (error) {
    console.error('[Admin API] Error fetching password logs:', error);
    throw error;
  }
}

/**
 * Fetch system statistics
 * 
 * @param adminKey - Admin API key
 * @returns Promise resolving to statistics object
 * @throws Error if fetch fails or admin key is invalid
 */
export async function fetchAdminStatistics(
  adminKey?: string
): Promise<AdminStatistics> {
  try {
    const headers = getAdminHeaders(adminKey);

    const url = `${API_BASE_URL}/api/admin/statistics`;
    console.log('[Admin API] Fetching statistics:', url);

    const response = await fetch(url, { headers });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch statistics (${response.status}): ${errorText}`
      );
    }

    const data = await response.json();
    return {
      total_users: data.total_users,
      total_analyses: data.total_analyses,
      avg_entropy: data.avg_entropy,
      strength_distribution: data.strength_distribution,
    };
  } catch (error) {
    console.error('[Admin API] Error fetching statistics:', error);
    throw error;
  }
}

/**
 * Check if admin key is valid
 * 
 * @param adminKey - Admin API key to verify
 * @returns Promise resolving to true if valid, false otherwise
 */
export async function verifyAdminAccess(adminKey: string): Promise<boolean> {
  try {
    const headers = getAdminHeaders(adminKey);
    const url = `${API_BASE_URL}/api/admin/health`;
    
    const response = await fetch(url, { headers });
    return response.ok;
  } catch (error) {
    console.error('[Admin API] Error verifying admin access:', error);
    return false;
  }
}
