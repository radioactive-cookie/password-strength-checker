import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, ChevronDown } from "lucide-react";

const guides = [
  {
    id: "strong-passwords",
    title: "How to Create Strong Passwords",
    summary: "Practical rules for building passwords that withstand modern attacks.",
    content: [
      {
        heading: "Length is king",
        text: "Aim for at least 16 characters. Each additional character exponentially increases the number of possible combinations an attacker must try.",
      },
      {
        heading: "Mix character types",
        text: "Combine uppercase letters (A–Z), lowercase letters (a–z), digits (0–9), and special characters (!@#$%^&*). A wider character set dramatically raises entropy.",
      },
      {
        heading: "Use a passphrase",
        text: "A sequence of 4–5 random, unrelated words (e.g. 'correct-horse-battery-staple') is both memorable and statistically stronger than a short complex password.",
      },
      {
        heading: "Avoid personal information",
        text: "Birthdates, names, and addresses are trivially guessable. Attackers use targeted dictionaries built from public social media data.",
      },
      {
        heading: "Use a password manager",
        text: "Let a password manager generate and store unique passwords for every account. You only need to remember one master password.",
      },
    ],
  },
  {
    id: "entropy",
    title: "Why Password Entropy Matters",
    summary: "Understanding the math behind password unpredictability.",
    content: [
      {
        heading: "What is entropy?",
        text: "Entropy (measured in bits) quantifies how unpredictable a password is. A password with N bits of entropy requires an attacker to try 2ᴺ combinations in the worst case.",
      },
      {
        heading: "Character set size matters",
        text: "Using only lowercase letters gives a pool of 26 characters. Adding uppercase gives 52, adding digits gives 62, and adding special characters can exceed 90. More characters = more entropy per position.",
      },
      {
        heading: "Target entropy levels",
        text: "Below 28 bits: trivial to crack. 28–35 bits: weak. 36–59 bits: reasonable for low-value accounts. 60–127 bits: strong. 128+ bits: practically unbreakable with current technology.",
      },
      {
        heading: "Entropy vs. randomness",
        text: "True entropy requires true randomness. Password managers and cryptographic generators use system entropy sources (OS random number generators) to ensure genuine unpredictability.",
      },
    ],
  },
  {
    id: "mistakes",
    title: "Avoiding Common Password Mistakes",
    summary: "The most frequent vulnerabilities attackers exploit first.",
    content: [
      {
        heading: "Reusing passwords",
        text: "If one service is breached, attackers use credential stuffing to try the same password across hundreds of other sites. Every account must have a unique password.",
      },
      {
        heading: "Simple substitutions",
        text: "Replacing 'a' with '@' or 'i' with '1' (l33t speak) is well-known and included in modern attack dictionaries. These substitutions add negligible security.",
      },
      {
        heading: "Predictable patterns",
        text: "Passwords like 'Password1!' or 'Summer2025!' follow patterns that are near the top of every attacker's list. Seasonal words + year + punctuation = weak.",
      },
      {
        heading: "Ignoring breach notifications",
        text: "When you receive a breach alert, change the affected password immediately — and every other place you used the same password.",
      },
      {
        heading: "Storing passwords insecurely",
        text: "Never write passwords in plain text files, sticky notes, or unencrypted spreadsheets. Use a reputable password manager with AES-256 encryption.",
      },
    ],
  },
];

function GuideCard({ guide }: { guide: (typeof guides)[0] }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: "#1f1f1f",
        border: open
          ? "1px solid rgba(0,200,255,0.3)"
          : "1px solid rgba(255,255,255,0.06)",
        transition: "border-color 0.3s",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left"
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{
              background: open
                ? "rgba(0,200,255,0.12)"
                : "rgba(255,255,255,0.05)",
              border: open
                ? "1px solid rgba(0,200,255,0.3)"
                : "1px solid rgba(255,255,255,0.08)",
              transition: "all 0.3s",
            }}
          >
            <BookOpen
              size={18}
              style={{ color: open ? "#00c8ff" : "#666" }}
            />
          </div>
          <div>
            <h3
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "1rem",
                fontWeight: 600,
                color: "#ffffff",
                marginBottom: "0.25rem",
              }}
            >
              {guide.title}
            </h3>
            <p
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "0.85rem",
                color: "#666",
              }}
            >
              {guide.summary}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 ml-4"
        >
          <ChevronDown
            size={20}
            style={{ color: open ? "#00c8ff" : "#555" }}
          />
        </motion.div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div
              className="px-6 pb-6 pt-0"
              style={{
                borderTop: "1px solid rgba(0,200,255,0.08)",
              }}
            >
              <div className="pt-5 space-y-4">
                {guide.content.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div
                      className="w-1 rounded-full flex-shrink-0 mt-1"
                      style={{
                        background:
                          "linear-gradient(to bottom, #00c8ff, transparent)",
                        minHeight: "100%",
                        alignSelf: "stretch",
                      }}
                    />
                    <div>
                      <p
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.82rem",
                          color: "#00c8ff",
                          fontWeight: 600,
                          marginBottom: "0.3rem",
                        }}
                      >
                        {item.heading}
                      </p>
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "0.875rem",
                          color: "#888",
                          lineHeight: 1.65,
                        }}
                      >
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function SecurityGuide() {
  return (
    <section
      id="guide"
      className="py-24 px-4"
      style={{ background: "#0d0d0d" }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
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
            Knowledge Base
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
            Password Security Guide
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
            Best practices for creating and managing secure passwords — explained simply.
          </p>
        </motion.div>

        <div className="space-y-4">
          {guides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      </div>
    </section>
  );
}
