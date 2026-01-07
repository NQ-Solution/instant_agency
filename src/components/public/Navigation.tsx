'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/components/ui/ThemeProvider';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { href: '/about', label: 'About' },
  { href: '/studio', label: 'Studio' },
  { href: '/models', label: 'Models' },
  { href: '/live', label: 'Live' },
  { href: '/contact', label: 'Contact' },
];

export default function Navigation() {
  const pathname = usePathname();
  const { theme, toggleTheme, mounted } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full px-6 md:px-8 py-5 flex justify-between items-center z-50 bg-gradient-to-b from-[var(--bg)] via-[var(--bg)]/80 to-transparent">
      <Link
        href="/"
        className="flex items-center gap-3 text-xl md:text-2xl tracking-[0.1em] font-logo font-bold"
      >
        {/* Logo Icon - inverts in dark mode */}
        <img
          src="/logo.png"
          alt=""
          className="w-6 h-6 md:w-7 md:h-7 no-grayscale"
          style={{ filter: 'var(--logo-filter, none)' }}
        />
        Instant Agency
      </Link>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex gap-8 lg:gap-12 list-none">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`text-xs tracking-widest uppercase transition-opacity duration-300 ${
                pathname === link.href ? 'opacity-100' : 'opacity-60 hover:opacity-100'
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 border border-theme-30 rounded-full flex items-center justify-center transition-all duration-300 hover:border-theme"
          aria-label="Toggle theme"
        >
          {mounted && (theme === 'dark' ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          ))}
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-10 h-10 border border-theme-30 rounded-full flex items-center justify-center"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[var(--bg)] border-t border-theme-10 p-6">
          <ul className="flex flex-col gap-4 list-none">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm tracking-widest uppercase block py-2 ${
                    pathname === link.href ? 'opacity-100' : 'opacity-60'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
