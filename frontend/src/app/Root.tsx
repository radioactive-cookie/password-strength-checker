import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';

// Pages
import App from './App';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { Dashboard } from './pages/Dashboard';
import { AdminPage } from './pages/AdminPage';

export function Root() {
  useEffect(() => {
    // Apply dark mode to html element
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supabase/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          {/* Fallback route */}
          <Route path="*" element={<App />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
