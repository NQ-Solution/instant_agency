'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Check, X, Mail, Phone, User, Instagram, Eye, List, CalendarDays, ChevronLeft, ChevronRight, MessageCircle, GraduationCap } from 'lucide-react';
import type { Booking } from '@/types';
import { formatDateToKST } from '@/lib/kst';

const months = [
  '1월', '2월', '3월', '4월', '5월', '6월',
  '7월', '8월', '9월', '10월', '11월', '12월'
];

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);

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

  // 캘린더 날짜에 해당하는 예약만 필터링
  const bookingsForSelectedDate = selectedCalendarDate
    ? filteredBookings.filter((b) => formatDateToKST(new Date(b.date)) === selectedCalendarDate)
    : filteredBookings;

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

  // 캘린더 관련 로직
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days: Array<{
      day: number | null;
      dateStr: string;
      isToday: boolean;
      bookingsCount: { pending: number; confirmed: number; cancelled: number; total: number };
    }> = [];

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, dateStr: '', isToday: false, bookingsCount: { pending: 0, confirmed: 0, cancelled: 0, total: 0 } });
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = date.getTime() === today.getTime();

      // 해당 날짜의 예약 수 계산
      const dayBookings = bookings.filter((b) => formatDateToKST(new Date(b.date)) === dateStr);
      const bookingsCount = {
        pending: dayBookings.filter((b) => b.status === 'pending').length,
        confirmed: dayBookings.filter((b) => b.status === 'confirmed').length,
        cancelled: dayBookings.filter((b) => b.status === 'cancelled').length,
        total: dayBookings.length,
      };

      days.push({ day, dateStr, isToday, bookingsCount });
    }

    return days;
  }, [year, month, bookings]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedCalendarDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedCalendarDate(null);
  };

  const handleDateClick = (dateStr: string) => {
    if (selectedCalendarDate === dateStr) {
      setSelectedCalendarDate(null);
    } else {
      setSelectedCalendarDate(dateStr);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl mb-2">Meeting Bookings</h1>
          <p className="text-[var(--text-muted)]">
            Manage meeting reservations ({bookings.length} total)
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex border border-[var(--text)]/20 rounded-lg overflow-hidden">
          <button
            onClick={() => { setViewMode('list'); setSelectedCalendarDate(null); }}
            className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
              viewMode === 'list'
                ? 'bg-[var(--text)] text-[var(--bg)]'
                : 'hover:bg-[var(--text)]/5'
            }`}
          >
            <List size={16} />
            목록
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
              viewMode === 'calendar'
                ? 'bg-[var(--text)] text-[var(--bg)]'
                : 'hover:bg-[var(--text)]/5'
            }`}
          >
            <CalendarDays size={16} />
            캘린더
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div className="border border-[var(--text)]/10 rounded-lg p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl">{year}년 {months[month]}</h2>
            <div className="flex gap-2">
              <button
                onClick={handlePrevMonth}
                className="w-10 h-10 border border-[var(--text)]/20 rounded-lg flex items-center justify-center hover:bg-[var(--text)]/5 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleNextMonth}
                className="w-10 h-10 border border-[var(--text)]/20 rounded-lg flex items-center justify-center hover:bg-[var(--text)]/5 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Weekdays Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekdays.map((day) => (
              <div key={day} className="text-center text-xs tracking-wider text-[var(--text-muted)] py-2 font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((dayInfo, index) => {
              const isSelected = selectedCalendarDate === dayInfo.dateStr;
              const hasBookings = dayInfo.bookingsCount.total > 0;

              return (
                <button
                  key={index}
                  disabled={!dayInfo.day}
                  onClick={() => dayInfo.day && handleDateClick(dayInfo.dateStr)}
                  className={`
                    min-h-[80px] p-2 border rounded-lg text-left transition-all flex flex-col
                    ${!dayInfo.day ? 'bg-transparent border-transparent cursor-default' : ''}
                    ${dayInfo.day ? 'border-[var(--text)]/10 hover:border-[var(--text)]/30' : ''}
                    ${dayInfo.isToday ? 'border-[var(--text)]' : ''}
                    ${isSelected ? 'bg-[var(--text)]/10 border-[var(--text)]' : ''}
                  `}
                >
                  {dayInfo.day && (
                    <>
                      <span className={`text-sm ${dayInfo.isToday ? 'font-bold' : ''}`}>
                        {dayInfo.day}
                      </span>
                      {hasBookings && (
                        <div className="mt-1 space-y-0.5">
                          {dayInfo.bookingsCount.pending > 0 && (
                            <div className="text-[10px] px-1.5 py-0.5 bg-yellow-500/20 text-yellow-600 rounded">
                              대기 {dayInfo.bookingsCount.pending}
                            </div>
                          )}
                          {dayInfo.bookingsCount.confirmed > 0 && (
                            <div className="text-[10px] px-1.5 py-0.5 bg-green-500/20 text-green-600 rounded">
                              확정 {dayInfo.bookingsCount.confirmed}
                            </div>
                          )}
                          {dayInfo.bookingsCount.cancelled > 0 && (
                            <div className="text-[10px] px-1.5 py-0.5 bg-red-500/20 text-red-600 rounded">
                              취소 {dayInfo.bookingsCount.cancelled}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Date Info */}
          {selectedCalendarDate && (
            <div className="mt-6 pt-6 border-t border-[var(--text)]/10">
              <h3 className="font-serif text-lg mb-4">
                {selectedCalendarDate} 예약 ({bookingsForSelectedDate.length}건)
              </h3>
            </div>
          )}
        </div>
      )}

      {/* Bookings List */}
      <div className="space-y-4">
        {(viewMode === 'list' ? filteredBookings : bookingsForSelectedDate).length === 0 ? (
          <div className="text-center py-12 text-[var(--text-muted)]">
            {viewMode === 'calendar' && selectedCalendarDate
              ? '선택한 날짜에 예약이 없습니다'
              : 'No bookings found'}
          </div>
        ) : (
          (viewMode === 'list' ? filteredBookings : bookingsForSelectedDate).map((booking) => (
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
                    {booking.kakaoId && (
                      <div className="flex items-center gap-2">
                        <MessageCircle className="text-[var(--text-muted)]" size={16} />
                        <span>{booking.kakaoId}</span>
                      </div>
                    )}
                    {booking.isUniversityStudent && (
                      <div className="flex items-center gap-2">
                        <GraduationCap className="text-[var(--text-muted)]" size={16} />
                        <span className="text-blue-500">대학생</span>
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
