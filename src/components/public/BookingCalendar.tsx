'use client';

import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import type { BookingSettings } from '@/types';
import {
  getKSTNow,
  getKSTToday,
  formatDateToKST,
  formatKSTDateKorean,
  formatKSTDateShort,
  getKSTTimeNow,
  timeToMinutes,
} from '@/lib/kst';

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
  endTime?: string;
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
  kakaoId: string;
  isUniversityStudent: boolean;
  privacyConsent: boolean;
}

interface ValidationErrors {
  date?: string;
  time?: string;
  service?: string;
  name?: string;
  email?: string;
  phone?: string;
  privacyConsent?: string;
}

// KST 기준으로 날짜 문자열 생성
function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function BookingCalendar() {
  // KST 기준 현재 날짜로 초기화
  const [currentDate, setCurrentDate] = useState(() => getKSTNow());
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
    kakaoId: '',
    isUniversityStudent: false,
    privacyConsent: false,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});

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
          .map((b: { date: string; time: string; endTime?: string; customer: { name: string }; status: string }) => {
            // DB의 날짜는 UTC로 저장됨 (예: 2026-01-28T15:00:00.000Z)
            // KST로 변환하면 +9시간이므로 날짜가 바뀔 수 있음
            // formatDateToKST를 사용하여 정확한 KST 날짜를 얻음
            const dateStr = formatDateToKST(new Date(b.date));
            return {
              date: dateStr,
              time: b.time,
              endTime: b.endTime,
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

    // KST 기준 오늘 날짜
    const kstNow = getKSTNow();
    const today = new Date(kstNow.getFullYear(), kstNow.getMonth(), kstNow.getDate());

    // KST 기준 최대 예약 가능 날짜
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

      // Get booked slots for this date
      const dateBookedSlots = bookedSlots.filter(slot => slot.date === dateStr);

      // Count available times considering overlapping bookings
      const availableCount = bookingSettings.availableTimes.filter(time => {
        const slotStart = timeToMinutes(time);
        const slotEnd = slotStart + bookingSettings.slotDuration;
        // Check if this time slot overlaps with any booked slot
        const isOverlapping = dateBookedSlots.some(slot => {
          const bookedStart = timeToMinutes(slot.time);
          const bookedEnd = slot.endTime ? timeToMinutes(slot.endTime) : bookedStart + 60;
          return slotStart < bookedEnd && bookedStart < slotEnd;
        });
        return !isOverlapping;
      }).length;

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
    if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (errors.time) setErrors((prev) => ({ ...prev, time: undefined }));
  };

  const isTimeBooked = (time: string) => {
    // Check if this time slot overlaps with any booked slot
    const slotStart = timeToMinutes(time);
    const slotEnd = slotStart + bookingSettings.slotDuration;

    return bookedTimesForSelectedDate.some(slot => {
      const bookedStart = timeToMinutes(slot.time);
      // If endTime exists, use it; otherwise assume 60 min duration
      const bookedEnd = slot.endTime ? timeToMinutes(slot.endTime) : bookedStart + 60;
      // Two ranges overlap if: start1 < end2 AND start2 < end1
      return slotStart < bookedEnd && bookedStart < slotEnd;
    });
  };

  // KST 기준으로 시간이 지났는지 확인 (오늘 날짜인 경우)
  const isTimePast = (time: string) => {
    if (!selectedDate) return false;
    const kstNow = getKSTNow();
    const today = new Date(kstNow.getFullYear(), kstNow.getMonth(), kstNow.getDate());
    const selectedDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

    // 오늘이 아니면 시간 비교 불필요
    if (selectedDay.getTime() !== today.getTime()) return false;

    // 오늘이면 현재 시간과 비교
    const nowMinutes = timeToMinutes(getKSTTimeNow());
    const slotMinutes = timeToMinutes(time);
    return slotMinutes <= nowMinutes;
  };

  const getBookerName = (time: string) => {
    const slot = bookedTimesForSelectedDate.find(s => s.time === time);
    return slot?.customerName || '예약됨';
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!selectedDate) {
      newErrors.date = '날짜를 선택해주세요';
    }
    if (!selectedTime) {
      newErrors.time = '시간을 선택해주세요';
    }
    if (!formData.service) {
      newErrors.service = '상담 유형을 선택해주세요';
    }
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = '연락처를 입력해주세요';
    }
    if (!formData.privacyConsent) {
      newErrors.privacyConsent = '개인정보 수집 및 이용에 동의해주세요';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Show alert with first error
      const firstError = Object.values(newErrors)[0];
      alert(firstError);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // TypeScript guard - validateForm ensures these are not null
    if (!selectedDate || !selectedTime) return;

    setLoading(true);

    try {
      // Use local date string to avoid timezone issues
      const dateStr = formatDate(selectedDate);
      // Calculate endTime based on slotDuration
      const [startHour, startMin] = selectedTime.split(':').map(Number);
      const endMinutes = startHour * 60 + startMin + bookingSettings.slotDuration;
      const endHour = Math.floor(endMinutes / 60);
      const endMin = endMinutes % 60;
      const endTime = `${String(endHour).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: dateStr,
          time: selectedTime,
          endTime,
          service: formData.service,
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            instagram: formData.instagram || undefined,
            tiktok: formData.tiktok || undefined,
          },
          kakaoId: formData.kakaoId || undefined,
          isUniversityStudent: formData.isUniversityStudent,
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
          setFormData({ service: '', name: '', email: '', phone: '', instagram: '', tiktok: '', kakaoId: '', isUniversityStudent: false, privacyConsent: false });
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
                ? formatKSTDateKorean(selectedDate)
                : '날짜를 선택해주세요'}
            </span>
          </div>

          {selectedDate ? (
            <div className="grid grid-cols-4 gap-2">
              {bookingSettings.availableTimes.map((time) => {
                const booked = isTimeBooked(time);
                const past = isTimePast(time);
                const isDisabled = booked || past;
                const isSelected = selectedTime === time;

                return (
                  <button
                    key={time}
                    disabled={isDisabled}
                    onClick={() => handleTimeSelect(time)}
                    className={`
                      py-3 text-center text-sm border relative transition-all
                      ${past
                        ? 'border-gray-500/30 opacity-30 cursor-not-allowed'
                        : booked
                        ? 'border-red-500/50 opacity-50 cursor-not-allowed'
                        : 'border-green-500/50 hover:bg-green-500 hover:text-white'}
                      ${isSelected ? 'bg-theme-inverse text-theme-inverse border-theme' : ''}
                    `}
                  >
                    {past ? (
                      <span className="text-gray-400 line-through">{time}</span>
                    ) : booked ? (
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
            <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <span className="text-[10px]">🇰🇷</span>
              <span>한국 시간 (KST)</span>
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
              <div className={`flex justify-between py-2 border-b text-sm ${errors.date ? 'border-red-500' : 'border-[var(--text)]/5'}`}>
                <span className={errors.date ? 'text-red-500' : 'text-[var(--text-muted)]'}>날짜 *</span>
                <span className={!selectedDate && errors.date ? 'text-red-500' : ''}>
                  {selectedDate ? formatKSTDateShort(selectedDate) : (errors.date || '-')}
                </span>
              </div>
              <div className={`flex justify-between py-2 border-b text-sm ${errors.time ? 'border-red-500' : 'border-[var(--text)]/5'}`}>
                <span className={errors.time ? 'text-red-500' : 'text-[var(--text-muted)]'}>시간 *</span>
                <span className={!selectedTime && errors.time ? 'text-red-500' : ''}>
                  {selectedTime || (errors.time || '-')}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--text)]/5 text-sm">
                <span className="text-[var(--text-muted)]">소요시간</span>
                <span>
                  {bookingSettings.slotDuration >= 60
                    ? `${Math.floor(bookingSettings.slotDuration / 60)}시간${bookingSettings.slotDuration % 60 > 0 ? ` ${bookingSettings.slotDuration % 60}분` : ''}`
                    : `${bookingSettings.slotDuration}분`}
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-xs tracking-wider mb-2 ${errors.service ? 'text-red-500' : 'text-[var(--text-muted)]'}`}>
                  상담 유형 *
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => {
                    setFormData({ ...formData, service: e.target.value });
                    if (errors.service) setErrors({ ...errors, service: undefined });
                  }}
                  className={`w-full px-4 py-3 bg-transparent border focus:outline-none ${
                    errors.service ? 'border-red-500 focus:border-red-500' : 'border-[var(--text)]/20 focus:border-[var(--text)]'
                  }`}
                  required
                >
                  <option value="">상담 유형을 선택해주세요</option>
                  {serviceTypes.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
                {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service}</p>}
              </div>

              <div>
                <label className={`block text-xs tracking-wider mb-2 ${errors.name ? 'text-red-500' : 'text-[var(--text-muted)]'}`}>
                  이름 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: undefined });
                  }}
                  className={`w-full px-4 py-3 bg-transparent border focus:outline-none ${
                    errors.name ? 'border-red-500 focus:border-red-500' : 'border-[var(--text)]/20 focus:border-[var(--text)]'
                  }`}
                  required
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className={`block text-xs tracking-wider mb-2 ${errors.email ? 'text-red-500' : 'text-[var(--text-muted)]'}`}>
                  이메일 *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  className={`w-full px-4 py-3 bg-transparent border focus:outline-none ${
                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-[var(--text)]/20 focus:border-[var(--text)]'
                  }`}
                  required
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className={`block text-xs tracking-wider mb-2 ${errors.phone ? 'text-red-500' : 'text-[var(--text-muted)]'}`}>
                  연락처 *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: undefined });
                  }}
                  className={`w-full px-4 py-3 bg-transparent border focus:outline-none ${
                    errors.phone ? 'border-red-500 focus:border-red-500' : 'border-[var(--text)]/20 focus:border-[var(--text)]'
                  }`}
                  required
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
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

              <div>
                <label className="block text-xs tracking-wider text-[var(--text-muted)] mb-2">
                  카카오톡 ID
                </label>
                <input
                  type="text"
                  value={formData.kakaoId}
                  onChange={(e) => setFormData({ ...formData, kakaoId: e.target.value })}
                  placeholder="카카오톡 아이디"
                  className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 focus:border-[var(--text)] focus:outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer py-3">
                  <input
                    type="checkbox"
                    checked={formData.isUniversityStudent}
                    onChange={(e) => setFormData({ ...formData, isUniversityStudent: e.target.checked })}
                    className="w-4 h-4 accent-rose-500"
                  />
                  <span className="text-sm">대학생입니다</span>
                </label>
              </div>

              {/* Privacy Consent */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.privacyConsent}
                    onChange={(e) => {
                      setFormData({ ...formData, privacyConsent: e.target.checked });
                      if (errors.privacyConsent) setErrors({ ...errors, privacyConsent: undefined });
                    }}
                    className={`w-4 h-4 mt-0.5 ${errors.privacyConsent ? 'accent-red-500' : 'accent-rose-500'}`}
                    required
                  />
                  <span className={`text-xs leading-relaxed ${errors.privacyConsent ? 'text-red-500' : 'text-[var(--text-muted)]'}`}>
                    개인정보 수집 및 이용에 동의합니다. 수집항목: 이름, 연락처, 이메일, SNS 계정 / 수집목적: 상담 및 예약 진행 / 보유기간: 상담 완료 후 1년
                  </span>
                </label>
                {errors.privacyConsent && <p className="text-red-500 text-xs mt-1">{errors.privacyConsent}</p>}
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
