import { useState, useEffect } from "react";
import { Shield, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Guide", href: "#guide" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(10, 10, 10, 0.85)"
          : "rgba(10, 10, 10, 0.4)",
        backdropFilter: "blur(12px)",
        borderBottom: scrolled ? "1px solid rgba(0, 200, 255, 0.12)" : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 group"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(0, 200, 255, 0.1)",
                border: "1px solid rgba(0, 200, 255, 0.4)",
                boxShadow: "0 0 12px rgba(0, 200, 255, 0.2)",
              }}
            >
              <Shield size={18} style={{ color: "#00c8ff" }} />
            </div>
            <span
              className="hidden sm:block"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: "#00c8ff",
                fontSize: "1.1rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
              }}
            >
              password_checker
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="relative group py-1 transition-colors duration-200"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "#a0a0a0",
                  fontSize: "0.85rem",
                  letterSpacing: "0.04em",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#00c8ff")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "#a0a0a0")
                }
              >
                {link.label}
                <span
                  className="absolute bottom-0 left-0 w-0 h-px transition-all duration-300 group-hover:w-full"
                  style={{ background: "#00c8ff" }}
                />
              </button>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg"
            style={{
              color: "#00c8ff",
              background: "rgba(0, 200, 255, 0.05)",
              border: "1px solid rgba(0, 200, 255, 0.2)",
            }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              background: "rgba(10, 10, 10, 0.95)",
              borderBottom: "1px solid rgba(0, 200, 255, 0.15)",
            }}
          >
            <nav className="flex flex-col px-4 pb-4 pt-2 gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="text-left py-2 px-3 rounded-lg transition-colors duration-200"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "#a0a0a0",
                    fontSize: "0.85rem",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#00c8ff";
                    e.currentTarget.style.background = "rgba(0, 200, 255, 0.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#a0a0a0";
                    e.currentTarget.style.background = "none";
                  }}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
