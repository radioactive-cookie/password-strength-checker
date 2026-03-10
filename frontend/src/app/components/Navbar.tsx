import { Shield } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-[#00c8ff]/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#00c8ff]" />
            <span className="text-xl font-bold bg-gradient-to-r from-[#00c8ff] to-white bg-clip-text text-transparent">
              SecurePass
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-[#00c8ff] transition-colors">
              Features
            </a>
            <a href="#guide" className="text-gray-300 hover:text-[#00c8ff] transition-colors">
              Guide
            </a>
            <a href="#video" className="text-gray-300 hover:text-[#00c8ff] transition-colors">
              Tutorial
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
