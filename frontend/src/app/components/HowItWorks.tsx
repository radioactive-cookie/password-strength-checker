import { motion } from 'motion/react';
import { KeyRound, Cpu, Shield } from 'lucide-react';

const steps = [
  {
    icon: KeyRound,
    title: 'Enter your password',
    description: 'Type any password you want to test. Your data never leaves your browser.'
  },
  {
    icon: Cpu,
    title: 'AI analyzes the strength',
    description: 'Our algorithm evaluates length, complexity, and pattern vulnerabilities.'
  },
  {
    icon: Shield,
    title: 'Get security recommendations',
    description: 'Receive instant feedback and actionable tips to improve your password.'
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            How It Works
          </h2>
          <p className="text-gray-400 text-lg">
            Three simple steps to stronger passwords
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative bg-[#1f1f1f] border border-[#00c8ff]/20 rounded-xl p-8 hover:border-[#00c8ff]/50 transition-all group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#00c8ff]/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="w-16 h-16 bg-[#00c8ff]/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#00c8ff]/20 transition-colors">
                  <step.icon className="w-8 h-8 text-[#00c8ff]" />
                </div>
                
                <div className="text-4xl font-bold text-[#00c8ff]/20 mb-4">
                  0{index + 1}
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-white">
                  {step.title}
                </h3>
                
                <p className="text-gray-400">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
