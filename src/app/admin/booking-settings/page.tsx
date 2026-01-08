'use client';

import { useState, useEffect, useMemo } from 'react';
import { Save, Plus, Trash2, ChevronLeft, ChevronRight, Calendar, Clock, X } from 'lucide-react';
import type { BookingSettings } from '@/types';

const months = [
  '1월', '2월', '3월', '4월', '5월', '6월',
  '7월', '8월', '9월', '10월', '11월', '12월'
];

const weekdayNames = ['일', '월', '화', '수', '목', '금', '토'];

const defaultTimes = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function BookingSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [settings, setSettings] = useState<BookingSettings>({
    availableTimes: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
    blockedDates: [],
    blockedWeekdays: [],
    minAdvanceHours: 24,
    maxAdvanceDays: 60,
    slotDuration: 60,
  });
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days: Array<{
      day: number | null;
      date: Date | null;
      dateStr: string;
      isPast: boolean;
      isBlocked: boolean;
      isWeekdayBlocked: boolean;
    }> = [];

    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, date: null, dateStr: '', isPast: false, isBlocked: false, isWeekdayBlocked: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = formatDate(date);
      const dayOfWeek = date.getDay();
      const isPast = date < today;
      const isBlocked = settings.blockedDates.includes(dateStr);
      const isWeekdayBlocked = settings.blockedWeekdays.includes(dayOfWeek);

      days.push({
        day,
        date,
        dateStr,
        isPast,
        isBlocked,
        isWeekdayBlocked,
      });
    }

    return days;
  }, [year, month, settings.blockedDates, settings.blockedWeekdays]);

  const toggleBlockedDate = (dateStr: string) => {
    if (!dateStr) return;

    const isBlocked = settings.blockedDates.includes(dateStr);
    if (isBlocked) {
      setSettings({
        ...settings,
        blockedDates: settings.blockedDates.filter(d => d !== dateStr),
      });
    } else {
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
            <div className="flex items-center gap-2 mb-4">
              <Clock size={20} />
              <h2 className="font-serif text-xl">예약 가능 시간</h2>
            </div>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              고객이 예약할 수 있는 시간대를 설정합니다
            </p>

            {/* Quick select default times */}
            <div className="mb-4">
              <p className="text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">시간 선택</p>
              <div className="flex flex-wrap gap-2">
                {defaultTimes.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => toggleDefaultTime(time)}
                    className={`px-3 py-2 text-sm border rounded transition-colors ${
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
            <div className="flex gap-2 mb-4">
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

            {/* Current times list */}
            <div className="space-y-2">
              <p className="text-xs tracking-wider uppercase text-[var(--text-muted)]">현재 설정된 시간</p>
              <div className="flex flex-wrap gap-2">
                {settings.availableTimes.length === 0 ? (
                  <p className="text-sm text-[var(--text-muted)]">설정된 시간이 없습니다</p>
                ) : (
                  settings.availableTimes.map((time) => (
                    <span
                      key={time}
                      className="flex items-center gap-2 px-3 py-1 bg-[var(--text)]/10 rounded text-sm"
                    >
                      {time}
                      <button
                        type="button"
                        onClick={() => removeTime(time)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))
                )}
              </div>
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

              return (
                <button
                  key={index}
                  type="button"
                  disabled={!dayInfo.day || dayInfo.isPast}
                  onClick={() => toggleBlockedDate(dayInfo.dateStr)}
                  className={`
                    aspect-square flex items-center justify-center text-sm rounded transition-all
                    ${!dayInfo.day ? 'cursor-default' : ''}
                    ${dayInfo.isPast ? 'opacity-30 cursor-not-allowed' : ''}
                    ${dayInfo.day && !dayInfo.isPast ? 'border hover:opacity-80' : ''}
                    ${isBlocked && !dayInfo.isPast
                      ? 'bg-red-500/20 border-red-500 text-red-600'
                      : 'border-[var(--text)]/10'}
                  `}
                >
                  {dayInfo.day}
                </button>
              );
            })}
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
