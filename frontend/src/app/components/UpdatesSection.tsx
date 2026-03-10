import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

const badges = [
  {
    label: "Strong Password Generator",
    color: "#00c8ff",
    glow: "rgba(0,200,255,0.4)",
  },
  {
    label: "Real-time Strength Checker",
    color: "#33e0ff",
    glow: "rgba(51,224,255,0.4)",
  },
  {
    label: "Password Breach Detection",
    color: "#ff6b6b",
    glow: "rgba(255,107,107,0.4)",
  },
  {
    label: "Entropy Calculation",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.4)",
  },
  {
    label: "Crack-Time Estimation",
    color: "#ffd700",
    glow: "rgba(255,215,0,0.4)",
  },
];

export function UpdatesSection() {
  return (
    <section
      className="py-24 px-4"
      style={{
        background:
          "radial-gradient(ellipse at bottom, rgba(0,200,255,0.05) 0%, #0d0d0d 60%)",
      }}
    >
      <div className="max-w-5xl mx-auto text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles size={16} style={{ color: "#00c8ff" }} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.72rem",
                letterSpacing: "0.1em",
                color: "#00c8ff",
                textTransform: "uppercase",
              }}
            >
              What's New
            </span>
            <Sparkles size={16} style={{ color: "#00c8ff" }} />
          </div>
          <h2
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: "1rem",
            }}
          >
            Latest Enhancements
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "1rem",
              color: "#777",
              maxWidth: "460px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Recently implemented features that power your password security analysis.
          </p>
        </motion.div>

        {/* Badges */}
        <div className="flex flex-wrap gap-4 justify-center">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.label}
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.06, y: -2 }}
            >
              <div
                className="flex items-center gap-2 px-5 py-2.5 rounded-full"
                style={{
                  background: `${badge.color}12`,
                  border: `1px solid ${badge.color}44`,
                  boxShadow: `0 0 16px ${badge.glow}, inset 0 0 10px ${badge.color}08`,
                  cursor: "default",
                }}
              >
                {/* Pulse dot */}
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{
                    background: badge.color,
                    boxShadow: `0 0 6px ${badge.glow}`,
                    animation: "pulse 2s ease-in-out infinite",
                  }}
                />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.82rem",
                    color: badge.color,
                    fontWeight: 500,
                    letterSpacing: "0.02em",
                    textShadow: `0 0 8px ${badge.glow}`,
                  }}
                >
                  {badge.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Timeline hint */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12"
        >
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.75rem",
              color: "#444",
              letterSpacing: "0.05em",
            }}
          >
            — Latest release · March 2025 —
          </p>
        </motion.div>
      </div>
    </section>
  );
}
