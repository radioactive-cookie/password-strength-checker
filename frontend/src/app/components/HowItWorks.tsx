import { motion } from "motion/react";
import { PenLine, Cpu, CheckCircle2, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: PenLine,
    number: "01",
    title: "Enter or Generate a Password",
    description:
      "Type your existing password into the analyzer or click 'Generate' to instantly create a cryptographically strong password.",
    color: "#00c8ff",
    glow: "rgba(0,200,255,0.4)",
  },
  {
    icon: Cpu,
    number: "02",
    title: "Multi-Algorithm Analysis",
    description:
      "password_checker sends your password to our FastAPI backend which runs entropy calculation, breach lookup, and strength scoring in parallel.",
    color: "#33e0ff",
    glow: "rgba(51,224,255,0.4)",
  },
  {
    icon: CheckCircle2,
    number: "03",
    title: "View Comprehensive Results",
    description:
      "See your strength score, entropy in bits, estimated crack time, breach status, and personalized suggestions to improve your password.",
    color: "#00e676",
    glow: "rgba(0,230,118,0.4)",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 px-4"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(0,200,255,0.04) 0%, #0a0a0a 70%)",
      }}
    >
      <div className="max-w-5xl mx-auto">
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
            Workflow
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
            How It Works
          </h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "1rem",
              color: "#777",
              maxWidth: "440px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Three simple steps to a comprehensive security analysis.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-0">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="flex flex-col md:flex-row items-center flex-1 gap-0"
              >
                {/* Step Card */}
                <motion.div
                  className="flex-1 w-full"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  viewport={{ once: true }}
                >
                  <div
                    className="rounded-2xl p-6 h-full"
                    style={{
                      background: "#1f1f1f",
                      border: `1px solid ${step.color}22`,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Background number */}
                    <span
                      style={{
                        position: "absolute",
                        top: "-10px",
                        right: "10px",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "4.5rem",
                        fontWeight: 700,
                        color: `${step.color}0d`,
                        lineHeight: 1,
                        userSelect: "none",
                      }}
                    >
                      {step.number}
                    </span>

                    {/* Icon */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                      style={{
                        background: `${step.color}18`,
                        border: `1px solid ${step.color}40`,
                        boxShadow: `0 0 20px ${step.glow}`,
                      }}
                    >
                      <Icon size={22} style={{ color: step.color }} />
                    </div>

                    {/* Step label */}
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.68rem",
                        letterSpacing: "0.1em",
                        color: step.color,
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: "0.5rem",
                      }}
                    >
                      Step {step.number}
                    </span>

                    <h3
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "1.05rem",
                        fontWeight: 600,
                        color: "#ffffff",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "0.875rem",
                        color: "#777",
                        lineHeight: 1.65,
                      }}
                    >
                      {step.description}
                    </p>
                  </div>
                </motion.div>

                {/* Arrow connector */}
                {i < steps.length - 1 && (
                  <motion.div
                    className="hidden md:flex items-center justify-center mx-3 flex-shrink-0"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.15 + 0.3 }}
                    viewport={{ once: true }}
                  >
                    <ArrowRight
                      size={24}
                      style={{ color: "rgba(0,200,255,0.3)" }}
                    />
                  </motion.div>
                )}

                {/* Mobile arrow */}
                {i < steps.length - 1 && (
                  <motion.div
                    className="flex md:hidden items-center justify-center my-3"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.15 + 0.3 }}
                    viewport={{ once: true }}
                  >
                    <svg width="20" height="28" viewBox="0 0 20 28">
                      <path
                        d="M10 0 L10 20 M4 14 L10 22 L16 14"
                        stroke="rgba(0,200,255,0.3)"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
