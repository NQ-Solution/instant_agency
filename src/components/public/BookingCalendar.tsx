'use client';

import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import type { BookingSettings } from '@/types';

const serviceTypes = [
  { id: 'profile', name: '프로필 지원 및 접수' },
  { id: 'model', name: '모델 캐스팅' },
  { id: 'general', name: '일반 미팅' },
];

const defaultSettings: BookingSettings = {
  availableTimes: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
  blockedDates: [],
  blockedWeekdays: [],
  minAdvanceHours: 24,
  maxAdvanceDays: 60,
  slotDuration: 60,
};

const months = [
  '1월', '2월', '3월', '4월', '5월', '6월',
  '7월', '8월', '9월', '10월', '11월', '12월'
];

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

interface BookedSlot {
  date: string;
  time: string;
  customerName?: string;
  status?: string;
}

interface BookingFormData {
  service: string;
  name: string;
  email: string;
  phone: string;
  instagram: string;
  tiktok: string;
  privacyConsent: boolean;
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [bookingSettings, setBookingSettings] = useState<BookingSettings>(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    service: '',
    name: '',
    email: '',
    phone: '',
    instagram: '',
    tiktok: '',
    privacyConsent: false,
  });

  useEffect(() => {
    fetchBookedSlots();
    fetchBookingSettings();
  }, []);

  const fetchBookingSettings = async () => {
    try {
      const res = await fetch('/api/booking-settings');
      const data = await res.json();
      if (data.success && data.data) {
        setBookingSettings({
          ...defaultSettings,
          ...data.data,
          availableTimes: data.data.availableTimes || defaultSettings.availableTimes,
          blockedDates: data.data.blockedDates || [],
          blockedWeekdays: data.data.blockedWeekdays || [],
        });
      }
    } catch (error) {
      console.error('Error fetching booking settings:', error);
    }
  };

  const fetchBookedSlots = async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.success) {
        // Filter out cancelled bookings and map to slots
        const slots = data.data
          .filter((b: { status: string }) => b.status !== 'cancelled')
          .map((b: { date: string; time: string; customer: { name: string }; status: string }) => {
            // Convert to local date string to avoid timezone issues
            const dateObj = new Date(b.date);
            const localDateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
            return {
              date: localDateStr,
              time: b.time,
              customerName: b.customer?.name,
              status: b.status,
            };
          });
        setBookedSlots(slots);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate max booking date
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + bookingSettings.maxAdvanceDays);

    const days: Array<{
      day: number | null;
      date: Date | null;
      isPast: boolean;
      isToday: boolean;
      isWeekend: boolean;
      isBlocked: boolean;
      isTooFar: boolean;
      hasSlots: boolean;
      isFullyBooked: boolean;
    }> = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, date: null, isPast: false, isToday: false, isWeekend: false, isBlocked: false, isTooFar: false, hasSlots: false, isFullyBooked: false });
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = formatDate(date);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isPast = date < today;
      const isToday = date.getTime() === today.getTime();
      const isTooFar = date > maxDate;

      // Check if date is blocked
      const isDateBlocked = bookingSettings.blockedDates.includes(dateStr);
      const isWeekdayBlocked = bookingSettings.blockedWeekdays.includes(dayOfWeek);
      const isBlocked = isDateBlocked || isWeekdayBlocked;

      // Get booked times for this date
      const bookedTimes = bookedSlots
        .filter(slot => slot.date === dateStr)
        .map(slot => slot.time);

      const availableCount = bookingSettings.availableTimes.length - bookedTimes.length;

      days.push({
        day,
        date,
        isPast,
        isToday,
        isWeekend,
        isBlocked,
        isTooFar,
        hasSlots: !isBlocked && availableCount > 0,
        isFullyBooked: !isBlocked && availableCount === 0,
      });
    }

    return days;
  }, [year, month, bookedSlots, bookingSettings]);

  const selectedDateStr = selectedDate ? formatDate(selectedDate) : null;
  const bookedTimesForSelectedDate = selectedDateStr
    ? bookedSlots.filter(slot => slot.date === selectedDateStr)
    : [];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDateSelect = (date: Date | null) => {
    if (!date) return;
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const isTimeBooked = (time: string) => {
    return bookedTimesForSelectedDate.some(slot => slot.time === time);
  };

  const getBookerName = (time: string) => {
    const slot = bookedTimesForSelectedDate.find(s => s.time === time);
    return slot?.customerName || '예약됨';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !formData.service) return;

    setLoading(true);

    try {
      // Use local date string to avoid timezone issues
      const dateStr = formatDate(selectedDate);
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: dateStr,
          time: selectedTime,
          endTime: `${parseInt(selectedTime.split(':')[0]) + 1}:00`,
          service: formData.service,
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            instagram: formData.instagram || undefined,
            tiktok: formData.tiktok || undefined,
          },
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setBookedSlots([...bookedSlots, {
          date: formatDate(selectedDate),
          time: selectedTime,
          customerName: formData.name,
          status: 'pending'
        }]);

        setTimeout(() => {
          setSuccess(false);
          setSelectedDate(null);
          setSelectedTime(null);
          setFormData({ service: '', name: '', email: '', phone: '', instagram: '', tiktok: '', privacyConsent: false });
        }, 3000);
      } else {
        alert(data.error || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = selectedDate && selectedTime && formData.service && formData.name && formData.email && formData.phone && formData.privacyConsent;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Calendar Section */}
      <div className="lg:col-span-2 border border-[var(--text)]/10 p-6 bg-[var(--bg)]/90 backdrop-blur-sm">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--text)]/10">
          <h2 className="font-serif text-2xl">{year}년 {months[month]}</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrevMonth}
              className="w-10 h-10 border border-[var(--text)]/20 flex items-center justify-center hover:bg-theme-inverse hover:text-theme-inverse transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={handleNextMonth}
              className="w-10 h-10 border border-[var(--text)]/20 flex items-center justify-center hover:bg-theme-inverse hover:text-theme-inverse transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {weekdays.map((day) => (
            <div key={day} className="text-center text-xs tracking-wider text-[var(--text-muted)] py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((dayInfo, index) => {
            const isSelected = selectedDate && dayInfo.date?.getTime() === selectedDate.getTime();
            const isDisabled = !dayInfo.day || dayInfo.isPast || dayInfo.isBlocked || dayInfo.isTooFar;

            return (
              <button
                key={index}
                disabled={isDisabled}
                onClick={() => handleDateSelect(dayInfo.date)}
                className={`
                  aspect-square flex items-center justify-center text-sm relative transition-all
                  ${!dayInfo.day ? 'cursor-default' : ''}
                  ${dayInfo.isPast || dayInfo.isTooFar ? 'opacity-30 cursor-not-allowed' : ''}
                  ${dayInfo.isBlocked && !dayInfo.isPast ? 'opacity-40 cursor-not-allowed bg-red-500/10' : ''}
                  ${dayInfo.day && !isDisabled ? 'border border-[var(--text)]/10 hover:border-[var(--text)]' : ''}
                  ${dayInfo.day && isDisabled && !dayInfo.isPast && !dayInfo.isTooFar ? 'border border-red-500/30' : ''}
                  ${dayInfo.isToday && !isDisabled ? 'border-[var(--text)]' : ''}
                  ${isSelected ? 'bg-theme-inverse text-theme-inverse border-theme' : ''}
                `}
              >
                {dayInfo.day}
                {dayInfo.day && !dayInfo.isPast && !dayInfo.isTooFar && (
                  <span
                    className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                      dayInfo.isBlocked ? 'bg-gray-400' : dayInfo.isFullyBooked ? 'bg-red-500' : dayInfo.hasSlots ? 'bg-green-500' : ''
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Time Slots */}
        <div className="mt-6 pt-6 border-t border-[var(--text)]/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs tracking-wider text-[var(--text-muted)]">
              예약 가능 시간
            </span>
            <span className="font-serif">
              {selectedDate
                ? selectedDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
                : '날짜를 선택해주세요'}
            </span>
          </div>

          {selectedDate ? (
            <div className="grid grid-cols-4 gap-2">
              {bookingSettings.availableTimes.map((time) => {
                const booked = isTimeBooked(time);
                const isSelected = selectedTime === time;

                return (
                  <button
                    key={time}
                    disabled={booked}
                    onClick={() => handleTimeSelect(time)}
                    className={`
                      py-3 text-center text-sm border relative transition-all
                      ${booked
                        ? 'border-red-500/50 opacity-50 cursor-not-allowed'
                        : 'border-green-500/50 hover:bg-green-500 hover:text-white'}
                      ${isSelected ? 'bg-theme-inverse text-theme-inverse border-theme' : ''}
                    `}
                  >
                    {booked ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <span className="text-[10px] text-muted line-through">{time}</span>
                        <span className="text-[10px] text-red-400 font-medium truncate max-w-full px-1">
                          {getBookerName(time)}
                        </span>
                      </div>
                    ) : (
                      time
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-[var(--text-muted)]">
              날짜를 선택하시면 예약 가능한 시간이 표시됩니다
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span>예약 가능</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>예약 완료</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              <span>예약 불가</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Section */}
      <div className="border border-[var(--text)]/10 p-6 bg-[var(--bg)]/90 backdrop-blur-sm">
        <h2 className="font-serif text-xl mb-6 pb-4 border-b border-[var(--text)]/10">
          예약 정보
        </h2>

        {success ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="text-green-500" size={32} />
            </div>
            <p className="text-lg mb-2">예약이 완료되었습니다!</p>
            <p className="text-sm text-[var(--text-muted)]">
              확인 이메일이 발송됩니다.
            </p>
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="mb-6 space-y-3">
              <div className="flex justify-between py-2 border-b border-[var(--text)]/5 text-sm">
                <span className="text-[var(--text-muted)]">날짜</span>
                <span>{selectedDate ? selectedDate.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--text)]/5 text-sm">
                <span className="text-[var(--text-muted)]">시간</span>
                <span>{selectedTime || '-'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--text)]/5 text-sm">
                <span className="text-[var(--text-muted)]">소요시간</span>
                <span>1시간</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs tracking-wider text-[var(--text-muted)] mb-2">
                  상담 유형 *
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 focus:border-[var(--text)] focus:outline-none"
                  required
                >
                  <option value="">상담 유형을 선택해주세요</option>
                  {serviceTypes.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs tracking-wider text-[var(--text-muted)] mb-2">
                  이름 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 focus:border-[var(--text)] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs tracking-wider text-[var(--text-muted)] mb-2">
                  이메일 *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 focus:border-[var(--text)] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs tracking-wider text-[var(--text-muted)] mb-2">
                  연락처 *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 focus:border-[var(--text)] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs tracking-wider text-[var(--text-muted)] mb-2">
                  인스타그램
                </label>
                <input
                  type="text"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="@username"
                  className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 focus:border-[var(--text)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs tracking-wider text-[var(--text-muted)] mb-2">
                  틱톡
                </label>
                <input
                  type="text"
                  value={formData.tiktok}
                  onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                  placeholder="@username"
                  className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 focus:border-[var(--text)] focus:outline-none"
                />
              </div>

              {/* Privacy Consent */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.privacyConsent}
                    onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
                    className="w-4 h-4 mt-0.5 accent-rose-500"
                    required
                  />
                  <span className="text-xs text-[var(--text-muted)] leading-relaxed">
                    개인정보 수집 및 이용에 동의합니다. 수집항목: 이름, 연락처, 이메일, SNS 계정 / 수집목적: 상담 및 예약 진행 / 보유기간: 상담 완료 후 1년
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={!canSubmit || loading}
                className="w-full py-4 bg-theme-inverse text-theme-inverse text-xs tracking-wider hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
              >
                {loading ? '처리 중...' : '예약 확정'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
