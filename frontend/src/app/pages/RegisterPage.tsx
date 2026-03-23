import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { Shield, Eye, EyeOff, UserPlus, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

function getPasswordStrength(pwd: string): PasswordStrength {
  if (!pwd) return { score: 0, label: '', color: '#666' };
  let score = 0;
  if (pwd.length >= 8) score += 20;
  if (pwd.length >= 12) score += 10;
  if (pwd.length >= 16) score += 10;
  if (/[a-z]/.test(pwd)) score += 15;
  if (/[A-Z]/.test(pwd)) score += 15;
  if (/[0-9]/.test(pwd)) score += 15;
  if (/[^a-zA-Z0-9]/.test(pwd)) score += 15;
  if (/(.)\\1{2,}/.test(pwd)) score -= 10;
  if (/^[0-9]+$/.test(pwd)) score -= 20;
  score = Math.max(0, Math.min(100, score));

  if (score < 30) return { score, label: 'Very Weak', color: '#ff4444' };
  if (score < 50) return { score, label: 'Weak', color: '#ff9944' };
  if (score < 70) return { score, label: 'Fair', color: '#ffdd44' };
  if (score < 90) return { score, label: 'Strong', color: '#88ff44' };
  return { score, label: 'Very Strong', color: '#00c8ff' };
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError, isLoggedIn } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [localError, setLocalError] = useState('');

  const strength = getPasswordStrength(password);
  const passwordsMatch = confirmPassword !== '' && password === confirmPassword;
  const passwordsMismatch = confirmPassword !== '' && password !== confirmPassword;

  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Number', met: /[0-9]/.test(password) },
    { label: 'Special character', met: /[^a-zA-Z0-9]/.test(password) },
  ];

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!username.trim() || !password || !confirmPassword) {
      setLocalError('Please fill in all required fields.');
      return;
    }

    if (username.trim().length < 3) {
      setLocalError('Username must be at least 3 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters.');
      return;
    }

    const success = await register(username.trim(), password, email.trim() || undefined);
    if (success) {
      navigate('/dashboard');
    } else if (!error) {
      setLocalError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10 bg-[#0a0a0a]">
      {/* Background grid */}
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
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#00c8ff]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#00c8ff]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <h1 className="text-3xl font-bold text-white mb-1 text-center">Create Account</h1>
            <p className="text-gray-400 text-center mb-8">Join password_checker today</p>

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="w-full h-12 px-4 bg-[#0a0a0a] border border-[#00c8ff]/30 focus:border-[#00c8ff] rounded-lg text-white placeholder:text-gray-600 transition-all outline-none"
                  autoComplete="username"
                />
              </div>

              {/* Email (optional) */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Email (optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full h-12 px-4 bg-[#0a0a0a] border border-[#00c8ff]/30 focus:border-[#00c8ff] rounded-lg text-white placeholder:text-gray-600 transition-all outline-none"
                  autoComplete="email"
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
                    placeholder="Create a strong password"
                    className="w-full h-12 px-4 pr-11 bg-[#0a0a0a] border border-[#00c8ff]/30 focus:border-[#00c8ff] rounded-lg text-white placeholder:text-gray-600 transition-all outline-none"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00c8ff] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password strength bar */}
                {password && (
                  <div className="mt-3 space-y-2">
                    <div className="w-full h-2 bg-[#0a0a0a] rounded-full overflow-hidden border border-[#00c8ff]/20">
                      <div
                        className="h-full transition-all duration-300"
                        style={{ width: `${strength.score}%`, backgroundColor: strength.color }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Strength:</span>
                      <span className="text-xs font-semibold" style={{ color: strength.color }}>
                        {strength.label}
                      </span>
                    </div>
                  </div>
                )}

                {/* Requirements */}
                {password && (
                  <div className="mt-3 space-y-2">
                    {requirements.map((req, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-400">
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            backgroundColor: req.met ? 'rgba(136, 255, 68, 0.2)' : 'rgba(255, 68, 68, 0.1)',
                            border: `1px solid ${req.met ? '#88ff44' : '#ff4444'}`,
                          }}
                        >
                          {req.met && <CheckCircle2 className="w-3 h-3" style={{ color: '#88ff44' }} />}
                        </div>
                        {req.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full h-12 px-4 pr-11 bg-[#0a0a0a] border border-[#00c8ff]/30 focus:border-[#00c8ff] rounded-lg text-white placeholder:text-gray-600 transition-all outline-none"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00c8ff] transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password match indicator */}
                {confirmPassword && (
                  <div className="mt-2">
                    {passwordsMatch && (
                      <div className="flex items-center gap-2 text-xs text-[#88ff44]">
                        <CheckCircle2 className="w-4 h-4" />
                        Passwords match
                      </div>
                    )}
                    {passwordsMismatch && (
                      <div className="flex items-center gap-2 text-xs text-red-400">
                        <AlertCircle className="w-4 h-4" />
                        Passwords do not match
                      </div>
                    )}
                  </div>
                )}
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

              {/* Register Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#00c8ff] hover:bg-[#00a8dd] text-black font-semibold rounded-lg transition-all shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_30px_rgba(0,200,255,0.5)] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Create Account
                  </>
                )}
              </button>

              {/* Login Link */}
              <div className="text-center text-sm text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-[#00c8ff] hover:underline">
                  Login here
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
