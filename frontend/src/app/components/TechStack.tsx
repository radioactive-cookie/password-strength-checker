import { motion } from "motion/react";

const techGroups = [
  {
    label: "Frontend",
    items: [
      { name: "React", icon: "⚛️", color: "#61dafb", desc: "UI Framework" },
      { name: "Vite", icon: "⚡", color: "#ffd62e", desc: "Build Tool" },
      { name: "TailwindCSS", icon: "🎨", color: "#38bdf8", desc: "Styling" },
    ],
  },
  {
    label: "Backend",
    items: [
      { name: "FastAPI", icon: "🚀", color: "#00c8ff", desc: "REST API (Python)" },
      { name: "Python", icon: "🐍", color: "#4db33d", desc: "Runtime" },
    ],
  },
  {
    label: "Security Tools",
    items: [
      {
        name: "Entropy Calc",
        icon: "📊",
        color: "#a78bfa",
        desc: "Password unpredictability scoring",
      },
      {
        name: "Breach Detection",
        icon: "🛡️",
        color: "#ff6b6b",
        desc: "k-anonymity breach lookup",
      },
      {
        name: "Strength Analyzer",
        icon: "🔍",
        color: "#00e676",
        desc: "Real-time analysis engine",
      },
    ],
  },
];

export function TechStack() {
  return (
    <section
      id="about"
      className="py-24 px-4"
      style={{ background: "#0a0a0a" }}
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
            Built With
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
            Technology Stack
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
            Modern, fast, and secure technologies powering password_checker.
          </p>
        </motion.div>

        <div className="space-y-10">
          {techGroups.map((group, gi) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: gi * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-5">
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.72rem",
                    letterSpacing: "0.1em",
                    color: "#00c8ff",
                    textTransform: "uppercase",
                  }}
                >
                  {group.label}
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ background: "rgba(0,200,255,0.12)" }}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {group.items.map((tech, i) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}
                    viewport={{ once: true }}
                    whileHover={{
                      y: -4,
                      boxShadow: `0 12px 30px rgba(0,0,0,0.4), 0 0 20px ${tech.color}22`,
                    }}
                    className="rounded-xl p-5 flex flex-col gap-3 cursor-default"
                    style={{
                      background: "#1f1f1f",
                      border: "1px solid rgba(255,255,255,0.06)",
                      transition: "border-color 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        tech.color + "44";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "rgba(255,255,255,0.06)";
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                        style={{
                          background: tech.color + "14",
                          border: `1px solid ${tech.color}33`,
                        }}
                      >
                        {tech.icon}
                      </span>
                      <div>
                        <p
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.9rem",
                            fontWeight: 600,
                            color: "#ffffff",
                          }}
                        >
                          {tech.name}
                        </p>
                        <p
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontSize: "0.75rem",
                            color: "#666",
                          }}
                        >
                          {tech.desc}
                        </p>
                      </div>
                    </div>
                    <div
                      className="h-0.5 w-full rounded-full"
                      style={{
                        background: `linear-gradient(to right, ${tech.color}66, transparent)`,
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
