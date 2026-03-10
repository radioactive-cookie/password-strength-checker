import { motion } from 'motion/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { CheckCircle2, XCircle, Shield } from 'lucide-react';

const strongPasswordTips = [
  'Use at least 12-16 characters',
  'Mix uppercase and lowercase letters',
  'Include numbers and special characters',
  'Avoid personal information (names, birthdays)',
  'Use unique passwords for each account',
  'Consider using a passphrase (e.g., "Coffee!Morning@2024")'
];

const commonMistakes = [
  'Using dictionary words',
  'Sequential characters (abc, 123)',
  'Repeating characters (aaa, 111)',
  'Common substitutions (P@ssw0rd)',
  'Sharing passwords across accounts',
  'Storing passwords in plain text'
];

const bestPractices = [
  'Enable two-factor authentication (2FA)',
  'Use a password manager',
  'Change passwords every 3-6 months',
  'Never share passwords via email or text',
  'Avoid saving passwords in browsers',
  'Create security questions with unique answers'
];

export function GuideSection() {
  return (
    <section id="guide" className="py-24 px-4 bg-[#0a0a0a]">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Password Security Guide
          </h2>
          <p className="text-gray-400 text-lg">
            Everything you need to know about creating secure passwords
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem 
              value="strong" 
              className="bg-[#1f1f1f] border border-[#00c8ff]/20 rounded-xl px-6 overflow-hidden"
            >
              <AccordionTrigger className="hover:no-underline py-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#00c8ff]" />
                  <span className="text-xl font-semibold text-white">What makes a strong password?</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <ul className="space-y-3 mt-2">
                  {strongPasswordTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300">
                      <span className="text-[#00c8ff] mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem 
              value="mistakes" 
              className="bg-[#1f1f1f] border border-[#00c8ff]/20 rounded-xl px-6 overflow-hidden"
            >
              <AccordionTrigger className="hover:no-underline py-6">
                <div className="flex items-center gap-3">
                  <XCircle className="w-6 h-6 text-[#ff4444]" />
                  <span className="text-xl font-semibold text-white">Common password mistakes</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <ul className="space-y-3 mt-2">
                  {commonMistakes.map((mistake, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300">
                      <span className="text-[#ff4444] mt-1">✕</span>
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem 
              value="practices" 
              className="bg-[#1f1f1f] border border-[#00c8ff]/20 rounded-xl px-6 overflow-hidden"
            >
              <AccordionTrigger className="hover:no-underline py-6">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-[#00c8ff]" />
                  <span className="text-xl font-semibold text-white">Best practices for password security</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-6">
                <ul className="space-y-3 mt-2">
                  {bestPractices.map((practice, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300">
                      <span className="text-[#00c8ff] mt-1">✓</span>
                      <span>{practice}</span>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
