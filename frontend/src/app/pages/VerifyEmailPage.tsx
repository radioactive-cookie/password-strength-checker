import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Shield, ArrowLeft, AlertCircle, CheckCircle2, Mail, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const { verifyEmail, requiresVerification, verificationEmail, isLoading, error, clearError } = useAuth();
  
  const [otp, setOtp] = useState('');
  const [localError, setLocalError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [verified, setVerified] = useState(false);

  // Get username from localStorage (set during registration)
  const [username, setUsername] = useState('');
  
  useEffect(() => {
    const stored = localStorage.getItem('securepass_temp_username');
    if (stored) {
      setUsername(stored);
    }
  }, []);

  // Timer for OTP expiration
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Redirect if not in verification flow
  useEffect(() => {
    if (!requiresVerification && !verificationEmail) {
      navigate('/register');
    }
  }, [requiresVerification, verificationEmail, navigate]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!otp.trim()) {
      setLocalError('Please enter the verification code.');
      return;
    }

    if (otp.trim().length !== 6 || !/^\d+$/.test(otp.trim())) {
      setLocalError('Please enter a valid 6-digit code.');
      return;
    }

    const success = await verifyEmail(username, otp.trim());
    if (success) {
      setVerified(true);
      // Clean up temp storage
      localStorage.removeItem('securepass_temp_username');
      
      // Redirect to dashboard after brief delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
  };

  const handleResendOTP = () => {
    // TODO: Implement resend OTP functionality
    setLocalError('Resend OTP feature coming soon.');
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
          {/* Glow corners */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#00c8ff]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#00c8ff]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {!verified ? (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#00c8ff]/10 mb-4">
                    <Mail className="w-6 h-6 text-[#00c8ff]" />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2">Verify Your Email</h1>
                  <p className="text-[#999] text-sm">
                    We sent a verification code to<br />
                    <span className="text-[#00c8ff] font-medium">{verificationEmail}</span>
                  </p>
                </div>

                {/* Timer */}
                <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-[#00c8ff]/5 border border-[#00c8ff]/20 rounded-lg">
                  <Clock className="w-4 h-4 text-[#00c8ff]" />
                  <span className="text-sm text-[#00c8ff]">
                    Code expires in {formatTime(timeLeft)}
                  </span>
                </div>

                {/* Error Message */}
                {(localError || error) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-red-400">{localError || error}</span>
                  </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleVerify} className="space-y-6">
                  {/* OTP Input */}
                  <div>
                    <label className="block text-sm font-medium text-[#ccc] mb-2">
                      6-Digit Code
                    </label>
                    <input
                      type="text"
                      placeholder="000000"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      disabled={isLoading}
                      className="w-full px-4 py-3 bg-[#333] border border-[#555] rounded-lg text-white text-center text-2xl tracking-widest placeholder-[#666] focus:outline-none focus:border-[#00c8ff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading || !otp || timeLeft === 0}
                    className="w-full bg-gradient-to-r from-[#00c8ff] to-[#0099ff] text-[#0a0a0a] font-bold py-3 rounded-lg hover:shadow-lg hover:shadow-[#00c8ff]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Verifying...' : 'Verify Email'}
                  </button>

                  {/* Resend OTP */}
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="w-full pl-4 pr-4 py-3 text-[#00c8ff] font-medium hover:text-[#00ffff] text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Didn't receive the code? Resend
                  </button>
                </form>

                {/* Back Button */}
                <button
                  onClick={() => navigate('/register')}
                  className="mt-6 flex items-center justify-center gap-2 w-full text-[#00c8ff] hover:text-[#00ffff] font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Registration
                </button>
              </>
            ) : (
              <>
                {/* Success State */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 mb-6"
                  >
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
                  <p className="text-[#999] mb-6">
                    Your email has been verified successfully.
                  </p>
                  <p className="text-sm text-[#666]">
                    Redirecting to dashboard...
                  </p>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
