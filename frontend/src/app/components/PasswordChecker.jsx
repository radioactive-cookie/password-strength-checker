import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, Copy, Check, Zap } from "lucide-react";
import { checkPassword } from "../services/api";

function PasswordChecker() {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const debounceTimer = useRef(null);

  /**
   * Password Generator Function
   * Generates a secure random password with:
   * - Minimum 16 characters
   * - Uppercase letters (A-Z)
   * - Lowercase letters (a-z)
   * - Numbers (0-9)
   * - Special characters (!@#$%^&*()_+-=[]{}<>?)
   */
  const generateStrongPassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialChars = "!@#$%^&*()_+-=[]{}<>?";

    // Combine all character pools
    const allChars = uppercase + lowercase + numbers + specialChars;

    // Build password ensuring at least one character from each category
    let newPassword = "";
    newPassword += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    newPassword += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    newPassword += numbers.charAt(Math.floor(Math.random() * numbers.length));
    newPassword += specialChars.charAt(Math.floor(Math.random() * specialChars.length));

    // Fill remaining characters randomly to reach 16 characters
    for (let i = newPassword.length; i < 16; i++) {
      newPassword += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    // Shuffle the password to distribute special characters randomly
    const shuffled = newPassword
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    // Update password state
    setPassword(shuffled);
  };

  /**
   * Manually check password - called when "Check Strength" button is clicked
   * Bypasses the debounce timer for immediate feedback
   */
  const manualCheckPassword = async () => {
    if (!password.trim()) {
      setError("Please enter a password to check.");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log("[PasswordChecker] Manual check triggered via button...");
      const data = await checkPassword(password);
      setResult(data);
      setError(null);
    } catch (error) {
      console.error("[PasswordChecker] Error during manual check:", error);
      setError(error instanceof Error ? error.message : "Failed to check password. Please try again.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Debounced password check - waits 500ms after user stops typing
   * to avoid excessive API calls
   */
  useEffect(() => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Only check if password has content
    if (password.trim().length === 0) {
      setResult(null);
      setError(null);
      return;
    }

    // Set timer for debounced check
    setLoading(true);
    setError(null);
    debounceTimer.current = setTimeout(async () => {
      try {
        console.log("[PasswordChecker] Checking password via API...");
        const data = await checkPassword(password);
        setResult(data);
        setError(null);
      } catch (error) {
        console.error("[PasswordChecker] Error checking password:", error);
        setError(error instanceof Error ? error.message : "Failed to check password. Please try again.");
        setResult(null);
      } finally {
        setLoading(false);
      }
    }, 500);

    // Cleanup on unmount
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [password]);

  /**
   * Get color for strength bar based on score
   */
  const getStrengthColor = () => {
    if (!result) return "bg-gray-700";
    switch (result.score) {
      case 0:
      case 1:
        return "bg-red-500"; // Very Weak, Weak
      case 2:
        return "bg-yellow-500"; // Medium
      case 3:
      case 4:
        return "bg-green-500"; // Strong, Very Strong
      default:
        return "bg-gray-700";
    }
  };

  /**
   * Get width percentage for strength bar
   */
  const getStrengthWidth = () => {
    if (!result) return "0%";
    return `${(result.score / 4) * 100}%`;
  };

  /**
   * Get security warning or safe status for breached passwords
   */
  const getBreachWarning = () => {
    if (!result) return null;
    
    if (result.breach_count > 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-2"
        >
          <span className="text-red-400 text-lg flex-shrink-0">⚠️</span>
          <div>
            <p className="text-red-400 text-sm font-semibold">Password Compromised</p>
            <p className="text-red-300 text-xs">
              This password has been found in {result.breach_count.toLocaleString()} known data breaches.
              Please use a different password.
            </p>
          </div>
        </motion.div>
      );
    }
    
    // Show safe status when no breaches found
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg flex items-start gap-2"
      >
        <span className="text-green-400 text-lg flex-shrink-0">✓</span>
        <div>
          <p className="text-green-400 text-sm font-semibold">Password Safe</p>
          <p className="text-green-300 text-xs">
            No breach records found for this password.
          </p>
        </div>
      </motion.div>
    );
  };

  /**
   * Copy password to clipboard
   */
  const copyPasswordToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-[#1f1f1f] border border-[#00c8ff]/20 rounded-xl p-8 space-y-6">
        
        {/* Password Input Section */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-white">
            Enter Password to Check
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Type your password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#00c8ff]/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00c8ff] transition-colors duration-300"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00c8ff] transition-colors"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Strength Meter Bar */}
        {password && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-gray-400">STRENGTH METER</span>
              {result && (
                <span className={`text-xs font-bold ${
                  result.score <= 1 ? "text-red-400" :
                  result.score === 2 ? "text-yellow-400" :
                  "text-green-400"
                }`}>
                  {result.strength}
                </span>
              )}
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${getStrengthColor()} transition-all duration-300`}
                initial={{ width: "0%" }}
                animate={{ width: getStrengthWidth() }}
              />
            </div>
          </motion.div>
        )}

        {/* Breach Warning */}
        {getBreachWarning()}

        {/* Error Message Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-2"
          >
            <span className="text-red-400 text-lg flex-shrink-0">✕</span>
            <div>
              <p className="text-red-400 text-sm font-semibold">API Error</p>
              <p className="text-red-300 text-xs">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Results Section */}
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 gap-4 pt-4 border-t border-[#00c8ff]/10"
          >
            <div className="p-4 bg-[#0a0a0a] rounded-lg border border-[#00c8ff]/10">
              <p className="text-xs text-gray-400 mb-1">Entropy</p>
              <p className="text-lg font-bold text-[#00c8ff]">{result.entropy} bits</p>
            </div>
            <div className="p-4 bg-[#0a0a0a] rounded-lg border border-[#00c8ff]/10">
              <p className="text-xs text-gray-400 mb-1">Crack Time</p>
              <p className="text-lg font-bold text-[#00c8ff]">{result.estimated_crack_time}</p>
            </div>

            {/* Suggestions */}
            {result.suggestions && result.suggestions.length > 0 && (
              <div className="col-span-2 p-4 bg-[#0a0a0a] rounded-lg border border-yellow-500/20">
                <p className="text-xs text-gray-400 mb-3 font-semibold">SUGGESTIONS</p>
                <ul className="space-y-2">
                  {result.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-xs text-yellow-300 flex items-start gap-2">
                      <span className="text-yellow-500 mt-0.5">›</span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-4"
          >
            <p className="text-gray-400 text-sm">Analyzing password...</p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t border-[#00c8ff]/10">
          {/* Check Strength Button */}
          <button
            onClick={manualCheckPassword}
            className="w-full bg-[#00c8ff] text-black font-semibold py-2 rounded-lg hover:scale-105 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!password || loading}
          >
            {loading ? "Analyzing..." : "Check Strength"}
          </button>

          {/* Generate Strong Password Button */}
          <button
            onClick={generateStrongPassword}
            className="mt-3 w-full bg-[#00c8ff] text-black font-semibold py-2 rounded-lg hover:scale-105 transition duration-200 flex items-center justify-center gap-2"
          >
            <Zap size={18} />
            Generate Strong Password
          </button>

          {/* Copy Password Button */}
          {password && (
            <motion.button
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={copyPasswordToClipboard}
              className="w-full bg-gray-700 text-white font-semibold py-2 rounded-lg hover:scale-105 transition duration-200 flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check size={18} /> Copied!
                </>
              ) : (
                <>
                  <Copy size={18} /> Copy Password
                </>
              )}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default PasswordChecker;
