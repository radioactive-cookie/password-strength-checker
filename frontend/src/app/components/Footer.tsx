import { Shield, Github, BookOpen, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] border-t border-[#00c8ff]/20 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-[#00c8ff]" />
              <span className="text-xl font-bold bg-gradient-to-r from-[#00c8ff] to-white bg-clip-text text-transparent">
                SecurePass
              </span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Your privacy matters. All password checks happen locally in your browser. 
              We never store or transmit your passwords.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-[#00c8ff] transition-colors flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Documentation
                </a>
              </li>
              <li>
                <a href="#guide" className="text-gray-400 hover:text-[#00c8ff] transition-colors flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Security Guide
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://github.com/radioactive-cookie" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00c8ff] transition-colors flex items-center gap-2">
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </li>
              <li>
                <a href="mailto:pritammunshi2005@gmail.com" className="text-gray-400 hover:text-[#00c8ff] transition-colors duration-300 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#00c8ff]/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} SecurePass. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-[#00c8ff] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#00c8ff] transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
