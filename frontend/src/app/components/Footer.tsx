import { Shield, Github, Mail, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer
      id="contact"
      style={{
        background: "#080808",
        borderTop: "1px solid rgba(0,200,255,0.08)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(0, 200, 255, 0.08)",
                border: "1px solid rgba(0, 200, 255, 0.25)",
              }}
            >
              <Shield size={16} style={{ color: "#00c8ff" }} />
            </div>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: "#ffffff",
                fontSize: "1rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
              }}
            >
              Secure<span style={{ color: "#00c8ff" }}>Pass</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/radioactive-cookie"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors duration-200"
              style={{ color: "#666", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00c8ff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
            >
              <Github size={17} />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.8rem",
                }}
              >
                GitHub
              </span>
            </a>

            <a
              href="mailto:pritammunshi2005@gmail.com"
              className="flex items-center gap-2 transition-colors duration-200"
              style={{ color: "#666", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#00c8ff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
            >
              <Mail size={17} />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.8rem",
                }}
              >
                Contact
              </span>
            </a>
          </div>

          {/* Copyright */}
          <div className="flex items-center gap-1.5">
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.75rem",
                color: "#444",
              }}
            >
              © 2025 password_checker · Made with
            </span>
            <Heart size={12} style={{ color: "#ff6b6b" }} />
          </div>
        </div>

        {/* Divider + disclaimer */}
        <div
          className="mt-8 pt-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.75rem",
              color: "#333",
              textAlign: "center",
              lineHeight: 1.6,
            }}
          >
            password_checker uses k-anonymity to check passwords against breach databases — your full password is never sent externally.
            This tool is for educational purposes. Always use a trusted password manager for storing credentials.
          </p>
        </div>
      </div>
    </footer>
  );
}
