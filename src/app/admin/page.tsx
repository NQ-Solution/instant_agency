import { Users, Calendar, FileText, Video, MessageSquare, Clock } from 'lucide-react';
import Link from 'next/link';
import prisma from '@/lib/db';

async function getDashboardStats() {
  try {
    const [totalModels, pendingBookings, totalCreators, totalInquiries] = await Promise.all([
      prisma.model.count(),
      prisma.booking.count({ where: { status: 'pending' } }),
      prisma.creator.count(),
      prisma.inquiry.count({ where: { status: 'pending' } }),
    ]);

    return {
      totalModels,
      pendingBookings,
      totalCreators,
      totalInquiries,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalModels: 0,
      pendingBookings: 0,
      totalCreators: 0,
      totalInquiries: 0,
    };
  }
}

async function getRecentBookings() {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    return bookings;
  } catch (error) {
    console.error('Error fetching recent bookings:', error);
    return [];
  }
}

async function getRecentInquiries() {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    return inquiries;
  } catch (error) {
    console.error('Error fetching recent inquiries:', error);
    return [];
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();
  const recentBookings = await getRecentBookings();
  const recentInquiries = await getRecentInquiries();

  const statCards = [
    { label: 'Total Models', value: stats.totalModels, icon: Users, href: '/admin/models' },
    { label: 'Pending Bookings', value: stats.pendingBookings, icon: Calendar, href: '/admin/bookings' },
    { label: 'Live Creators', value: stats.totalCreators, icon: Video, href: '/admin/creators' },
    { label: 'New Inquiries', value: stats.totalInquiries, icon: MessageSquare, href: '/admin/bookings' },
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
            {recentBookings.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)] text-center py-4">
                No bookings yet
              </p>
            ) : (
              recentBookings.map((booking) => {
                const customer = booking.customer as { name?: string; company?: string };
                return (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between py-3 border-b border-[var(--text)]/5 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <Clock className="text-[var(--text-muted)]" size={16} />
                      <div>
                        <p className="text-sm">{customer.name || customer.company || 'Unknown'}</p>
                        <p className="text-xs text-[var(--text-muted)]">
                          {booking.service} · {new Date(booking.date).toLocaleDateString()} {booking.time}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        booking.status === 'confirmed'
                          ? 'bg-green-500/10 text-green-500'
                          : booking.status === 'cancelled'
                          ? 'bg-red-500/10 text-red-500'
                          : 'bg-yellow-500/10 text-yellow-500'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="border border-[var(--text)]/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl">Recent Inquiries</h2>
            <Link
              href="/admin/bookings"
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {recentInquiries.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)] text-center py-4">
                No inquiries yet
              </p>
            ) : (
              recentInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="flex items-center justify-between py-3 border-b border-[var(--text)]/5 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <MessageSquare className="text-[var(--text-muted)]" size={16} />
                    <div>
                      <p className="text-sm">{inquiry.name}</p>
                      <p className="text-xs text-[var(--text-muted)] truncate max-w-[200px]">
                        {inquiry.subject}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      inquiry.status === 'replied'
                        ? 'bg-green-500/10 text-green-500'
                        : inquiry.status === 'read'
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'bg-yellow-500/10 text-yellow-500'
                    }`}
                  >
                    {inquiry.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="border border-[var(--text)]/10 rounded-lg p-6">
        <h2 className="font-serif text-xl mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/models/new"
            className="flex items-center gap-3 p-4 border border-[var(--text)]/10 rounded-lg hover:bg-[var(--text)]/5 transition-colors"
          >
            <Users size={20} />
            <span className="text-sm">Add Model</span>
          </Link>
          <Link
            href="/admin/creators/new"
            className="flex items-center gap-3 p-4 border border-[var(--text)]/10 rounded-lg hover:bg-[var(--text)]/5 transition-colors"
          >
            <Video size={20} />
            <span className="text-sm">Add Creator</span>
          </Link>
          <Link
            href="/admin/pages"
            className="flex items-center gap-3 p-4 border border-[var(--text)]/10 rounded-lg hover:bg-[var(--text)]/5 transition-colors"
          >
            <FileText size={20} />
            <span className="text-sm">Edit Pages</span>
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 p-4 border border-[var(--text)]/10 rounded-lg hover:bg-[var(--text)]/5 transition-colors"
          >
            <Calendar size={20} />
            <span className="text-sm">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
