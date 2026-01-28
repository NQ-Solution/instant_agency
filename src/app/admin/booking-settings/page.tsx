'use client';

import { useState, useEffect, useMemo } from 'react';
import { Save, Plus, ChevronLeft, ChevronRight, Calendar, Clock, X, AlertTriangle, Edit2, Trash2 } from 'lucide-react';
import type { BookingSettings, Booking } from '@/types';
import { getKSTNow, formatDateToKST } from '@/lib/kst';

const months = [
  '1월', '2월', '3월', '4월', '5월', '6월',
  '7월', '8월', '9월', '10월', '11월', '12월'
];

const weekdayNames = ['일', '월', '화', '수', '목', '금', '토'];

const morningTimes = ['07:00', '08:00', '09:00', '10:00', '11:00'];
const afternoonTimes = ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const eveningTimes = ['18:00', '19:00', '20:00', '21:00'];
const allTimes = [...morningTimes, ...afternoonTimes, ...eveningTimes];

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function BookingSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // KST 기준 현재 날짜로 초기화
  const [currentDate, setCurrentDate] = useState(() => getKSTNow());
  const [settings, setSettings] = useState<BookingSettings>({
    availableTimes: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
    blockedDates: [],
    blockedWeekdays: [],
    minAdvanceHours: 24,
    maxAdvanceDays: 60,
    slotDuration: 60,
  });
  const [newTime, setNewTime] = useState('');
  const [editingTime, setEditingTime] = useState<string | null>(null);
  const [editTimeValue, setEditTimeValue] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetchSettings();
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
    }
  };

  // 특정 날짜에 예약이 있는지 확인
  const getBookingsForDate = (dateStr: string) => {
    return bookings.filter((b) => {
      const bookingDate = formatDateToKST(new Date(b.date));
      return bookingDate === dateStr && b.status !== 'cancelled';
    });
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/booking-settings');
      const data = await res.json();
      if (data.success && data.data) {
        setSettings({
          ...data.data,
          blockedDates: data.data.blockedDates || [],
          blockedWeekdays: data.data.blockedWeekdays || [],
          availableTimes: data.data.availableTimes || [],
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/booking-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        alert('설정이 저장되었습니다!');
      } else {
        alert('설정 저장에 실패했습니다');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('설정 저장에 실패했습니다');
    } finally {
      setSaving(false);
    }
  };

  // Calendar logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // KST 기준 오늘 날짜
    const kstNow = getKSTNow();
    const today = new Date(kstNow.getFullYear(), kstNow.getMonth(), kstNow.getDate());

    const days: Array<{
      day: number | null;
      date: Date | null;
      dateStr: string;
      isPast: boolean;
      isBlocked: boolean;
      isWeekdayBlocked: boolean;
      bookingsCount: number;
    }> = [];

    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, date: null, dateStr: '', isPast: false, isBlocked: false, isWeekdayBlocked: false, bookingsCount: 0 });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = formatDate(date);
      const dayOfWeek = date.getDay();
      const isPast = date < today;
      const isBlocked = settings.blockedDates.includes(dateStr);
      const isWeekdayBlocked = settings.blockedWeekdays.includes(dayOfWeek);
      const bookingsCount = getBookingsForDate(dateStr).length;

      days.push({
        day,
        date,
        dateStr,
        isPast,
        isBlocked,
        isWeekdayBlocked,
        bookingsCount,
      });
    }

    return days;
  }, [year, month, settings.blockedDates, settings.blockedWeekdays, bookings]);

  const toggleBlockedDate = (dateStr: string) => {
    if (!dateStr) return;

    const isBlocked = settings.blockedDates.includes(dateStr);
    if (isBlocked) {
      // 차단 해제
      setSettings({
        ...settings,
        blockedDates: settings.blockedDates.filter(d => d !== dateStr),
      });
    } else {
      // 차단하려는 경우, 해당 날짜에 예약이 있는지 확인
      const dateBookings = getBookingsForDate(dateStr);
      if (dateBookings.length > 0) {
        const bookingNames = dateBookings.map(b => `${b.customer.name} (${b.time})`).join(', ');
        alert(`해당 날짜에 ${dateBookings.length}건의 예약이 있어 차단할 수 없습니다.\n\n예약 목록: ${bookingNames}\n\n예약을 취소한 후 다시 시도해주세요.`);
        return;
      }
      setSettings({
        ...settings,
        blockedDates: [...settings.blockedDates, dateStr].sort(),
      });
    }
  };

  const toggleBlockedWeekday = (dayIndex: number) => {
    const isBlocked = settings.blockedWeekdays.includes(dayIndex);
    if (isBlocked) {
      setSettings({
        ...settings,
        blockedWeekdays: settings.blockedWeekdays.filter(d => d !== dayIndex),
      });
    } else {
      setSettings({
        ...settings,
        blockedWeekdays: [...settings.blockedWeekdays, dayIndex].sort(),
      });
    }
  };

  const addTime = () => {
    if (newTime && !settings.availableTimes.includes(newTime)) {
      setSettings({
        ...settings,
        availableTimes: [...settings.availableTimes, newTime].sort(),
      });
      setNewTime('');
    }
  };

  const removeTime = (time: string) => {
    setSettings({
      ...settings,
      availableTimes: settings.availableTimes.filter(t => t !== time),
    });
  };

  const startEditTime = (time: string) => {
    setEditingTime(time);
    setEditTimeValue(time);
  };

  const saveEditTime = () => {
    if (editingTime && editTimeValue && editTimeValue !== editingTime) {
      if (settings.availableTimes.includes(editTimeValue)) {
        alert('이미 존재하는 시간입니다.');
        return;
      }
      setSettings({
        ...settings,
        availableTimes: settings.availableTimes
          .map(t => t === editingTime ? editTimeValue : t)
          .sort(),
      });
    }
    setEditingTime(null);
    setEditTimeValue('');
  };

  const cancelEditTime = () => {
    setEditingTime(null);
    setEditTimeValue('');
  };

  // 기본 시간인지 확인 (기본 시간이 아닌 것은 커스텀)
  const isCustomTime = (time: string) => !allTimes.includes(time);

  const toggleDefaultTime = (time: string) => {
    if (settings.availableTimes.includes(time)) {
      removeTime(time);
    } else {
      setSettings({
        ...settings,
        availableTimes: [...settings.availableTimes, time].sort(),
      });
    }
  };

  const selectAllTimes = () => {
    setSettings({
      ...settings,
      availableTimes: [...allTimes],
    });
  };

  const clearAllTimes = () => {
    setSettings({
      ...settings,
      availableTimes: [],
    });
  };

  const selectTimeGroup = (times: string[]) => {
    const newTimes = new Set([...settings.availableTimes, ...times]);
    setSettings({
      ...settings,
      availableTimes: Array.from(newTimes).sort(),
    });
  };

  const clearTimeGroup = (times: string[]) => {
    setSettings({
      ...settings,
      availableTimes: settings.availableTimes.filter(t => !times.includes(t)),
    });
  };

  const isGroupSelected = (times: string[]) => {
    return times.every(t => settings.availableTimes.includes(t));
  };

  const isGroupPartial = (times: string[]) => {
    return times.some(t => settings.availableTimes.includes(t)) && !isGroupSelected(times);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--text)]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl mb-2">예약 설정</h1>
        <p className="text-[var(--text-muted)]">예약 가능 시간 및 차단 날짜를 관리합니다</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Times */}
          <section className="border border-[var(--text)]/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock size={20} />
                <h2 className="font-serif text-xl">예약 가능 시간 (KST)</h2>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={selectAllTimes}
                  className="px-3 py-1 text-xs border border-green-500 text-green-600 rounded hover:bg-green-500/10"
                >
                  전체 선택
                </button>
                <button
                  type="button"
                  onClick={clearAllTimes}
                  className="px-3 py-1 text-xs border border-red-500 text-red-600 rounded hover:bg-red-500/10"
                >
                  전체 해제
                </button>
              </div>
            </div>
            <p className="text-sm text-[var(--text-muted)] mb-6">
              클릭하여 예약 가능한 시간대를 선택하세요 (한국 시간 기준)
            </p>

            {/* Morning times */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs tracking-wider uppercase text-[var(--text-muted)]">오전</p>
                <button
                  type="button"
                  onClick={() => isGroupSelected(morningTimes) ? clearTimeGroup(morningTimes) : selectTimeGroup(morningTimes)}
                  className={`px-2 py-0.5 text-[10px] rounded ${
                    isGroupSelected(morningTimes)
                      ? 'bg-green-500/20 text-green-600'
                      : isGroupPartial(morningTimes)
                      ? 'bg-yellow-500/20 text-yellow-600'
                      : 'bg-[var(--text)]/10 text-[var(--text-muted)]'
                  }`}
                >
                  {isGroupSelected(morningTimes) ? '선택됨' : '전체선택'}
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {morningTimes.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => toggleDefaultTime(time)}
                    className={`py-3 text-sm border rounded transition-colors ${
                      settings.availableTimes.includes(time)
                        ? 'bg-green-500/20 border-green-500 text-green-600'
                        : 'border-[var(--text)]/20 hover:border-[var(--text)]/50'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Afternoon times */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs tracking-wider uppercase text-[var(--text-muted)]">오후</p>
                <button
                  type="button"
                  onClick={() => isGroupSelected(afternoonTimes) ? clearTimeGroup(afternoonTimes) : selectTimeGroup(afternoonTimes)}
                  className={`px-2 py-0.5 text-[10px] rounded ${
                    isGroupSelected(afternoonTimes)
                      ? 'bg-green-500/20 text-green-600'
                      : isGroupPartial(afternoonTimes)
                      ? 'bg-yellow-500/20 text-yellow-600'
                      : 'bg-[var(--text)]/10 text-[var(--text-muted)]'
                  }`}
                >
                  {isGroupSelected(afternoonTimes) ? '선택됨' : '전체선택'}
                </button>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {afternoonTimes.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => toggleDefaultTime(time)}
                    className={`py-3 text-sm border rounded transition-colors ${
                      settings.availableTimes.includes(time)
                        ? 'bg-green-500/20 border-green-500 text-green-600'
                        : 'border-[var(--text)]/20 hover:border-[var(--text)]/50'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Evening times */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs tracking-wider uppercase text-[var(--text-muted)]">저녁</p>
                <button
                  type="button"
                  onClick={() => isGroupSelected(eveningTimes) ? clearTimeGroup(eveningTimes) : selectTimeGroup(eveningTimes)}
                  className={`px-2 py-0.5 text-[10px] rounded ${
                    isGroupSelected(eveningTimes)
                      ? 'bg-green-500/20 text-green-600'
                      : isGroupPartial(eveningTimes)
                      ? 'bg-yellow-500/20 text-yellow-600'
                      : 'bg-[var(--text)]/10 text-[var(--text-muted)]'
                  }`}
                >
                  {isGroupSelected(eveningTimes) ? '선택됨' : '전체선택'}
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {eveningTimes.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => toggleDefaultTime(time)}
                    className={`py-3 text-sm border rounded transition-colors ${
                      settings.availableTimes.includes(time)
                        ? 'bg-green-500/20 border-green-500 text-green-600'
                        : 'border-[var(--text)]/20 hover:border-[var(--text)]/50'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom time input */}
            <div className="pt-4 border-t border-[var(--text)]/10">
              <p className="text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">커스텀 시간 추가</p>
              <div className="flex gap-2">
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="flex-1 px-4 py-2 bg-transparent border border-[var(--text)]/20 rounded focus:outline-none focus:border-[var(--text)]"
                />
                <button
                  type="button"
                  onClick={addTime}
                  disabled={!newTime}
                  className="px-4 py-2 bg-theme-inverse text-theme-inverse rounded hover:opacity-90 disabled:opacity-50"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Selected Times Management */}
            <div className="mt-4 pt-4 border-t border-[var(--text)]/10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs tracking-wider uppercase text-[var(--text-muted)]">
                  선택된 시간 ({settings.availableTimes.length}개)
                </p>
              </div>
              {settings.availableTimes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {settings.availableTimes.map((time) => (
                    <div
                      key={time}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm ${
                        isCustomTime(time)
                          ? 'bg-purple-500/20 text-purple-600 border border-purple-500/30'
                          : 'bg-green-500/10 text-green-600 border border-green-500/30'
                      }`}
                    >
                      {editingTime === time ? (
                        <>
                          <input
                            type="time"
                            value={editTimeValue}
                            onChange={(e) => setEditTimeValue(e.target.value)}
                            className="w-24 px-1 py-0.5 bg-transparent border border-current rounded text-xs"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={saveEditTime}
                            className="p-0.5 hover:opacity-70"
                            title="저장"
                          >
                            <Save size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditTime}
                            className="p-0.5 hover:opacity-70"
                            title="취소"
                          >
                            <X size={12} />
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="font-medium">{time}</span>
                          {isCustomTime(time) && (
                            <span className="text-[10px] opacity-70">(커스텀)</span>
                          )}
                          <button
                            type="button"
                            onClick={() => startEditTime(time)}
                            className="p-0.5 hover:opacity-70 ml-1"
                            title="수정"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeTime(time)}
                            className="p-0.5 hover:text-red-500"
                            title="삭제"
                          >
                            <Trash2 size={12} />
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--text-muted)]">선택된 시간이 없습니다</p>
              )}
              <p className="text-[10px] text-[var(--text-muted)] mt-2">
                💡 <span className="text-green-600">초록색</span>: 기본 시간 / <span className="text-purple-600">보라색</span>: 커스텀 시간
              </p>
            </div>
          </section>

          {/* Blocked Weekdays */}
          <section className="border border-[var(--text)]/10 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={20} />
              <h2 className="font-serif text-xl">휴무 요일</h2>
            </div>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              매주 반복되는 휴무일을 설정합니다
            </p>

            <div className="grid grid-cols-7 gap-2">
              {weekdayNames.map((name, index) => {
                const isBlocked = settings.blockedWeekdays.includes(index);
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => toggleBlockedWeekday(index)}
                    className={`py-3 text-center text-sm border rounded transition-colors ${
                      isBlocked
                        ? 'bg-red-500/20 border-red-500 text-red-600'
                        : 'border-[var(--text)]/20 hover:border-[var(--text)]/50'
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>

            {/* Other settings */}
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                  미팅 시간
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 30, label: '30분' },
                    { value: 60, label: '1시간' },
                    { value: 90, label: '1시간 30분' },
                    { value: 120, label: '2시간' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSettings({ ...settings, slotDuration: option.value })}
                      className={`py-3 text-sm border rounded transition-colors ${
                        settings.slotDuration === option.value
                          ? 'bg-green-500/20 border-green-500 text-green-600'
                          : 'border-[var(--text)]/20 hover:border-[var(--text)]/50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                  최소 예약 가능 시간 (시간 전)
                </label>
                <input
                  type="number"
                  min="0"
                  value={settings.minAdvanceHours}
                  onChange={(e) => setSettings({ ...settings, minAdvanceHours: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-transparent border border-[var(--text)]/20 rounded focus:outline-none focus:border-[var(--text)]"
                />
              </div>
              <div>
                <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                  최대 예약 가능 기간 (일)
                </label>
                <input
                  type="number"
                  min="1"
                  value={settings.maxAdvanceDays}
                  onChange={(e) => setSettings({ ...settings, maxAdvanceDays: parseInt(e.target.value) || 30 })}
                  className="w-full px-4 py-2 bg-transparent border border-[var(--text)]/20 rounded focus:outline-none focus:border-[var(--text)]"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Calendar for blocking specific dates */}
        <section className="border border-[var(--text)]/10 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={20} />
            <h2 className="font-serif text-xl">특정 날짜 차단</h2>
          </div>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            휴무일이나 예약을 받지 않을 날짜를 클릭하여 차단합니다. 빨간색은 차단된 날짜입니다.
          </p>

          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg">{year}년 {months[month]}</h3>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                className="w-10 h-10 border border-[var(--text)]/20 rounded flex items-center justify-center hover:bg-[var(--text)]/5"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                className="w-10 h-10 border border-[var(--text)]/20 rounded flex items-center justify-center hover:bg-[var(--text)]/5"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {weekdayNames.map((day, index) => (
              <div
                key={day}
                className={`text-center text-xs tracking-wider py-2 ${
                  settings.blockedWeekdays.includes(index) ? 'text-red-500' : 'text-[var(--text-muted)]'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((dayInfo, index) => {
              const isBlocked = dayInfo.isBlocked || dayInfo.isWeekdayBlocked;
              const hasBookings = dayInfo.bookingsCount > 0;

              return (
                <button
                  key={index}
                  type="button"
                  disabled={!dayInfo.day || dayInfo.isPast}
                  onClick={() => toggleBlockedDate(dayInfo.dateStr)}
                  className={`
                    aspect-square flex flex-col items-center justify-center text-sm rounded transition-all relative
                    ${!dayInfo.day ? 'cursor-default' : ''}
                    ${dayInfo.isPast ? 'opacity-30 cursor-not-allowed' : ''}
                    ${dayInfo.day && !dayInfo.isPast ? 'border hover:opacity-80' : ''}
                    ${isBlocked && !dayInfo.isPast
                      ? 'bg-red-500/20 border-red-500 text-red-600'
                      : hasBookings && !dayInfo.isPast
                      ? 'bg-blue-500/10 border-blue-500/50'
                      : 'border-[var(--text)]/10'}
                  `}
                >
                  {dayInfo.day}
                  {hasBookings && !dayInfo.isPast && (
                    <span className="absolute bottom-1 text-[10px] text-blue-500 font-medium">
                      {dayInfo.bookingsCount}건
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex gap-4 text-xs text-[var(--text-muted)]">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500/20 border border-red-500 rounded"></div>
              <span>차단됨</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500/10 border border-blue-500/50 rounded"></div>
              <span>예약 있음</span>
            </div>
          </div>

          {/* Blocked dates summary */}
          {settings.blockedDates.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[var(--text)]/10">
              <p className="text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                차단된 날짜 ({settings.blockedDates.length}개)
              </p>
              <div className="flex flex-wrap gap-2">
                {settings.blockedDates.map((date) => (
                  <span
                    key={date}
                    className="flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-600 rounded text-sm"
                  >
                    {date}
                    <button
                      type="button"
                      onClick={() => toggleBlockedDate(date)}
                      className="hover:text-red-400"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Save Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-theme-inverse text-theme-inverse rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? '저장 중...' : '설정 저장'}
          </button>
        </div>
      </form>
    </div>
  );
}
