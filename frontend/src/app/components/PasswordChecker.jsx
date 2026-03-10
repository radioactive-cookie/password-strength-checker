import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Zap, AlertCircle, Check } from "lucide-react";
import { checkPassword } from "../services/api";

function PasswordChecker() {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const debounceTimer = useRef(null);

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
      return;
    }

    // Set timer for debounced check
    setLoading(true);
    debounceTimer.current = setTimeout(async () => {
      try {
        const data = await checkPassword(password);
        setResult(data);
      } catch (error) {
        console.error("Error checking password:", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    // Cleanup timer on component unmount
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [password]);

  /**
   * Generate a secure random password
   * Length: 16 characters
   * Includes: uppercase, lowercase, numbers, special characters
   */
  const generateSecurePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    const allChars = uppercase + lowercase + numbers + specialChars;
    let newPassword = "";

    // Ensure at least one of each character type
    newPassword += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
    newPassword += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
    newPassword += numbers.charAt(Math.floor(Math.random() * numbers.length));
    newPassword += specialChars.charAt(Math.floor(Math.random() * specialChars.length));

    // Fill remaining characters randomly
    for (let i = newPassword.length; i < 16; i++) {
      newPassword += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    // Shuffle the password
    const shuffled = newPassword
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    setPassword(shuffled);
  };

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
   * Get security warning for breached passwords
   */
  const getBreachWarning = () => {
    if (!result || result.breach_count === 0) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-2"
      >
        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-red-400 text-sm font-semibold">⚠️ Password Compromised</p>
          <p className="text-red-300 text-xs">
            This password has been found in {result.breach_count.toLocaleString()} known data breaches.
            Please use a different password.
          </p>
        </div>
      </motion.div>
    );
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

        {/* Results Section */}
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
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
              <div className="col-span-2 p-4 bg-[#0a0a0a] rounded-lg border border-[#00c8ff]/10">
                <p className="text-xs font-semibold text-gray-300 mb-2">SUGGESTIONS</p>
                <ul className="space-y-1">
                  {result.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="text-xs text-gray-400 flex items-start gap-2">
                      <span className="text-[#00c8ff] mt-1">→</span>
                      <span>{suggestion}</span>
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
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-center py-4"
          >
            <p className="text-sm text-gray-400">Analyzing password...</p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-[#00c8ff]/10">
          <button
            onClick={generateSecurePassword}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-[#00c8ff]/20 to-[#00c8ff]/10 border border-[#00c8ff]/40 rounded-lg text-[#00c8ff] font-semibold hover:border-[#00c8ff]/60 hover:from-[#00c8ff]/30 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Generate Secure Password
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default PasswordChecker;