import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { Shield, Eye, EyeOff, LogIn, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, isLoggedIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!username.trim() || !password.trim()) {
      setLocalError('Please fill in all fields.');
      return;
    }

    const success = await login(username.trim(), password);
    if (success) {
      navigate('/dashboard');
    } else if (!error) {
      setLocalError('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10 bg-[#0a0a0a]">
      {/* Background grid effect */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#00c8ff 1px, transparent 1px), linear-gradient(90deg, #00c8ff 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Shield className="w-8 h-8 text-[#00c8ff]" />
          <span className="text-2xl font-bold bg-gradient-to-r from-[#00c8ff] to-white bg-clip-text text-transparent">
            password_checker
          </span>
        </div>

        {/* Card */}
        <div
          className="relative bg-[#1f1f1f] border border-[#00c8ff]/30 rounded-2xl p-8"
          style={{
            boxShadow: '0 0 0 1px rgba(0,200,255,0.15), 0 0 40px rgba(0,200,255,0.1)',
          }}
        >
          {/* Glow corner */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#00c8ff]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#00c8ff]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <h1 className="text-3xl font-bold text-white mb-1 text-center">Login</h1>
            <p className="text-gray-400 text-center mb-8">Access your password_checker account</p>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full h-12 px-4 bg-[#0a0a0a] border border-[#00c8ff]/30 focus:border-[#00c8ff] rounded-lg text-white placeholder:text-gray-600 transition-all outline-none"
                  autoComplete="username"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-12 px-4 pr-11 bg-[#0a0a0a] border border-[#00c8ff]/30 focus:border-[#00c8ff] rounded-lg text-white placeholder:text-gray-600 transition-all outline-none"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00c8ff] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {(localError || error) && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {localError || error}
                </motion.div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#00c8ff] hover:bg-[#00a8dd] text-black font-semibold rounded-lg transition-all shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_30px_rgba(0,200,255,0.5)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Login
                  </>
                )}
              </button>

              {/* Register Link */}
              <div className="text-center text-sm text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#00c8ff] hover:underline">
                  Register here
                </Link>
              </div>

              {/* Back to Home */}
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full h-11 flex items-center justify-center gap-2 border border-[#00c8ff]/20 rounded-lg text-gray-400 hover:text-[#00c8ff] hover:border-[#00c8ff]/50 transition-all text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
