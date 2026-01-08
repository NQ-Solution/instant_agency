'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Calendar,
  CalendarCog,
  Video,
  Play,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '@/components/ui/ThemeProvider';

const sidebarLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/models', label: 'Models', icon: Users },
  { href: '/admin/pages', label: 'Pages', icon: FileText },
  { href: '/admin/bookings', label: 'Meetings', icon: Calendar },
  { href: '/admin/booking-settings', label: '예약 설정', icon: CalendarCog },
  { href: '/admin/creators', label: 'Creators', icon: Video },
  { href: '/admin/live-videos', label: 'Live Videos', icon: Play },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme, mounted } = useTheme();

  // Don't show sidebar on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-theme-inverse text-theme-inverse rounded-lg flex items-center justify-center"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 admin-sidebar border-r border-[var(--text)]/10 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-[var(--text)]/10">
          <Link href="/admin" className="font-serif text-xl tracking-wider">
            Instant Agency
          </Link>
          <p className="text-xs text-[var(--text-muted)] mt-1">Admin Panel</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href ||
                (link.href !== '/admin' && pathname.startsWith(link.href));

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-theme-inverse text-theme-inverse'
                        : 'hover:bg-[var(--text)]/10'
                    }`}
                  >
                    <Icon size={18} className={isActive ? 'text-[var(--bg)]' : ''} />
                    <span className="text-sm">{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--text)]/10">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-[var(--text)]/10 text-[var(--text-muted)] transition-colors mb-2"
            aria-label="Toggle theme"
          >
            {mounted && (theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />)}
            <span className="text-sm">{mounted && (theme === 'dark' ? 'Light Mode' : 'Dark Mode')}</span>
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-[var(--text)]/10 text-[var(--text-muted)] transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm">View Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <main className="p-6 lg:p-8 pt-16 lg:pt-8">{children}</main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
