'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Check, X, Mail, Phone, User, Instagram, Eye } from 'lucide-react';
import type { Booking } from '@/types';
import { formatDateToKST } from '@/lib/kst';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setBookings(
          bookings.map((b) =>
            b.id === id ? { ...b, status: status as 'pending' | 'confirmed' | 'cancelled' } : b
          )
        );
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/10 text-green-500';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--text)]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl mb-2">Meeting Bookings</h1>
        <p className="text-[var(--text-muted)]">
          Manage meeting reservations ({bookings.length} total)
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: bookings.length, filter: 'all' },
          { label: 'Pending', value: bookings.filter((b) => b.status === 'pending').length, filter: 'pending' },
          { label: 'Confirmed', value: bookings.filter((b) => b.status === 'confirmed').length, filter: 'confirmed' },
          { label: 'Cancelled', value: bookings.filter((b) => b.status === 'cancelled').length, filter: 'cancelled' },
        ].map((stat) => (
          <button
            key={stat.label}
            onClick={() => setFilter(stat.filter)}
            className={`p-4 border rounded-lg text-left transition-colors ${
              filter === stat.filter
                ? 'border-[var(--text)] bg-[var(--text)]/5'
                : 'border-[var(--text)]/10 hover:border-[var(--text)]/30'
            }`}
          >
            <p className="text-xs tracking-wider uppercase text-[var(--text-muted)] mb-1">
              {stat.label}
            </p>
            <p className="font-serif text-2xl">{stat.value}</p>
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 text-[var(--text-muted)]">
            No bookings found
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="border border-[var(--text)]/10 rounded-lg p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                    <span className="text-sm text-[var(--text-muted)]">
                      {booking.service}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="text-[var(--text-muted)]" size={16} />
                      <span>
                        {formatDateToKST(new Date(booking.date))}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="text-[var(--text-muted)]" size={16} />
                      <span>{booking.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="text-[var(--text-muted)]" size={16} />
                      <span>{booking.customer.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="text-[var(--text-muted)]" size={16} />
                      <span>{booking.customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="text-[var(--text-muted)]" size={16} />
                      <span>{booking.customer.phone}</span>
                    </div>
                    {booking.customer.instagram && (
                      <div className="flex items-center gap-2">
                        <Instagram className="text-[var(--text-muted)]" size={16} />
                        <span>{booking.customer.instagram}</span>
                      </div>
                    )}
                    {booking.customer.tiktok && (
                      <div className="flex items-center gap-2">
                        <svg className="text-[var(--text-muted)]" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                        <span>{booking.customer.tiktok}</span>
                      </div>
                    )}
                  </div>
                  {booking.notes && (
                    <p className="text-sm text-[var(--text-muted)] mt-3">
                      Notes: {booking.notes}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/admin/bookings/${booking.id}`}
                    className="flex items-center gap-2 px-4 py-2 border border-[var(--text)]/20 rounded-lg hover:bg-[var(--text)]/5 transition-colors"
                  >
                    <Eye size={16} />
                    자세히
                  </Link>
                  {booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(booking.id!, 'confirmed')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors"
                      >
                        <Check size={16} />
                        Confirm
                      </button>
                      <button
                        onClick={() => updateStatus(booking.id!, 'cancelled')}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                      >
                        <X size={16} />
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
