import Link from "next/link";
import { Home, Youtube } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-red-600 to-red-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Youtube className="w-8 h-8 text-white" />
              <span className="text-white font-bold text-xl">
                YouTube AI Companion
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <Home className="w-4 h-4" />
              <span className="font-medium">Home</span>
            </Link>

            <Link
              href="/ai-companion"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <Home className="w-4 h-4" />
              <span className="font-medium">AI Companion</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
