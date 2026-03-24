import { motion } from 'motion/react';
import { Play, Lightbulb } from 'lucide-react';

const tips = [
  'Never use the same password twice',
  'Update passwords regularly',
  'Use password managers for convenience',
  'Enable biometric authentication when available'
];

export function VideoSection() {
  return (
    <section id="video" className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            How to Create Strong Passwords
          </h2>
          <p className="text-gray-400 text-lg">
            Watch our comprehensive guide to password security
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-video bg-[#1f1f1f] rounded-xl border border-[#00c8ff]/20 overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#00c8ff]/10 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-[#00c8ff]/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-[#00c8ff]/30 group-hover:scale-110 transition-transform">
                <Play className="w-10 h-10 text-[#00c8ff] ml-1" fill="currentColor" />
              </div>
            </div>
            <div className="absolute inset-0 flex items-end p-6">
              <div className="text-white">
                <p className="text-sm text-gray-400 mb-1">Tutorial Video</p>
                <h3 className="text-lg font-semibold">Password Security Masterclass</h3>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-[#1f1f1f] border border-[#00c8ff]/20 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                What You'll Learn
              </h3>
              <p className="text-gray-400 mb-4">
                This comprehensive tutorial covers the essentials of password security, 
                from creating strong passwords to implementing multi-factor authentication. 
                Perfect for both beginners and security-conscious users.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Duration: 8:42</span>
                <span>•</span>
                <span>Difficulty: Beginner</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#00c8ff]/10 to-transparent border border-[#00c8ff]/20 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-[#00c8ff]" />
                <h3 className="text-lg font-semibold text-white">Quick Tips</h3>
              </div>
              <ul className="space-y-2">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-300">
                    <span className="text-[#00c8ff] mt-0.5">→</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
