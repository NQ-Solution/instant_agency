'use client';

import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';

const serviceTypes = [
  { id: 'studio', name: 'Studio Consultation', nameKr: '스튜디오 상담' },
  { id: 'model', name: 'Model Casting', nameKr: '모델 캐스팅' },
  { id: 'live', name: 'Live Commerce Planning', nameKr: '라이브 커머스 기획' },
  { id: 'general', name: 'General Meeting', nameKr: '일반 미팅' },
];

const availableTimes = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

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
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    service: '',
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    fetchBookedSlots();
  }, []);

  const fetchBookedSlots = async () => {
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.success) {
        // Filter out cancelled bookings and map to slots
        const slots = data.data
          .filter((b: { status: string }) => b.status !== 'cancelled')
          .map((b: { date: string; time: string; customer: { name: string }; status: string }) => ({
            date: new Date(b.date).toISOString().split('T')[0],
            time: b.time,
            customerName: b.customer?.name,
            status: b.status,
          }));
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

    const days: Array<{
      day: number | null;
      date: Date | null;
      isPast: boolean;
      isToday: boolean;
      isWeekend: boolean;
      hasSlots: boolean;
      isFullyBooked: boolean;
    }> = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, date: null, isPast: false, isToday: false, isWeekend: false, hasSlots: false, isFullyBooked: false });
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = formatDate(date);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isPast = date < today;
      const isToday = date.getTime() === today.getTime();

      // Get booked times for this date
      const bookedTimes = bookedSlots
        .filter(slot => slot.date === dateStr)
        .map(slot => slot.time);

      const availableCount = availableTimes.length - bookedTimes.length;

      days.push({
        day,
        date,
        isPast,
        isToday,
        isWeekend,
        hasSlots: availableCount > 0,
        isFullyBooked: availableCount === 0,
      });
    }

    return days;
  }, [year, month, bookedSlots]);

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
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: selectedDate.toISOString(),
          time: selectedTime,
          endTime: `${parseInt(selectedTime.split(':')[0]) + 1}:00`,
          service: formData.service,
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
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
          setFormData({ service: '', name: '', email: '', phone: '' });
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

  const canSubmit = selectedDate && selectedTime && formData.service && formData.name && formData.email && formData.phone;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Calendar Section */}
      <div className="lg:col-span-2 border border-[var(--text)]/10 p-6 bg-[var(--bg)]/90 backdrop-blur-sm">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--text)]/10">
          <h2 className="font-serif text-2xl">{months[month]} {year}</h2>
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
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs tracking-wider uppercase text-[var(--text-muted)] py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((dayInfo, index) => {
            const isSelected = selectedDate && dayInfo.date?.getTime() === selectedDate.getTime();

            return (
              <button
                key={index}
                disabled={!dayInfo.day || dayInfo.isPast}
                onClick={() => handleDateSelect(dayInfo.date)}
                className={`
                  aspect-square flex items-center justify-center text-sm relative transition-all
                  ${!dayInfo.day ? 'cursor-default' : ''}
                  ${dayInfo.isPast ? 'opacity-30 cursor-not-allowed' : ''}
                  ${dayInfo.day && !dayInfo.isPast ? 'border border-[var(--text)]/10 hover:border-[var(--text)]' : ''}
                  ${dayInfo.isToday ? 'border-[var(--text)]' : ''}
                  ${isSelected ? 'bg-theme-inverse text-theme-inverse border-theme' : ''}
                `}
              >
                {dayInfo.day}
                {dayInfo.day && !dayInfo.isPast && (
                  <span
                    className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                      dayInfo.isFullyBooked ? 'bg-red-500' : dayInfo.hasSlots ? 'bg-green-500' : ''
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
            <span className="text-xs tracking-wider uppercase text-[var(--text-muted)]">
              Available Times
            </span>
            <span className="font-serif">
              {selectedDate
                ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                : 'Select a date'}
            </span>
          </div>

          {selectedDate ? (
            <div className="grid grid-cols-4 gap-2">
              {availableTimes.map((time) => {
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
              Please select a date to see available times
            </div>
          )}

          {/* Legend */}
          <div className="flex gap-6 mt-4">
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>Booked</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Section */}
      <div className="border border-[var(--text)]/10 p-6 bg-[var(--bg)]/90 backdrop-blur-sm">
        <h2 className="font-serif text-xl mb-6 pb-4 border-b border-[var(--text)]/10">
          Booking Details
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
                <span className="text-[var(--text-muted)]">Date</span>
                <span>{selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--text)]/5 text-sm">
                <span className="text-[var(--text-muted)]">Time</span>
                <span>{selectedTime || '-'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--text)]/5 text-sm">
                <span className="text-[var(--text-muted)]">Duration</span>
                <span>1 Hour</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                  Service Type *
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 focus:border-[var(--text)] focus:outline-none"
                  required
                >
                  <option value="">Select a service</option>
                  {serviceTypes.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                  Your Name *
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
                <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                  Email *
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
                <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 focus:border-[var(--text)] focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!canSubmit || loading}
                className="w-full py-4 bg-theme-inverse text-theme-inverse text-xs tracking-wider uppercase hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
