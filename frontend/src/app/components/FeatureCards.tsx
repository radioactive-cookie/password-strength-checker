import { motion } from 'motion/react';
import { Zap, Calculator, Clock, Lightbulb } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Real-time strength analysis',
    description: 'Instant feedback as you type, powered by advanced algorithms that detect patterns and vulnerabilities.'
  },
  {
    icon: Calculator,
    title: 'Entropy calculation',
    description: 'Measure password randomness and unpredictability using mathematical entropy scoring.'
  },
  {
    icon: Clock,
    title: 'Crack-time estimation',
    description: 'See how long it would take hackers to crack your password using brute-force methods.'
  },
  {
    icon: Lightbulb,
    title: 'Security suggestions',
    description: 'Get personalized recommendations to make your passwords virtually unbreakable.'
  }
];

export function FeatureCards() {
  return (
    <section id="features" className="py-24 px-4 bg-[#0a0a0a]">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Powerful Features
          </h2>
          <p className="text-gray-400 text-lg">
            Advanced security analysis at your fingertips
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="relative bg-[#1f1f1f] border border-[#00c8ff]/20 rounded-xl p-8 overflow-hidden group cursor-pointer"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00c8ff]/0 via-[#00c8ff]/5 to-[#00c8ff]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00c8ff]/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative">
                <div className="w-14 h-14 bg-[#00c8ff]/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#00c8ff]/20 group-hover:shadow-[0_0_20px_rgba(0,200,255,0.3)] transition-all">
                  <feature.icon className="w-7 h-7 text-[#00c8ff]" />
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
