import { useState, useCallback } from "react";
import {
  Eye,
  EyeOff,
  Zap,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
  ShieldAlert,
  Clock,
  BarChart2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  checkPassword,
  clientSideStrength,
  type PasswordCheckResult,
  type StrengthLevel,
} from "../services/api";

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

function MetricCard({
  icon,
  label,
  value,
  color,
  glow,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  glow: string;
}) {
  return (
    <div
      className="flex-1 rounded-xl p-4 transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: `1px solid rgba(${color === "#00c8ff" ? "0,200,255" : color === "#ffd700" ? "255,215,0" : "255,59,59"},0.2)`,
        minWidth: 0,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span style={{ color }}>{icon}</span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.7rem",
            color: "#888",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      </div>
      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.85rem",
          color,
          fontWeight: 600,
          textShadow: `0 0 8px ${glow}`,
          wordBreak: "break-word",
        }}
      >
        {value}
      </p>
    </div>
  );
}

export function HeroSection() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<PasswordCheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  // Real-time client-side strength
  const realtime = password ? clientSideStrength(password) : null;

  const handleAnalyze = useCallback(async () => {
    if (!password.trim()) return;
    setAnalyzing(true);
    setError(null);
    try {
      const checkResult = await checkPassword(password);
      setResult(checkResult);
      setHasChecked(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? `API Error: ${err.message}`
          : "Failed to connect to backend."
      );
    } finally {
      setAnalyzing(false);
    }
  }, [password]);

  /**
   * Generate a strong random password entirely on the client side
   * No API calls needed for password generation
   */
  const generateStrongPassword = (): string => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const special = "!@#$%^&*()_+-=[]{}<>?";
    const allChars = uppercase + lowercase + numbers + special;

    // Ensure at least one character from each category
    let password = "";
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    // Fill the rest with random characters from the full pool
    for (let i = password.length; i < 16; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle to distribute special characters randomly
    return password
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

  // Determine what to show in the strength bar
  const getStrengthLevel = (): StrengthLevel => {
    if (!result) {
      return realtime?.strength || "very_weak";
    }
    // Convert numeric score (0-4) to StrengthLevel
    const strengthMap: Record<number, StrengthLevel> = {
      0: "very_weak",
      1: "weak",
      2: "medium",
      3: "strong",
      4: "very_strong",
    };
    return strengthMap[result.score] || "very_weak";
  };

  const displayStrength = result
    ? { strength: getStrengthLevel(), score: result.score }
    : realtime || { strength: "very_weak" as StrengthLevel, score: 0 };

  const suggestions = result?.suggestions || [];

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16"
      style={{
        background:
          "radial-gradient(ellipse at top, rgba(0,200,255,0.06) 0%, #0a0a0a 60%)",
      }}
    >
      {/* Headline */}
      <motion.div
        className="text-center max-w-3xl mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6"
          style={{
            background: "rgba(0, 200, 255, 0.08)",
            border: "1px solid rgba(0, 200, 255, 0.25)",
          }}
        >
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "#00c8ff" }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.75rem",
              color: "#00c8ff",
              letterSpacing: "0.08em",
            }}
          >
            LIVE PASSWORD ANALYZER
          </span>
        </div>

        <h1
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.15,
            marginBottom: "1.2rem",
          }}
        >
          Check Your Password{" "}
          <span
            style={{
              color: "#00c8ff",
              textShadow: "0 0 24px rgba(0,200,255,0.5)",
            }}
          >
            Strength Instantly
          </span>
        </h1>

        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "1.1rem",
            color: "#888",
            maxWidth: "580px",
            margin: "0 auto",
            lineHeight: 1.7,
          }}
        >
          password_checker analyzes password strength using multiple cybersecurity
          metrics and helps users create stronger passwords.
        </p>
      </motion.div>

      {/* Main Card */}
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div
          className="rounded-2xl p-6 sm:p-8"
          style={{
            background: "#1f1f1f",
            border: "1px solid rgba(0, 200, 255, 0.15)",
            boxShadow:
              "0 0 40px rgba(0,200,255,0.06), 0 25px 50px rgba(0,0,0,0.5)",
          }}
        >
          {/* Password Input */}
          <div className="mb-5">
            <label
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.75rem",
                color: "#888",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: "0.5rem",
              }}
            >
              Password
            </label>
            <div
              className="flex items-center gap-2 rounded-xl px-4 py-3 transition-all duration-300"
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
                placeholder="Enter your password…"
                className="flex-1 bg-transparent outline-none"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "1rem",
                  color: "#ffffff",
                  caretColor: "#00c8ff",
                }}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              />
              <div className="flex items-center gap-2">
                {password && (
                  <button
                    onClick={handleCopy}
                    title="Copy password"
                    style={{
                      color: copied ? "#00e676" : "#666",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "2px",
                      transition: "color 0.2s",
                    }}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                )}
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    color: "#666",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "2px",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#00c8ff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#666")
                  }
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6 flex-wrap">
            <motion.button
              onClick={handleAnalyze}
              disabled={!password || analyzing}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-200"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.85rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
                background:
                  !password || analyzing
                    ? "rgba(0,200,255,0.08)"
                    : "rgba(0,200,255,0.15)",
                border: "1px solid rgba(0,200,255,0.4)",
                color: !password || analyzing ? "#555" : "#00c8ff",
                cursor: !password || analyzing ? "not-allowed" : "pointer",
                boxShadow:
                  !password || analyzing
                    ? "none"
                    : "0 0 15px rgba(0,200,255,0.15)",
              }}
            >
              {analyzing ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Zap size={16} />
              )}
              {analyzing ? "Analyzing…" : "Check Strength"}
            </motion.button>

            <motion.button
              onClick={handleGenerate}
              disabled={generating}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-200"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.85rem",
                fontWeight: 600,
                letterSpacing: "0.05em",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: generating ? "#555" : "#ccc",
                cursor: generating ? "not-allowed" : "pointer",
              }}
            >
              {generating ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <RefreshCw size={16} />
              )}
              {generating ? "Generating…" : "Generate Strong Password"}
            </motion.button>
          </div>

          {/* Strength Bar — shown when password exists */}
          <AnimatePresence>
            {password && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.3 }}
                className="mb-5"
              >
                <StrengthBar
                  strength={displayStrength.strength}
                  score={displayStrength.score}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="flex items-start gap-2 p-3 rounded-xl mb-4"
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

          {/* Full Analysis Results */}
          <AnimatePresence>
            {hasChecked && result && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Metrics Row */}
                <div className="flex gap-3 mb-4 flex-wrap">
                  <MetricCard
                    icon={<BarChart2 size={14} />}
                    label="Entropy"
                    value={`${Number(result.entropy).toFixed(1)} bits`}
                    color="#00c8ff"
                    glow="rgba(0,200,255,0.5)"
                  />
                  <MetricCard
                    icon={<Clock size={14} />}
                    label="Crack Time"
                    value={result.estimated_crack_time}
                    color="#ffd700"
                    glow="rgba(255,215,0,0.4)"
                  />
                  <MetricCard
                    icon={
                      result.breach_count > 0 ? (
                        <ShieldAlert size={14} />
                      ) : (
                        <ShieldCheck size={14} />
                      )
                    }
                    label="Breach Status"
                    value={
                      result.breach_count > 0
                        ? `Found in ${result.breach_count.toLocaleString()} breaches`
                        : "No breach records found"
                    }
                    color={result.breach_count > 0 ? "#ff3b3b" : "#00e676"}
                    glow={
                      result.breach_count > 0
                        ? "rgba(255,59,59,0.4)"
                        : "rgba(0,230,118,0.4)"
                    }
                  />
                </div>

                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: "rgba(255,215,0,0.04)",
                      border: "1px solid rgba(255,215,0,0.15)",
                    }}
                  >
                    <p
                      className="mb-3"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.7rem",
                        color: "#888",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      Suggestions to improve
                    </p>
                    <ul className="space-y-2">
                      {suggestions.map((s, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2"
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.82rem",
                            color: "#ccc",
                          }}
                        >
                          <span style={{ color: "#ffd700", marginTop: "2px" }}>
                            ›
                          </span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
