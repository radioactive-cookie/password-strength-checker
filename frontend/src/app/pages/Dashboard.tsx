import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  User,
  LogOut,
  ShieldCheck,
  TrendingUp,
  Clock,
  Lock,
  Eye,
  Database,
  CheckCircle2,
  Zap,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const securityTips = [
  'Use a unique password for every account to prevent credential stuffing attacks.',
  'Enable two-factor authentication (2FA) wherever available.',
  'Consider using a reputable password manager to generate and store strong passwords.',
  'Regularly audit your accounts and revoke access to unused apps.',
  'Avoid using personal information like birthdays or names in passwords.',
];

const privacyPoints = [
  { icon: Lock, text: 'Passwords are never stored on any server' },
  { icon: Eye, text: 'All analysis runs locally in your browser' },
  { icon: Database, text: 'No data is transmitted to third parties' },
];

export function Dashboard() {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();

  useEffect(() => {
    if (!isLoggedIn || !user) {
      navigate('/login');
    }
  }, [isLoggedIn, user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleGoToChecker = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 pt-28 pb-16">
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#00c8ff 1px, transparent 1px), linear-gradient(90deg, #00c8ff 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Welcome back, <span className="text-[#00c8ff]">{user.username}</span>!
              </h1>
              <p className="text-gray-400 text-lg">Your secure password analysis dashboard</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 rounded-lg text-red-400 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid md:grid-cols-2 gap-6 mb-10"
        >
          <div
            className="relative bg-[#1f1f1f] border border-[#00c8ff]/30 rounded-2xl p-8"
            style={{
              boxShadow: '0 0 0 1px rgba(0,200,255,0.15), 0 0 40px rgba(0,200,255,0.1)',
            }}
          >
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#00c8ff]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#00c8ff]/10 rounded-lg">
                  <User className="w-6 h-6 text-[#00c8ff]" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Account Information</p>
                  <p className="text-white font-semibold">{user.username}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Username</p>
                  <p className="text-white font-mono">{user.username}</p>
                </div>
                {user.email && (
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Email</p>
                    <p className="text-white font-mono">{user.email}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div
            className="relative bg-[#1f1f1f] border border-[#00c8ff]/30 rounded-2xl p-8"
            style={{
              boxShadow: '0 0 0 1px rgba(0,200,255,0.15), 0 0 40px rgba(0,200,255,0.1)',
            }}
          >
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#00c8ff]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-[#00c8ff]/10 rounded-lg">
                  <ShieldCheck className="w-6 h-6 text-[#00c8ff]" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Security Status</p>
                  <p className="text-white font-semibold">Secured</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Account Status</span>
                  <span className="text-[#88ff44]">✓ Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Password Protected</span>
                  <span className="text-[#88ff44]">✓ Yes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Data Encryption</span>
                  <span className="text-[#88ff44]">✓ Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security Tips */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10"
        >
          <div
            className="relative bg-[#1f1f1f] border border-[#00c8ff]/30 rounded-2xl p-8"
            style={{
              boxShadow: '0 0 0 1px rgba(0,200,255,0.15), 0 0 40px rgba(0,200,255,0.1)',
            }}
          >
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#00c8ff]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Zap className="w-6 h-6 text-[#00c8ff]" />
                Security Tips
              </h2>

              <div className="space-y-4">
                {securityTips.map((tip, idx) => (
                  <div key={idx} className="flex gap-3 p-4 bg-[#0a0a0a] rounded-lg border border-[#00c8ff]/10">
                    <CheckCircle2 className="w-5 h-5 text-[#00c8ff] flex-shrink-0 mt-0.5" />
                    <p className="text-gray-300 text-sm leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Privacy Assurance */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-10"
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Lock className="w-6 h-6 text-[#00c8ff]" />
            Your Privacy is Protected
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {privacyPoints.map((point, idx) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="relative bg-[#1f1f1f] border border-[#00c8ff]/30 rounded-2xl p-6"
                  style={{
                    boxShadow: '0 0 0 1px rgba(0,200,255,0.15), 0 0 40px rgba(0,200,255,0.1)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-[#00c8ff]/10 rounded-lg">
                      <Icon className="w-5 h-5 text-[#00c8ff]" />
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{point.text}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={handleGoToChecker}
            className="flex-1 h-12 bg-[#00c8ff] hover:bg-[#00a8dd] text-black font-semibold rounded-lg transition-all shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_30px_rgba(0,200,255,0.5)] flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" />
            Go to Password Checker
          </button>

          <button
            onClick={handleLogout}
            className="h-12 px-6 border border-red-500/50 hover:border-red-500 text-red-400 hover:text-red-300 font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </motion.div>
      </div>
    </div>
  );
}
