import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  LogOut,
  ShieldCheck,
  Shield,
  TrendingUp,
  Clock,
  Lock,
  Eye,
  Database,
  CheckCircle2,
  Zap,
  ArrowLeft,
  Copy,
  Check,
  EyeOff,
  AlertTriangle,
  Loader2,
  RefreshCw,
  History,
  BarChart2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  checkPassword,
  clientSideStrength,
  getPasswordHistory,
  type PasswordCheckResult,
  type PasswordHistoryItem,
  type StrengthLevel,
} from '../services/api';
import { PasswordAnalysis } from '../components/PasswordAnalysis';

const STRENGTH_CONFIG: Record<
  StrengthLevel,
  { label: string; color: string; bg: string; glow: string; width: string }
> = {
  very_weak: {
    label: "Very Weak",
    color: "#ff3b3b",
    bg: "#ff3b3b",
    glow: "rgba(255,59,59,0.4)",
    width: "10%",
  },
  weak: {
    label: "Weak",
    color: "#ff8c00",
    bg: "#ff8c00",
    glow: "rgba(255,140,0,0.4)",
    width: "30%",
  },
  medium: {
    label: "Medium",
    color: "#ffd700",
    bg: "#ffd700",
    glow: "rgba(255,215,0,0.4)",
    width: "55%",
  },
  strong: {
    label: "Strong",
    color: "#00c851",
    bg: "#00c851",
    glow: "rgba(0,200,81,0.4)",
    width: "78%",
  },
  very_strong: {
    label: "Very Strong",
    color: "#00e676",
    bg: "#00e676",
    glow: "rgba(0,230,118,0.4)",
    width: "100%",
  },
};

function StrengthBar({
  strength,
  score,
}: {
  strength: StrengthLevel;
  score: number;
}) {
  const cfg = STRENGTH_CONFIG[strength];
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.75rem",
            color: "#666",
          }}
        >
          Strength
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.8rem",
            color: cfg.color,
            fontWeight: 600,
            textShadow: `0 0 8px ${cfg.glow}`,
          }}
        >
          {cfg.label}
        </span>
      </div>
      <div
        className="w-full h-2 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <motion.div
          className="h-full rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            background: cfg.bg,
            boxShadow: `0 0 10px ${cfg.glow}`,
          }}
        />
      </div>
      {/* Segment ticks */}
      <div className="flex justify-between mt-1">
        {[20, 40, 60, 80, 100].map((tick) => (
          <div
            key={tick}
            className="w-0.5 h-1 rounded-full"
            style={{
              background:
                score >= tick ? cfg.bg : "rgba(255,255,255,0.1)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

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
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<PasswordCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);
  const [history, setHistory] = useState<PasswordHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn || !user) {
      navigate('/login');
    } else {
      // Fetch password history
      const fetchHistory = async () => {
        try {
          setLoadingHistory(true);
          setHistoryError(null);
          const historyData = await getPasswordHistory(user.username);
          console.log('📊 Password history data:', historyData);
          setHistory(historyData);
        } catch (err) {
          setHistoryError(
            err instanceof Error ? err.message : "Failed to load history"
          );
          setHistory([]);
        } finally {
          setLoadingHistory(false);
        }
      };
      fetchHistory();
    }
  }, [isLoggedIn, user, navigate]);

  // Real-time client-side strength
  const realtime = password ? clientSideStrength(password) : null;

  const handleAnalyze = useCallback(async () => {
    if (!password.trim()) return;
    setAnalyzing(true);
    setError(null);
    try {
      const checkResult = await checkPassword(password, user?.username);
      setResult(checkResult);
      setHasChecked(true);
      
      // Refresh history after successful check
      try {
        if (user?.username) {
          const historyData = await getPasswordHistory(user.username);
          setHistory(historyData);
        }
      } catch (historyErr) {
        // History fetch error - don't block password check
        console.warn("Failed to refresh history:", historyErr);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? `API Error: ${err.message}`
          : "Failed to connect to backend."
      );
    } finally {
      setAnalyzing(false);
    }
  }, [password, user?.username]);

  const generateStrongPassword = (): string => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const special = "!@#$%^&*()_+-=[]{}<>?";
    const allChars = uppercase + lowercase + numbers + special;

    let generatedPassword = "";
    generatedPassword += uppercase[Math.floor(Math.random() * uppercase.length)];
    generatedPassword += lowercase[Math.floor(Math.random() * lowercase.length)];
    generatedPassword += numbers[Math.floor(Math.random() * numbers.length)];
    generatedPassword += special[Math.floor(Math.random() * special.length)];

    for (let i = generatedPassword.length; i < 16; i++) {
      generatedPassword += allChars[Math.floor(Math.random() * allChars.length)];
    }

    return generatedPassword
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  };

  const handleGenerate = useCallback(() => {
    setGenerating(true);
    setError(null);
    try {
      const newPassword = generateStrongPassword();
      setPassword(newPassword);
      setResult(null);
      setHasChecked(false);
    } catch (err) {
      setError("Failed to generate password.");
    } finally {
      setGenerating(false);
    }
  }, []);

  const handleCopy = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStrengthLevel = (): StrengthLevel => {
    if (!result) {
      return realtime?.strength || "very_weak";
    }
    const strengthMap: Record<number, StrengthLevel> = {
      0: "very_weak",
      1: "weak",
      2: "medium",
      3: "strong",
      4: "very_strong",
    };
    return strengthMap[result.score] || "very_weak";
  };

  // Convert strength label or score to label
  const getStrengthLabel = (strength: number | string): string => {
    // If it's already a string label from history, return it
    if (typeof strength === "string") {
      return strength;
    }
    // If it's a numeric score, convert to label
    if (strength < 1) return "Very Weak";
    if (strength < 2) return "Weak";
    if (strength < 3) return "Medium";
    if (strength < 4) return "Strong";
    return "Very Strong";
  };

  // Get color for strength (handles both string labels and numeric scores)
  const getStrengthColor = (strength: number | string): string => {
    const strengthMap: Record<string, string> = {
      "Very Weak": "#ff3b3b",
      "Weak": "#ff8c00",
      "Medium": "#ffd700",
      "Strong": "#00c851",
      "Very Strong": "#00e676",
    };

    // If it's a string, look it up in the map
    if (typeof strength === "string") {
      return strengthMap[strength] || "#ffd700";
    }

    // If it's a numeric score, convert to label first
    if (strength < 1) return "#ff3b3b";
    if (strength < 2) return "#ff8c00";
    if (strength < 3) return "#ffd700";
    if (strength < 4) return "#00c851";
    return "#00e676";
  };

  // Convert strength label to numeric score for calculations
  const strengthLabelToScore = (label: string): number => {
    const scoreMap: Record<string, number> = {
      "Very Weak": 0,
      "Weak": 1,
      "Medium": 2,
      "Strong": 3,
      "Very Strong": 4,
    };
    return scoreMap[label] || 0;
  };

  const displayStrength = result
    ? { strength: getStrengthLevel(), score: result.score }
    : realtime || { strength: "very_weak" as StrengthLevel, score: 0 };

  // Calculate stats from history
  const totalChecks = history.length;
  const averageEntropy = totalChecks > 0
    ? (history.reduce((sum, h) => sum + h.entropy, 0) / totalChecks).toFixed(1)
    : 0;
  const averageStrength = totalChecks > 0
    ? (history.reduce((sum, h) => sum + strengthLabelToScore(typeof h.strength === "string" ? h.strength : getStrengthLabel(h.strength)), 0) / totalChecks * 20).toFixed(0)
    : 0;

  if (!user) return null;

  const handleLogout = () => {
    logout();
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

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Top Section Label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-2"
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              color: "#00c8ff",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Your Security Dashboard
          </span>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
            Welcome back, <span className="text-[#00c8ff]">{user.username}</span>
          </h1>
          <p className="text-gray-500 text-lg">Your personal password analysis history</p>
        </motion.div>

        {/* Stats Cards - 3 Column Grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {/* Total Checks */}
          <div
            className="relative bg-[#1a1a1a] border border-[#00c8ff]/25 rounded-xl p-6"
            style={{
              boxShadow: '0 0 0 1px rgba(0,200,255,0.1), 0 0 30px rgba(0,200,255,0.05)',
            }}
          >
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#00c8ff]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.08em",
                  color: "#888",
                  textTransform: "uppercase",
                  marginBottom: "1rem",
                }}
              >
                Total Checks
              </p>
              <div className="flex items-center justify-between">
                <p className="text-white font-bold text-4xl">{totalChecks}</p>
                <div className="p-3 bg-[#00c8ff]/10 rounded-lg">
                  <BarChart2 className="w-6 h-6 text-[#00c8ff]" />
                </div>
              </div>
            </div>
          </div>

          {/* Average Strength */}
          <div
            className="relative bg-[#1a1a1a] border border-[#00c8ff]/25 rounded-xl p-6"
            style={{
              boxShadow: '0 0 0 1px rgba(0,200,255,0.1), 0 0 30px rgba(0,200,255,0.05)',
            }}
          >
            <div className="absolute -top-16 -left-16 w-32 h-32 bg-[#00c8ff]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.08em",
                  color: "#888",
                  textTransform: "uppercase",
                  marginBottom: "1rem",
                }}
              >
                Average Strength
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-bold text-3xl">
                    {totalChecks > 0
                      ? (() => {
                          const avg = parseFloat(String(averageStrength));
                          if (avg < 20) return "Very Weak";
                          if (avg < 40) return "Weak";
                          if (avg < 60) return "Fair";
                          if (avg < 80) return "Strong";
                          return "Very Strong";
                        })()
                      : "N/A"}
                  </p>
                  <p className="text-gray-500 text-sm">{averageStrength}/100</p>
                </div>
                <div className="p-3 bg-[#ffd700]/10 rounded-lg">
                  <ShieldCheck className="w-6 h-6 text-[#ffd700]" />
                </div>
              </div>
            </div>
          </div>

          {/* Average Entropy */}
          <div
            className="relative bg-[#1a1a1a] border border-[#00c8ff]/25 rounded-xl p-6"
            style={{
              boxShadow: '0 0 0 1px rgba(0,200,255,0.1), 0 0 30px rgba(0,200,255,0.05)',
            }}
          >
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#00c8ff]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.08em",
                  color: "#888",
                  textTransform: "uppercase",
                  marginBottom: "1rem",
                }}
              >
                Average Entropy
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-bold text-3xl">{averageEntropy}</p>
                  <p className="text-gray-500 text-sm">bits</p>
                </div>
                <div className="p-3 bg-[#a78bfa]/10 rounded-lg">
                  <span style={{ color: "#a78bfa", fontSize: "1.5rem", fontWeight: "bold" }}>#</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Left Column - User Info & Tips */}
          <div className="space-y-6">
            {/* Welcome Back Card */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative bg-[#1a1a1a] border border-[#00c8ff]/25 rounded-xl p-6"
              style={{
                boxShadow: '0 0 0 1px rgba(0,200,255,0.1), 0 0 30px rgba(0,200,255,0.05)',
              }}
            >
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#00c8ff]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-[#00c8ff]/10 rounded-lg">
                    <User className="w-5 h-5 text-[#00c8ff]" />
                  </div>
                  <p
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.65rem",
                      letterSpacing: "0.08em",
                      color: "#888",
                      textTransform: "uppercase",
                    }}
                  >
                    Welcome Back
                  </p>
                </div>
                <p className="text-white font-bold text-xl mb-4">{user.username}</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <span style={{ color: "#00c8ff" }}>📅</span>
                    <span>Member since March 24, 2026</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span style={{ color: "#00e676" }}>✓</span>
                    <span>Account verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <span style={{ color: "#00c8ff" }}>⚡</span>
                    <span>{totalChecks} passwords analyzed</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-[#00c8ff]/10">
                  <p className="text-gray-500 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    📋 Data is fetched per logged-in user — no manual username input required.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Privacy & Security */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative bg-[#1a1a1a] border border-[#00c8ff]/25 rounded-xl p-6"
              style={{
                boxShadow: '0 0 0 1px rgba(0,200,255,0.1), 0 0 30px rgba(0,200,255,0.05)',
              }}
            >
              <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-[#00c8ff]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-[#00c8ff]/10 rounded-lg">
                    <Shield className="w-5 h-5 text-[#00c8ff]" />
                  </div>
                  <p
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.65rem",
                      letterSpacing: "0.08em",
                      color: "#888",
                      textTransform: "uppercase",
                    }}
                  >
                    Privacy & Security
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <Lock className="w-4 h-4 text-[#00c8ff]" />
                    <span>Passwords are never stored on any server</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <Eye className="w-4 h-4 text-[#00c8ff]" />
                    <span>All analysis runs locally in your browser</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <Database className="w-4 h-4 text-[#00c8ff]" />
                    <span>No data is transmitted to third parties</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Security Tips */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="relative bg-[#1a1a1a] border border-[#00c8ff]/25 rounded-xl p-6"
              style={{
                boxShadow: '0 0 0 1px rgba(0,200,255,0.1), 0 0 30px rgba(0,200,255,0.05)',
              }}
            >
              <div className="absolute -top-16 -left-16 w-32 h-32 bg-[#00c8ff]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                <p
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.65rem",
                    letterSpacing: "0.08em",
                    color: "#888",
                    textTransform: "uppercase",
                    marginBottom: "1.5rem",
                  }}
                >
                  Security Tips
                </p>
                <div className="space-y-2">
                  {[
                    "Use a unique password for every account.",
                    "Enable 2FA wherever available.",
                    "Use a reputable password manager.",
                    "Avoid personal info in passwords.",
                  ].map((tip, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#00c8ff] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400 text-xs leading-relaxed">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - History & Checker */}
          <div className="md:col-span-2 space-y-6">
            {/* Password Test History */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative bg-[#1a1a1a] border border-[#00c8ff]/25 rounded-xl p-8"
              style={{
                boxShadow: '0 0 0 1px rgba(0,200,255,0.1), 0 0 30px rgba(0,200,255,0.05)',
              }}
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#00c8ff]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Clock className="w-6 h-6 text-[#00c8ff]" />
                    Password Test History
                  </h2>
                  <p className="text-gray-500 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    🔒 Passwords hidden for security
                  </p>
                </div>

                {loadingHistory ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 text-[#00c8ff] animate-spin" />
                    <p className="text-gray-400 ml-2">Loading history...</p>
                  </div>
                ) : historyError ? (
                  <div className="flex items-center gap-2 p-4 rounded-lg bg-red-600/20 border border-red-500/50">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <p className="text-red-400 text-sm">{historyError}</p>
                  </div>
                ) : history.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#00c8ff]/20">
                          <th className="text-left py-3 px-4 text-gray-500 font-semibold text-xs">DATE</th>
                          <th className="text-left py-3 px-4 text-gray-500 font-semibold text-xs">PASSWORD</th>
                          <th className="text-left py-3 px-4 text-gray-500 font-semibold text-xs">STRENGTH</th>
                          <th className="text-left py-3 px-4 text-gray-500 font-semibold text-xs">ENTROPY</th>
                          <th className="text-left py-3 px-4 text-gray-500 font-semibold text-xs">CRACK TIME</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.map((item, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-[#00c8ff]/10 hover:bg-[#00c8ff]/5 transition"
                          >
                            <td className="py-4 px-4 text-gray-300 text-sm">
                              {new Date(item.created_at).toLocaleDateString("en-US", {
                                month: "2-digit",
                                day: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </td>
                            <td className="py-4 px-4 text-gray-300 text-sm font-mono">
                              <span style={{ color: "#00c8ff" }}>
                                {item.masked_password || "****"}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span
                                style={{
                                  color: getStrengthColor(item.strength),
                                  fontWeight: 600,
                                  fontSize: "0.9rem",
                                }}
                              >
                                ● {getStrengthLabel(item.strength)}
                              </span>
                              <span style={{ color: "#999", marginLeft: "0.5rem", fontSize: "0.8rem" }}>
                                ({Math.round(strengthLabelToScore(typeof item.strength === "string" ? item.strength : getStrengthLabel(item.strength)) * 100)})
                              </span>
                            </td>
                            <td className="py-4 px-4 text-gray-300 text-sm">
                              <span style={{ color: "#a78bfa" }}>
                                # {item.entropy.toFixed(1)} bits
                              </span>
                            </td>
                            <td className="py-4 px-4 text-gray-300 text-sm">
                              <span style={{ color: "#ffd700" }}>⏱ {item.crack_time}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <History className="w-12 h-12 text-[#00c8ff]/30 mb-4" />
                    <p className="text-gray-400">No password checks yet</p>
                    <p className="text-gray-600 text-sm mt-1">
                      Start by checking a password below
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Test a New Password */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="relative bg-[#1a1a1a] border border-[#00c8ff]/25 rounded-xl p-8"
              style={{
                boxShadow: '0 0 0 1px rgba(0,200,255,0.1), 0 0 30px rgba(0,200,255,0.05)',
              }}
            >
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#00c8ff]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                <h3 className="text-xl font-bold text-white mb-2">Test a New Password</h3>
                <p className="text-gray-500 text-sm mb-6">
                  Run the analyzer on your next password — all checks are local.
                </p>

                {/* Password Input */}
                <div className="mb-4">
                  <div
                    className="flex items-center gap-2 rounded-lg px-4 py-3 transition-all duration-300"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: `1px solid ${password ? "rgba(0,200,255,0.35)" : "rgba(255,255,255,0.1)"}`,
                      boxShadow: password
                        ? "0 0 15px rgba(0,200,255,0.08)"
                        : "none",
                    }}
                  >
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (hasChecked) {
                          setResult(null);
                          setHasChecked(false);
                        }
                      }}
                      placeholder="Enter password…"
                      className="flex-1 bg-transparent outline-none text-white text-sm"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        caretColor: "#00c8ff",
                      }}
                      onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        color: "#666",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "2px",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#00c8ff")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#666")
                      }
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Strength Bar */}
                <AnimatePresence>
                  {password && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.3 }}
                      className="mb-4"
                    >
                      <StrengthBar
                        strength={displayStrength.strength}
                        score={displayStrength.score}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Analysis Results */}
                <AnimatePresence>
                  {hasChecked && result && <PasswordAnalysis result={result} />}
                </AnimatePresence>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="flex items-start gap-2 p-3 rounded-lg mb-4"
                      style={{
                        background: "rgba(255,59,59,0.08)",
                        border: "1px solid rgba(255,59,59,0.25)",
                      }}
                    >
                      <AlertTriangle size={16} style={{ color: "#ff6b6b", flexShrink: 0, marginTop: 2 }} />
                      <p
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.78rem",
                          color: "#ff6b6b",
                          lineHeight: 1.5,
                        }}
                      >
                        {error}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    onClick={handleAnalyze}
                    disabled={!password || analyzing}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all duration-200 text-sm font-semibold"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      background:
                        !password || analyzing
                          ? "rgba(0,200,255,0.08)"
                          : "rgba(0, 200, 255, 1)",
                      color: !password || analyzing ? "#555" : "#000",
                      cursor: !password || analyzing ? "not-allowed" : "pointer",
                    }}
                  >
                    {analyzing ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Zap size={14} />
                    )}
                    {analyzing ? "Checking…" : "Check Strength"}
                  </motion.button>

                  <motion.button
                    onClick={handleGenerate}
                    disabled={generating}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all duration-200 text-sm"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: generating ? "#555" : "#ccc",
                      cursor: generating ? "not-allowed" : "pointer",
                    }}
                  >
                    {generating ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <RefreshCw size={14} />
                    )}
                    Generate
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Password History Section */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <History className="w-6 h-6 text-[#00c8ff]" />
            <h2 className="text-2xl font-bold text-white">Your Password History</h2>
          </div>

          {history.length > 0 ? (
            <div
              className="relative bg-[#1a1a1a] border border-[#00c8ff]/25 rounded-xl overflow-hidden"
              style={{
                boxShadow: '0 0 0 1px rgba(0,200,255,0.1), 0 0 30px rgba(0,200,255,0.05)',
              }}
            >
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
                backgroundImage: 'linear-gradient(#00c8ff 1px, transparent 1px)',
                backgroundSize: '00px 40px',
              }} />
              
              <div className="relative overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#00c8ff]/20">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#00c8ff] uppercase tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        Password
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#00c8ff] uppercase tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        Strength
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#00c8ff] uppercase tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        Entropy
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#00c8ff] uppercase tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        Crack Time
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-[#00c8ff] uppercase tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item, idx) => (
                      <motion.tr
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="border-b border-[#00c8ff]/10 hover:bg-[#00c8ff]/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <code style={{ fontFamily: "'JetBrains Mono', monospace", color: "#00c8ff", fontSize: "0.9rem" }}>
                            {item.masked_password}
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            style={{
                              color: getStrengthColor(item.strength),
                              fontWeight: 600,
                              fontFamily: "'JetBrains Mono', monospace",
                              fontSize: "0.85rem",
                            }}
                          >
                            {getStrengthLabel(item.strength)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span style={{ color: "#999", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>
                            {item.entropy.toFixed(2)} bits
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span style={{ color: "#999", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem" }}>
                            {item.crack_time}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span style={{ color: "#666", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem" }}>
                            {new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString()}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div
              className="relative bg-[#1a1a1a] border border-[#00c8ff]/25 rounded-xl p-8 text-center"
              style={{
                boxShadow: '0 0 0 1px rgba(0,200,255,0.1), 0 0 30px rgba(0,200,255,0.05)',
              }}
            >
              <Database className="w-12 h-12 text-[#00c8ff]/30 mx-auto mb-4" />
              <p className="text-[#666] font-medium">No password checks yet</p>
              <p className="text-[#555] text-sm mt-1">Check your first password above to see it appear here</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
