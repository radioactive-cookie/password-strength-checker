# Admin Dashboard Implementation Guide

## Overview
This document provides complete setup and usage instructions for the new Admin Dashboard feature for the Password Strength Checker website.

## Files Created

### Backend
- **`backend/app/routes/admin.py`** - Admin API endpoints with authentication
- **Update: `backend/app/main.py`** - Included admin router

### Frontend
- **`frontend/src/app/pages/AdminPage.tsx`** - Complete admin dashboard component
- **`frontend/src/app/services/adminApi.ts`** - Admin API service with type definitions
- **Update: `frontend/src/app/Root.tsx`** - Added admin route
- **Update: `frontend/src/app/services/api.ts`** - Added `getAdminHeaders()` and exported `API_BASE_URL`

## Setup Instructions

### 1. Backend Configuration

#### Set Admin Key Environment Variable

Add this to your `.env` file (or environment variables):

```env
# Admin Dashboard
ADMIN_KEY=your-secure-admin-key-here-change-this-in-production
```

**Security Note:** In production, use a strong, random key (minimum 32 characters):
```bash
# Generate a secure random key (on Unix/Linux/Mac):
openssl rand -hex 32

# Or use Python:
python -c "import secrets; print(secrets.token_hex(32))"
```

#### CORS Considerations
The admin endpoints are already included in CORS settings since they use the same API base URL. No additional configuration needed.

### 2. Frontend Configuration

#### Environment Variables (`.env.local`)

```env
# Admin panel admin key (set the frontend key to match backend)
VITE_ADMIN_KEY=your-secure-admin-key-here-change-this-in-production
VITE_API_URL=https://your-backend-url.com
```

**Note:** You can leave `VITE_ADMIN_KEY` empty or omitted - the admin panel will request it via a login form.

### 3. Database Requirements

#### Verify Supabase Tables

Ensure these tables exist in your Supabase project:

1. **`users` table**
   - Required columns: `id`, `username`, `email`, `created_at`

2. **`password_logs` table**
   - Required columns: `id`, `user_id`, `masked_password`, `strength`, `entropy`, `crack_time`, `created_at`

No schema changes needed - the admin panel only reads from existing tables.

## Usage

### Accessing the Admin Page

1. **Login first**: Navigate to `/login` and authenticate with your user account
2. **Access admin page**: Go to `http://localhost:5173/supabase/admin` (or your deployed URL)
3. **Enter admin key**: You'll see an authentication screen requesting your admin key
4. **Authenticate**: Enter the admin key set in your environment variables
5. **View dashboard**: You'll now see the admin dashboard with three tabs:

### Admin Dashboard Tabs

#### 1. **Dashboard Tab**
- **Statistics Cards**: Total users, total analyses, average entropy, bits per character
- **Strength Distribution**: Visual breakdown of password strength categories (very weak to very strong)
- All statistics auto-refresh on page load

#### 2. **Users Tab**
- **User List**: Table showing all registered users with columns:
  - ID
  - Username
  - Email
  - Created At (date)
- **Search/Filter**: Search by username or email in real-time
- **Pagination**: Navigate through users (20 per page, max 100)
- **Refresh**: Manual refresh button to reload data

#### 3. **Logs Tab**
- **Password Logs**: Table showing all password analyses with columns:
  - ID
  - User ID
  - Masked Password (e.g., "P****word")
  - Strength (color-coded badge)
  - Entropy (bits)
  - Crack Time (estimated)
  - Date
- **Pagination**: Navigate through logs (20 per page, max 100)
- **Refresh**: Manual refresh button

### Color Coding for Password Strength
- 🔴 **Very Weak** - Red
- 🟠 **Weak** - Orange
- 🟡 **Medium** - Yellow
- 🟢 **Strong** - Green
- 🟢 **Very Strong** - Emerald

## API Endpoints

All admin endpoints require the `X-Admin-Key` header:

```
X-Admin-Key: your-admin-key
Content-Type: application/json
```

### GET `/api/admin/health`
Health check for admin panel.

**Response:**
```json
{
  "status": "ok",
  "message": "Admin panel is operational",
  "timestamp": "2024-03-25T10:30:00"
}
```

### GET `/api/admin/users`
Fetch all users with pagination and search.

**Query Parameters:**
- `page` (int, default: 1) - Page number
- `limit` (int, default: 20, max: 100) - Items per page
- `search` (string, optional) - Search term for username/email

**Response:**
```json
{
  "total": 150,
  "page": 1,
  "limit": 20,
  "users": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "created_at": "2024-03-20T10:00:00",
      "status": "active"
    }
  ]
}
```

### GET `/api/admin/password-logs`
Fetch password analysis logs with pagination and filters.

**Query Parameters:**
- `page` (int, default: 1) - Page number
- `limit` (int, default: 20, max: 100) - Items per page
- `user_id` (string, optional) - Filter by user ID
- `start_date` (string, optional) - Start date (ISO format: YYYY-MM-DD)
- `end_date` (string, optional) - End date (ISO format: YYYY-MM-DD)

**Response:**
```json
{
  "total": 500,
  "page": 1,
  "limit": 20,
  "logs": [
    {
      "id": 1,
      "user_id": "john_doe",
      "masked_password": "MyP****123",
      "strength": "strong",
      "entropy": 45.23,
      "crack_time": "100 years",
      "created_at": "2024-03-25T10:30:00"
    }
  ]
}
```

### GET `/api/admin/statistics`
Fetch aggregate statistics about users and password analyses.

**Response:**
```json
{
  "total_users": 150,
  "total_analyses": 500,
  "avg_entropy": 42.15,
  "strength_distribution": {
    "very_weak": 20,
    "weak": 50,
    "medium": 120,
    "strong": 200,
    "very_strong": 110
  }
}
```

## Security Features

✅ **Admin Key Authentication**: All endpoints require valid X-Admin-Key header
✅ **Password Masking**: Only masked passwords displayed (e.g., "P****word")
✅ **No Plain Text Storage**: Passwords never exposed in API responses
✅ **Input Validation**: All parameters validated and sanitized
✅ **Error Handling**: Proper HTTP status codes and error messages
✅ **Protected Route**: Admin page protected by ProtectedRoute component (requires login)
✅ **Session Management**: Admin key stored in localStorage for session persistence
✅ **CORS Enabled**: Admin endpoints covered by existing CORS configuration

## Testing the Admin Panel

### 1. Local Development

```bash
# Start backend
cd backend
python -m uvicorn app.main:app --reload --port 8000

# In new terminal, start frontend
cd frontend
npm run dev
```

### 2. Test Admin Access

```bash
# Verify admin endpoint
curl -H "X-Admin-Key: your-admin-key" \
  http://localhost:8000/api/admin/health

# Test users endpoint
curl -H "X-Admin-Key: your-admin-key" \
  "http://localhost:8000/api/admin/users?page=1&limit=20"

# Test statistics
curl -H "X-Admin-Key: your-admin-key" \
  http://localhost:8000/api/admin/statistics
```

### 3. Frontend Testing

1. Login at `http://localhost:5173/login`
2. Navigate to `http://localhost:5173/supabase/admin`
3. Enter admin key when prompted
4. Test search, pagination, and filtering features

## Troubleshooting

### "Invalid admin key" error
- Verify `ADMIN_KEY` environment variable is set in backend `.env`
- Ensure frontend is sending correct key in `X-Admin-Key` header
- Check that admin key is passed correctly from frontend form

### "Failed to fetch users/logs"
- Verify Supabase connection is working
- Check that tables (`users`, `password_logs`) exist in Supabase
- Check browser console for detailed error messages
- Verify admin key has permission to access tables

### "No users/logs found"
- This is normal if database is empty
- Add test data to tables or create test accounts
- Check that data exists in Supabase dashboard

### CORS errors
- Admin endpoints use same base URL as regular API
- CORS should be pre-configured
- Check that frontend URL is in CORS origins list in backend

## Performance Considerations

- **Pagination limit**: Maximum 100 items per page (prevents large data transfers)
- **Search implementation**: Client-side filtering for small datasets, consider PostgreSQL full-text search for large datasets
- **Caching**: No caching implemented (real-time data). Add caching headers if needed
- **Rate limiting**: Not implemented - consider adding for production

## Future Enhancements

- [ ] Export data (CSV, JSON)
- [ ] Advanced filtering (date range, strength level)
- [ ] Delete/suspend user capabilities
- [ ] Admin action logging
- [ ] Role-based access (multiple admin levels)
- [ ] Two-factor authentication for admin
- [ ] Dashboard charts with Chart.js integration
- [ ] Real-time updates with WebSockets

## Maintenance Notes

### Authentication Method
Current implementation uses simple API key header (`X-Admin-Key`). This is suitable for internal admin use but consider upgrading to:
- JWT tokens with role claims
- OAuth 2.0 for SSO integration
- RBAC (Role-Based Access Control) with database roles

### Database Queries
Backend queries use Supabase SDK. Queries are simple and not optimized. For large datasets, consider:
- Adding database indexes on `user_id`, `created_at`
- Using PostgreSQL full-text search for user search
- Implementing materialized views for statistics

## Summary

The Admin Dashboard is now fully integrated into your Password Strength Checker application. It provides:
- Secure admin-only access with key-based authentication
- Real-time view of all users and password analysis logs
- System statistics and analytics
- Responsive UI matching your existing dark theme
- No modifications to existing features
- Full TypeScript type safety
- Proper error handling and loading states

All existing features remain untouched and fully functional.
