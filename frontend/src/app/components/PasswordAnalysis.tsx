import { BarChart2, Clock, ShieldAlert, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { PasswordCheckResult } from "../services/api";

function MetricCard({
  icon,
  label,
  value,
  color,
  glow,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  glow: string;
}) {
  return (
    <div
      className="flex-1 rounded-xl p-4 transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: `1px solid rgba(${color === "#00c8ff" ? "0,200,255" : color === "#ffd700" ? "255,215,0" : "255,59,59"},0.2)`,
        minWidth: 0,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span style={{ color }}>{icon}</span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.7rem",
            color: "#888",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      </div>
      <p
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.85rem",
          color,
          fontWeight: 600,
          textShadow: `0 0 8px ${glow}`,
          wordBreak: "break-word",
        }}
      >
        {value}
      </p>
    </div>
  );
}

interface PasswordAnalysisProps {
  result: PasswordCheckResult;
  showAnimation?: boolean;
}

export function PasswordAnalysis({
  result,
  showAnimation = true,
}: PasswordAnalysisProps) {
  const suggestions = result.suggestions || [];

  const content = (
    <div>
      {/* Metrics Row */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <MetricCard
          icon={<BarChart2 size={14} />}
          label="Entropy"
          value={`${Number(result.entropy).toFixed(1)} bits`}
          color="#00c8ff"
          glow="rgba(0,200,255,0.5)"
        />
        <MetricCard
          icon={<Clock size={14} />}
          label="Crack Time"
          value={result.estimated_crack_time}
          color="#ffd700"
          glow="rgba(255,215,0,0.4)"
        />
        <MetricCard
          icon={
            result.breach_count > 0 ? (
              <ShieldAlert size={14} />
            ) : (
              <ShieldCheck size={14} />
            )
          }
          label="Breach Status"
          value={
            result.breach_count > 0
              ? `Found in ${result.breach_count.toLocaleString()} breaches`
              : "No breach records found"
          }
          color={result.breach_count > 0 ? "#ff3b3b" : "#00e676"}
          glow={
            result.breach_count > 0
              ? "rgba(255,59,59,0.4)"
              : "rgba(0,230,118,0.4)"
          }
        />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div
          className="rounded-xl p-4"
          style={{
            background: "rgba(255,215,0,0.04)",
            border: "1px solid rgba(255,215,0,0.15)",
          }}
        >
          <p
            className="mb-3"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.7rem",
              color: "#888",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Suggestions to improve
          </p>
          <ul className="space-y-2">
            {suggestions.map((s, i) => (
              <li
                key={i}
                className="flex items-start gap-2"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.82rem",
                  color: "#ccc",
                }}
              >
                <span style={{ color: "#ffd700", marginTop: "2px" }}>›</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  if (!showAnimation) {
    return <>{content}</>;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        {content}
      </motion.div>
    </AnimatePresence>
  );
}
