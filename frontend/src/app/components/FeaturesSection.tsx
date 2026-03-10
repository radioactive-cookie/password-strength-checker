import { motion } from "motion/react";
import {
  Activity,
  KeyRound,
  ShieldAlert,
  Binary,
  Timer,
  BarChart2,
} from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Real-time Strength Analysis",
    description:
      "Instantly analyzes password strength as you type, providing live feedback on every character you add.",
    color: "#00c8ff",
    glow: "rgba(0,200,255,0.3)",
  },
  {
    icon: KeyRound,
    title: "Strong Password Generator",
    description:
      "Creates cryptographically secure random passwords with maximum entropy and high unpredictability.",
    color: "#33e0ff",
    glow: "rgba(51,224,255,0.3)",
  },
  {
    icon: ShieldAlert,
    title: "Password Breach Checker",
    description:
      "Detects if your password has appeared in known data breaches using a secure k-anonymity lookup.",
    color: "#ff6b6b",
    glow: "rgba(255,107,107,0.3)",
  },
  {
    icon: Binary,
    title: "Entropy Calculation",
    description:
      "Measures password unpredictability using Shannon entropy scoring based on character set size and length.",
    color: "#a78bfa",
    glow: "rgba(167,139,250,0.3)",
  },
  {
    icon: Timer,
    title: "Crack-Time Estimation",
    description:
      "Estimates how long it would take an attacker to brute-force your password using modern hardware.",
    color: "#ffd700",
    glow: "rgba(255,215,0,0.3)",
  },
  {
    icon: BarChart2,
    title: "Color-Coded Strength Indicator",
    description:
      "Visual strength feedback using a dynamic bar with red, yellow, and green indicators for instant clarity.",
    color: "#00e676",
    glow: "rgba(0,230,118,0.3)",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-24 px-4"
      style={{ background: "#0a0a0a" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span
            className="inline-block px-3 py-1 rounded-full mb-4"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.72rem",
              letterSpacing: "0.1em",
              color: "#00c8ff",
              background: "rgba(0,200,255,0.08)",
              border: "1px solid rgba(0,200,255,0.2)",
              textTransform: "uppercase",
            }}
          >
            Capabilities
          </span>
          <h2
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: "1rem",
            }}
          >
            Powerful Features
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "1rem",
              color: "#777",
              maxWidth: "480px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Advanced password security analysis at your fingertips.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                whileHover={{
                  y: -6,
                  boxShadow: `0 20px 40px rgba(0,0,0,0.4), 0 0 30px ${feat.glow}`,
                }}
                className="rounded-2xl p-6 cursor-default"
                style={{
                  background: "#1f1f1f",
                  border: "1px solid rgba(255,255,255,0.06)",
                  transition: "border-color 0.3s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    feat.color + "44";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "rgba(255,255,255,0.06)";
                }}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    background: `rgba(${feat.color === "#00c8ff" ? "0,200,255" : feat.color === "#33e0ff" ? "51,224,255" : feat.color === "#ff6b6b" ? "255,107,107" : feat.color === "#a78bfa" ? "167,139,250" : feat.color === "#ffd700" ? "255,215,0" : "0,230,118"},0.1)`,
                    border: `1px solid ${feat.color}33`,
                  }}
                >
                  <Icon size={22} style={{ color: feat.color }} />
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#ffffff",
                    marginBottom: "0.6rem",
                  }}
                >
                  {feat.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.87rem",
                    color: "#777",
                    lineHeight: 1.65,
                  }}
                >
                  {feat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
