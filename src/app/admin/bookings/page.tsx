'use client';

import { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, Check, X, Mail, Phone, User, Instagram, Eye, List, CalendarDays, ChevronLeft, ChevronRight, MessageCircle, GraduationCap, Trash2, ChevronDown, ChevronUp, Building, FileText, Edit } from 'lucide-react';
import type { Booking } from '@/types';
import { formatDateToKST, formatKSTDateKorean } from '@/lib/kst';

const months = [
  '1월', '2월', '3월', '4월', '5월', '6월',
  '7월', '8월', '9월', '10월', '11월', '12월'
];

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

// 날짜에서 요일 가져오기
const getWeekdayFromDate = (date: Date): string => {
  return weekdays[date.getDay()];
};

const serviceLabels: Record<string, string> = {
  profile: '프로필 지원 및 접수',
  model: '모델 캐스팅',
  general: '일반 미팅',
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
  const [calendarViewType, setCalendarViewType] = useState<'day' | 'week' | 'month'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState('');

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

  const deleteBooking = async (id: string) => {
    if (!confirm('이 예약을 삭제하시겠습니까?')) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setBookings(bookings.filter((b) => b.id !== id));
        if (expandedBookingId === id) {
          setExpandedBookingId(null);
        }
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const toggleExpand = (id: string) => {
    if (expandedBookingId === id) {
      setExpandedBookingId(null);
      setEditingNotesId(null);
    } else {
      setExpandedBookingId(id);
      const booking = bookings.find(b => b.id === id);
      setNotesInput(booking?.notes || '');
    }
  };

  const saveNotes = async (id: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: notesInput }),
      });
      if (res.ok) {
        setBookings(
          bookings.map((b) =>
            b.id === id ? { ...b, notes: notesInput } : b
          )
        );
        setEditingNotesId(null);
      }
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed': return '확정됨';
      case 'pending': return '대기중';
      case 'cancelled': return '취소됨';
      default: return status;
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  // 캘린더 날짜에 해당하는 예약만 필터링
  const bookingsForSelectedDate = useMemo(() => {
    if (selectedCalendarDate) {
      return filteredBookings.filter((b) => formatDateToKST(new Date(b.date)) === selectedCalendarDate);
    }
    // 일간 뷰일 때는 해당 날짜만 표시
    if (calendarViewType === 'day') {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
      return filteredBookings.filter((b) => formatDateToKST(new Date(b.date)) === dateStr);
    }
    return filteredBookings;
  }, [selectedCalendarDate, filteredBookings, calendarViewType, currentDate]);

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


  const handleDateClick = (dateStr: string) => {
    if (selectedCalendarDate === dateStr) {
      setSelectedCalendarDate(null);
    } else {
      setSelectedCalendarDate(dateStr);
    }
  };

  // 주간 뷰용 데이터
  const weekDays = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 현재 주의 시작일 (일요일 기준)
    const startOfWeek = new Date(currentDate);
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

    const days: Array<{
      date: Date;
      dateStr: string;
      dayOfWeek: string;
      isToday: boolean;
      bookingsCount: { pending: number; confirmed: number; cancelled: number; total: number };
    }> = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const isToday = date.getTime() === today.getTime();

      const dayBookings = bookings.filter((b) => formatDateToKST(new Date(b.date)) === dateStr);
      const bookingsCount = {
        pending: dayBookings.filter((b) => b.status === 'pending').length,
        confirmed: dayBookings.filter((b) => b.status === 'confirmed').length,
        cancelled: dayBookings.filter((b) => b.status === 'cancelled').length,
        total: dayBookings.length,
      };

      days.push({
        date,
        dateStr,
        dayOfWeek: weekdays[date.getDay()],
        isToday,
        bookingsCount,
      });
    }

    return days;
  }, [currentDate, bookings]);

  // 일간 뷰용 데이터
  const dayViewDate = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    const isToday = currentDate.getTime() === today.getTime();

    const dayBookings = bookings.filter((b) => formatDateToKST(new Date(b.date)) === dateStr);

    return {
      date: currentDate,
      dateStr,
      dayOfWeek: weekdays[currentDate.getDay()],
      isToday,
      bookings: dayBookings,
    };
  }, [currentDate, bookings]);

  const handlePrevPeriod = () => {
    if (calendarViewType === 'month') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (calendarViewType === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 7);
      setCurrentDate(newDate);
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 1);
      setCurrentDate(newDate);
    }
    setSelectedCalendarDate(null);
  };

  const handleNextPeriod = () => {
    if (calendarViewType === 'month') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (calendarViewType === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 7);
      setCurrentDate(newDate);
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 1);
      setCurrentDate(newDate);
    }
    setSelectedCalendarDate(null);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedCalendarDate(null);
  };

  const getCalendarTitle = () => {
    if (calendarViewType === 'month') {
      return `${year}년 ${months[month]}`;
    } else if (calendarViewType === 'week') {
      const startDate = weekDays[0]?.date;
      const endDate = weekDays[6]?.date;
      if (startDate && endDate) {
        return `${startDate.getMonth() + 1}월 ${startDate.getDate()}일 - ${endDate.getMonth() + 1}월 ${endDate.getDate()}일`;
      }
    } else {
      return `${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일 (${weekdays[currentDate.getDay()]})`;
    }
    return '';
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <h2 className="font-serif text-2xl">{getCalendarTitle()}</h2>
              <button
                onClick={handleToday}
                className="px-3 py-1 text-sm border border-[var(--text)]/20 rounded-lg hover:bg-[var(--text)]/5 transition-colors"
              >
                오늘
              </button>
            </div>
            <div className="flex items-center gap-4">
              {/* View Type Toggle */}
              <div className="flex border border-[var(--text)]/20 rounded-lg overflow-hidden text-sm">
                <button
                  onClick={() => setCalendarViewType('day')}
                  className={`px-3 py-1.5 transition-colors ${
                    calendarViewType === 'day'
                      ? 'bg-[var(--text)] text-[var(--bg)]'
                      : 'hover:bg-[var(--text)]/5'
                  }`}
                >
                  일
                </button>
                <button
                  onClick={() => setCalendarViewType('week')}
                  className={`px-3 py-1.5 transition-colors ${
                    calendarViewType === 'week'
                      ? 'bg-[var(--text)] text-[var(--bg)]'
                      : 'hover:bg-[var(--text)]/5'
                  }`}
                >
                  주
                </button>
                <button
                  onClick={() => setCalendarViewType('month')}
                  className={`px-3 py-1.5 transition-colors ${
                    calendarViewType === 'month'
                      ? 'bg-[var(--text)] text-[var(--bg)]'
                      : 'hover:bg-[var(--text)]/5'
                  }`}
                >
                  월
                </button>
              </div>
              {/* Navigation */}
              <div className="flex gap-2">
                <button
                  onClick={handlePrevPeriod}
                  className="w-10 h-10 border border-[var(--text)]/20 rounded-lg flex items-center justify-center hover:bg-[var(--text)]/5 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={handleNextPeriod}
                  className="w-10 h-10 border border-[var(--text)]/20 rounded-lg flex items-center justify-center hover:bg-[var(--text)]/5 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Month View */}
          {calendarViewType === 'month' && (
            <>
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
            </>
          )}

          {/* Week View */}
          {calendarViewType === 'week' && (
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((dayInfo, index) => {
                const isSelected = selectedCalendarDate === dayInfo.dateStr;
                const hasBookings = dayInfo.bookingsCount.total > 0;

                return (
                  <button
                    key={index}
                    onClick={() => handleDateClick(dayInfo.dateStr)}
                    className={`
                      min-h-[120px] p-3 border rounded-lg text-left transition-all flex flex-col
                      border-[var(--text)]/10 hover:border-[var(--text)]/30
                      ${dayInfo.isToday ? 'border-[var(--text)]' : ''}
                      ${isSelected ? 'bg-[var(--text)]/10 border-[var(--text)]' : ''}
                    `}
                  >
                    <div className="text-center mb-2">
                      <div className="text-xs text-[var(--text-muted)]">{dayInfo.dayOfWeek}</div>
                      <div className={`text-lg ${dayInfo.isToday ? 'font-bold' : ''}`}>
                        {dayInfo.date.getDate()}
                      </div>
                    </div>
                    {hasBookings && (
                      <div className="space-y-0.5">
                        {dayInfo.bookingsCount.pending > 0 && (
                          <div className="text-[10px] px-1.5 py-0.5 bg-yellow-500/20 text-yellow-600 rounded text-center">
                            대기 {dayInfo.bookingsCount.pending}
                          </div>
                        )}
                        {dayInfo.bookingsCount.confirmed > 0 && (
                          <div className="text-[10px] px-1.5 py-0.5 bg-green-500/20 text-green-600 rounded text-center">
                            확정 {dayInfo.bookingsCount.confirmed}
                          </div>
                        )}
                        {dayInfo.bookingsCount.cancelled > 0 && (
                          <div className="text-[10px] px-1.5 py-0.5 bg-red-500/20 text-red-600 rounded text-center">
                            취소 {dayInfo.bookingsCount.cancelled}
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Day View */}
          {calendarViewType === 'day' && (
            <div className="border border-[var(--text)]/10 rounded-lg p-4">
              <div className="text-center mb-4">
                <div className={`text-3xl font-serif ${dayViewDate.isToday ? 'font-bold' : ''}`}>
                  {currentDate.getDate()}
                </div>
                <div className="text-[var(--text-muted)]">{dayViewDate.dayOfWeek}요일</div>
              </div>
              <div className="text-sm text-[var(--text-muted)] text-center">
                총 {dayViewDate.bookings.length}건의 예약
              </div>
            </div>
          )}

          {/* Selected Date Info */}
          {selectedCalendarDate && calendarViewType !== 'day' && (
            <div className="mt-6 pt-6 border-t border-[var(--text)]/10">
              <h3 className="font-serif text-lg mb-4">
                {selectedCalendarDate} ({weekdays[new Date(selectedCalendarDate).getDay()]}요일) 예약 ({bookingsForSelectedDate.length}건)
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
          (viewMode === 'list' ? filteredBookings : bookingsForSelectedDate).map((booking) => {
            const isExpanded = expandedBookingId === booking.id;

            return (
              <div
                key={booking.id}
                className="border border-[var(--text)]/10 rounded-lg overflow-hidden"
              >
                {/* 기본 정보 */}
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                          {getStatusLabel(booking.status)}
                        </span>
                        <span className="text-sm text-[var(--text-muted)]">
                          {serviceLabels[booking.service] || booking.service}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="text-[var(--text-muted)]" size={16} />
                          <span>
                            {formatDateToKST(new Date(booking.date))} ({getWeekdayFromDate(new Date(booking.date))})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="text-[var(--text-muted)]" size={16} />
                          <span>{booking.time} {booking.endTime && `- ${booking.endTime}`}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="text-[var(--text-muted)]" size={16} />
                          <span>{booking.customer.name}</span>
                        </div>
                        <a
                          href={`tel:${booking.customer.phone}`}
                          className="flex items-center gap-2 hover:text-blue-500 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Phone className="text-[var(--text-muted)]" size={16} />
                          <span>{booking.customer.phone}</span>
                        </a>
                        {booking.customer.instagram && (
                          <a
                            href={`https://instagram.com/${booking.customer.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:text-pink-500 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Instagram className="text-[var(--text-muted)]" size={16} />
                            <span>{booking.customer.instagram}</span>
                          </a>
                        )}
                        {booking.customer.tiktok && (
                          <a
                            href={`https://tiktok.com/@${booking.customer.tiktok.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:text-[var(--text)] transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg className="text-[var(--text-muted)]" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                            </svg>
                            <span>{booking.customer.tiktok}</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => toggleExpand(booking.id!)}
                        className={`flex items-center gap-2 px-4 py-2 border border-[var(--text)]/20 rounded-lg hover:bg-[var(--text)]/5 transition-colors ${isExpanded ? 'bg-[var(--text)]/5' : ''}`}
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        {isExpanded ? '접기' : '자세히'}
                      </button>
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateStatus(booking.id!, 'confirmed')}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors"
                          >
                            <Check size={16} />
                            확정
                          </button>
                          <button
                            onClick={() => updateStatus(booking.id!, 'cancelled')}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                          >
                            <X size={16} />
                            취소
                          </button>
                        </>
                      )}
                      {booking.status === 'cancelled' && (
                        <button
                          onClick={() => deleteBooking(booking.id!)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 size={16} />
                          삭제
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 드롭다운 상세 정보 */}
                {isExpanded && (
                  <div className="border-t border-[var(--text)]/10 bg-[var(--text)]/[0.02] p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* 고객 정보 */}
                      <div>
                        <h3 className="font-medium mb-4 flex items-center gap-2">
                          <User size={18} />
                          고객 정보
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 p-3 bg-[var(--text)]/5 rounded-lg">
                            <User className="text-[var(--text-muted)]" size={18} />
                            <div>
                              <p className="text-xs text-[var(--text-muted)]">이름</p>
                              <p className="font-medium">{booking.customer.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-[var(--text)]/5 rounded-lg">
                            <Mail className="text-[var(--text-muted)]" size={18} />
                            <div>
                              <p className="text-xs text-[var(--text-muted)]">이메일</p>
                              <a href={`mailto:${booking.customer.email}`} className="font-medium hover:text-blue-500">
                                {booking.customer.email}
                              </a>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-[var(--text)]/5 rounded-lg">
                            <Phone className="text-[var(--text-muted)]" size={18} />
                            <div>
                              <p className="text-xs text-[var(--text-muted)]">연락처</p>
                              <a href={`tel:${booking.customer.phone}`} className="font-medium hover:text-blue-500">
                                {booking.customer.phone}
                              </a>
                            </div>
                          </div>
                          {booking.customer.company && (
                            <div className="flex items-center gap-3 p-3 bg-[var(--text)]/5 rounded-lg">
                              <Building className="text-[var(--text-muted)]" size={18} />
                              <div>
                                <p className="text-xs text-[var(--text-muted)]">회사</p>
                                <p className="font-medium">{booking.customer.company}</p>
                              </div>
                            </div>
                          )}
                          {booking.customer.instagram && (
                            <div className="flex items-center gap-3 p-3 bg-[var(--text)]/5 rounded-lg">
                              <Instagram className="text-[var(--text-muted)]" size={18} />
                              <div>
                                <p className="text-xs text-[var(--text-muted)]">인스타그램</p>
                                <a
                                  href={`https://instagram.com/${booking.customer.instagram.replace('@', '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-medium hover:text-blue-500"
                                >
                                  {booking.customer.instagram}
                                </a>
                              </div>
                            </div>
                          )}
                          {booking.customer.tiktok && (
                            <div className="flex items-center gap-3 p-3 bg-[var(--text)]/5 rounded-lg">
                              <svg className="text-[var(--text-muted)]" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                              </svg>
                              <div>
                                <p className="text-xs text-[var(--text-muted)]">틱톡</p>
                                <a
                                  href={`https://tiktok.com/@${booking.customer.tiktok.replace('@', '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-medium hover:text-blue-500"
                                >
                                  {booking.customer.tiktok}
                                </a>
                              </div>
                            </div>
                          )}
                          {booking.kakaoId && (
                            <div className="flex items-center gap-3 p-3 bg-[var(--text)]/5 rounded-lg">
                              <MessageCircle className="text-[var(--text-muted)]" size={18} />
                              <div>
                                <p className="text-xs text-[var(--text-muted)]">카카오톡 ID</p>
                                <p className="font-medium">{booking.kakaoId}</p>
                              </div>
                            </div>
                          )}
                          {booking.isUniversityStudent !== undefined && (
                            <div className="flex items-center gap-3 p-3 bg-[var(--text)]/5 rounded-lg">
                              <GraduationCap className="text-[var(--text-muted)]" size={18} />
                              <div>
                                <p className="text-xs text-[var(--text-muted)]">대학생 여부</p>
                                <p className={`font-medium ${booking.isUniversityStudent ? 'text-blue-500' : ''}`}>
                                  {booking.isUniversityStudent ? '대학생' : '해당 없음'}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 예약 정보 및 메모 */}
                      <div className="space-y-6">
                        {/* 예약 상세 */}
                        <div>
                          <h3 className="font-medium mb-4 flex items-center gap-2">
                            <Calendar size={18} />
                            예약 정보
                          </h3>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-[var(--text)]/5 rounded-lg">
                              <Calendar className="text-[var(--text-muted)]" size={18} />
                              <div>
                                <p className="text-xs text-[var(--text-muted)]">날짜</p>
                                <p className="font-medium">
                                  {formatKSTDateKorean(new Date(booking.date))} ({getWeekdayFromDate(new Date(booking.date))}요일)
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-[var(--text)]/5 rounded-lg">
                              <Clock className="text-[var(--text-muted)]" size={18} />
                              <div>
                                <p className="text-xs text-[var(--text-muted)]">시간</p>
                                <p className="font-medium">
                                  {booking.time} {booking.endTime && `- ${booking.endTime}`}
                                </p>
                              </div>
                            </div>
                            {booking.createdAt && (
                              <div className="text-xs text-[var(--text-muted)] mt-2">
                                예약 생성: {new Date(booking.createdAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 메모 */}
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium flex items-center gap-2">
                              <FileText size={18} />
                              메모
                            </h3>
                            {editingNotesId !== booking.id && (
                              <button
                                onClick={() => {
                                  setEditingNotesId(booking.id!);
                                  setNotesInput(booking.notes || '');
                                }}
                                className="flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-[var(--text)]"
                              >
                                <Edit size={14} />
                                수정
                              </button>
                            )}
                          </div>
                          {editingNotesId === booking.id ? (
                            <div className="space-y-3">
                              <textarea
                                value={notesInput}
                                onChange={(e) => setNotesInput(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
                                placeholder="메모를 입력하세요..."
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => saveNotes(booking.id!)}
                                  className="px-4 py-2 bg-theme-inverse text-theme-inverse rounded-lg hover:opacity-90"
                                >
                                  저장
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingNotesId(null);
                                    setNotesInput(booking.notes || '');
                                  }}
                                  className="px-4 py-2 border border-[var(--text)]/20 rounded-lg hover:bg-[var(--text)]/5"
                                >
                                  취소
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-[var(--text-muted)] p-3 bg-[var(--text)]/5 rounded-lg whitespace-pre-wrap">
                              {booking.notes || '메모가 없습니다.'}
                            </p>
                          )}
                        </div>

                        {/* 상태 변경 (확정된 예약의 경우) */}
                        {booking.status === 'confirmed' && (
                          <div>
                            <h3 className="font-medium mb-4">상태 변경</h3>
                            <button
                              onClick={() => updateStatus(booking.id!, 'cancelled')}
                              className="w-full flex items-center justify-center gap-2 py-3 border border-red-500/30 text-red-500 rounded-lg hover:bg-red-500/10"
                            >
                              <X size={18} />
                              예약 취소
                            </button>
                          </div>
                        )}

                        {/* 취소된 예약 복원 */}
                        {booking.status === 'cancelled' && (
                          <div>
                            <h3 className="font-medium mb-4">상태 변경</h3>
                            <button
                              onClick={() => updateStatus(booking.id!, 'pending')}
                              className="w-full flex items-center justify-center gap-2 py-3 border border-[var(--text)]/20 rounded-lg hover:bg-[var(--text)]/5"
                            >
                              예약 복원
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
