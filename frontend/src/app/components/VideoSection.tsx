import { motion } from "motion/react";

export function VideoSection() {
  return (
    <section id="video" className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative aspect-video rounded-xl border border-[#00c8ff]/20 overflow-hidden"
        >
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/3NjQ9b3pgIg"
            title="How to Create Strong Passwords"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 bg-[#1f1f1f] border border-[#00c8ff]/20 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-3">
            How to Create Strong Passwords
          </h3>
          <p className="text-gray-400 leading-relaxed">
            Learn the essential principles of password security in this comprehensive tutorial. 
            Discover how to create strong, memorable passwords that protect your accounts from 
            unauthorized access. This guide covers best practices for password creation, the importance 
            of password managers, and strategies for maintaining security across multiple platforms.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
