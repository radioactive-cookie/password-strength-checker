import { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  feedback: string[];
}

export function HeroSection() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState<PasswordStrength | null>(null);

  const checkPasswordStrength = (pwd: string): PasswordStrength => {
    let score = 0;
    const feedback: string[] = [];

    if (pwd.length === 0) {
      return { score: 0, label: 'No password', color: '#666', feedback: [] };
    }

    // Length check
    if (pwd.length >= 8) score += 20;
    if (pwd.length >= 12) score += 10;
    if (pwd.length >= 16) score += 10;
    else feedback.push('Use at least 12 characters');

    // Character variety
    if (/[a-z]/.test(pwd)) score += 15;
    else feedback.push('Add lowercase letters');
    
    if (/[A-Z]/.test(pwd)) score += 15;
    else feedback.push('Add uppercase letters');
    
    if (/[0-9]/.test(pwd)) score += 15;
    else feedback.push('Add numbers');
    
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 15;
    else feedback.push('Add special characters (!@#$%^&*)');

    // Common patterns penalty
    if (/(.)\1{2,}/.test(pwd)) {
      score -= 10;
      feedback.push('Avoid repeated characters');
    }
    
    if (/^[0-9]+$/.test(pwd)) {
      score -= 20;
      feedback.push('Don\'t use only numbers');
    }

    // Determine label and color
    let label = '';
    let color = '';
    if (score < 30) {
      label = 'Very Weak';
      color = '#ff4444';
    } else if (score < 50) {
      label = 'Weak';
      color = '#ff9944';
    } else if (score < 70) {
      label = 'Fair';
      color = '#ffdd44';
    } else if (score < 90) {
      label = 'Strong';
      color = '#88ff44';
    } else {
      label = 'Very Strong';
      color = '#00c8ff';
    }

    return { score: Math.max(0, Math.min(100, score)), label, color, feedback };
  };

  const handleCheck = () => {
    const result = checkPasswordStrength(password);
    setStrength(result);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (strength) {
      setStrength(checkPasswordStrength(value));
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-[#00c8ff] to-white bg-clip-text text-transparent">
            Check Your Password Strength Instantly
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto">
            Strong passwords are your first line of defense against cyber threats. 
            Test your password security in real-time with our advanced analyzer.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#1f1f1f] border border-[#00c8ff]/20 rounded-xl p-8 shadow-[0_0_30px_rgba(0,200,255,0.1)]"
          >
            <div className="relative mb-6">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="Enter your password..."
                className="h-14 text-lg pr-12 bg-[#0a0a0a] border-[#00c8ff]/30 focus:border-[#00c8ff] transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00c8ff] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Button
              onClick={handleCheck}
              className="w-full h-12 bg-[#00c8ff] hover:bg-[#00a8dd] text-black font-semibold transition-all shadow-[0_0_20px_rgba(0,200,255,0.3)] hover:shadow-[0_0_30px_rgba(0,200,255,0.5)]"
            >
              Check Strength
            </Button>

            {strength && strength.score > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-8"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Password Strength</span>
                  <span className="text-sm font-semibold" style={{ color: strength.color }}>
                    {strength.label}
                  </span>
                </div>
                <Progress 
                  value={strength.score} 
                  className="h-2 bg-[#0a0a0a]"
                  style={{
                    ['--progress-color' as any]: strength.color
                  }}
                />
                
                {strength.feedback.length > 0 && (
                  <div className="mt-6 text-left">
                    <p className="text-sm font-semibold text-gray-300 mb-2">Suggestions:</p>
                    <ul className="space-y-1">
                      {strength.feedback.map((item, index) => (
                        <li key={index} className="text-sm text-gray-400 flex items-start gap-2">
                          <span className="text-[#00c8ff] mt-0.5">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
