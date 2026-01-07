import { Users, Calendar, FileText, Video, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';

// This would fetch real data from the API in production
async function getDashboardStats() {
  // Placeholder stats - in production, fetch from MongoDB
  return {
    totalModels: 24,
    pendingBookings: 5,
    totalCreators: 12,
    monthlyViews: '2.5M',
  };
}

async function getRecentBookings() {
  // Placeholder data
  return [
    { id: '1', customer: 'Kim Studio', service: 'Studio A', date: '2024-01-15', time: '10:00', status: 'confirmed' },
    { id: '2', customer: 'Fashion Brand', service: 'Studio B', date: '2024-01-16', time: '14:00', status: 'pending' },
    { id: '3', customer: 'Beauty Co.', service: 'Premium', date: '2024-01-17', time: '11:00', status: 'pending' },
  ];
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();
  const recentBookings = await getRecentBookings();

  const statCards = [
    { label: 'Total Models', value: stats.totalModels, icon: Users, href: '/admin/models' },
    { label: 'Pending Bookings', value: stats.pendingBookings, icon: Calendar, href: '/admin/bookings' },
    { label: 'Live Creators', value: stats.totalCreators, icon: Video, href: '/admin/creators' },
    { label: 'Monthly Views', value: stats.monthlyViews, icon: TrendingUp, href: '#' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl mb-2">Dashboard</h1>
        <p className="text-[var(--text-muted)]">Welcome back to Instant Agency Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="p-6 border border-[var(--text)]/10 rounded-lg hover:border-[var(--text)]/30 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[var(--text-muted)] text-xs tracking-wider uppercase mb-2">
                    {stat.label}
                  </p>
                  <p className="font-serif text-3xl">{stat.value}</p>
                </div>
                <Icon className="text-[var(--text-muted)]" size={24} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="border border-[var(--text)]/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl">Recent Bookings</h2>
            <Link
              href="/admin/bookings"
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between py-3 border-b border-[var(--text)]/5 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <Clock className="text-[var(--text-muted)]" size={16} />
                  <div>
                    <p className="text-sm">{booking.customer}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {booking.service} · {booking.date} {booking.time}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    booking.status === 'confirmed'
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-yellow-500/10 text-yellow-500'
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="border border-[var(--text)]/10 rounded-lg p-6">
          <h2 className="font-serif text-xl mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/admin/models"
              className="flex items-center gap-3 p-4 border border-[var(--text)]/10 rounded-lg hover:bg-[var(--text)]/5 transition-colors"
            >
              <Users size={20} />
              <span className="text-sm">Add Model</span>
            </Link>
            <Link
              href="/admin/pages"
              className="flex items-center gap-3 p-4 border border-[var(--text)]/10 rounded-lg hover:bg-[var(--text)]/5 transition-colors"
            >
              <FileText size={20} />
              <span className="text-sm">Edit Pages</span>
            </Link>
            <Link
              href="/admin/bookings"
              className="flex items-center gap-3 p-4 border border-[var(--text)]/10 rounded-lg hover:bg-[var(--text)]/5 transition-colors"
            >
              <Calendar size={20} />
              <span className="text-sm">Manage Bookings</span>
            </Link>
            <Link
              href="/admin/creators"
              className="flex items-center gap-3 p-4 border border-[var(--text)]/10 rounded-lg hover:bg-[var(--text)]/5 transition-colors"
            >
              <Video size={20} />
              <span className="text-sm">Add Creator</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
