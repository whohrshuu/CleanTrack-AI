import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Leaf, Menu, X } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home', exact: true },
  { to: '/about', label: 'About' },
  { to: '/features', label: 'Features' },
  { to: '/contact', label: 'Contact' },
];

export default function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-primary-500 flex items-center justify-center">
                <Leaf size={14} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-neutral-900 tracking-tight">CleanTrack AI</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.exact}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-1.5 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 text-sm font-medium text-white bg-primary-500 rounded-md hover:bg-primary-600 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-md text-neutral-600 hover:bg-neutral-100"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-white">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.exact}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive ? 'text-primary-600 bg-primary-50' : 'text-neutral-600 hover:bg-neutral-50'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="pt-2 mt-2 border-t border-border flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center px-3 py-2 text-sm font-medium text-neutral-700 border border-border rounded-md"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center px-3 py-2 text-sm font-medium text-white bg-primary-500 rounded-md"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer — simple, not template-y */}
      <footer className="border-t border-border bg-neutral-50">
        <div className="max-w-5xl mx-auto px-5 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-primary-500 flex items-center justify-center">
                <Leaf size={10} className="text-white" />
              </div>
              <span className="text-sm font-semibold text-neutral-700">CleanTrack AI</span>
            </div>
            <nav className="flex flex-wrap items-center gap-5 text-[13px] text-neutral-500">
              <Link to="/about" className="hover:text-neutral-800 transition-colors">About</Link>
              <Link to="/features" className="hover:text-neutral-800 transition-colors">Features</Link>
              <Link to="/contact" className="hover:text-neutral-800 transition-colors">Contact</Link>
              <span className="text-neutral-300">·</span>
              <a href="mailto:support@cleantrack.ai" className="hover:text-neutral-800 transition-colors">support@cleantrack.ai</a>
            </nav>
          </div>
          <p className="text-[11px] text-neutral-400 mt-5">
            © 2026 CleanTrack AI · Civic Innovation Lab, BBMP Complex, Bengaluru 560001
          </p>
        </div>
      </footer>
    </div>
  );
}
