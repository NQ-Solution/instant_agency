'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Calendar } from 'lucide-react';
import BookingCalendar from '@/components/public/BookingCalendar';

const offices = [
  { city: 'Seoul', address: '강남구 테헤란로 123, 크리에이티브 빌딩 5층', phone: '+82 2 1234 5678' },
  { city: 'Paris', address: '12 Rue de la Mode, Le Marais, 75003', phone: '+33 1 23 45 67 89' },
  { city: 'New York', address: '456 Fashion Avenue, SoHo, NY 10012', phone: '+1 212 123 4567' },
];

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<'inquiry' | 'booking'>('inquiry');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setSuccess(true);
    setLoading(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      subject: '',
      message: '',
    });

    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div>
      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-8 relative">
        <p className="text-xs tracking-[0.3em] uppercase text-muted mb-6 animate-fade-up">
          Get in Touch
        </p>
        <h1 className="font-logo text-[clamp(4rem,15vw,12rem)] font-normal leading-[0.9] tracking-[-0.02em] animate-fade-up">
          Contact
        </h1>
        <p className="text-muted mt-8 max-w-xl mx-auto leading-relaxed animate-fade-up-delay">
          문의사항이 있거나 미팅 예약이 필요하시면 아래에서 선택해주세요.
        </p>

        {/* Scroll Indicator */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-fade-up-delay">
          <span className="text-[0.65rem] tracking-[0.3em] uppercase text-muted">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-current to-transparent animate-scroll-pulse" />
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-16">
        <p className="text-xs tracking-[0.3em] uppercase text-muted mb-8 text-center">01</p>
        <div className="flex justify-center gap-12 border-b border-theme-10 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('inquiry')}
            className={`relative pb-4 text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${
              activeTab === 'inquiry'
                ? 'text-theme'
                : 'text-muted hover:text-theme'
            }`}
          >
            Inquiry
            <span className={`absolute bottom-0 left-0 h-px bg-theme transition-all duration-300 ${
              activeTab === 'inquiry' ? 'w-full' : 'w-0'
            }`} />
          </button>
          <button
            onClick={() => setActiveTab('booking')}
            className={`relative pb-4 text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${
              activeTab === 'booking'
                ? 'text-theme'
                : 'text-muted hover:text-theme'
            }`}
          >
            Book a Meeting
            <span className={`absolute bottom-0 left-0 h-px bg-theme transition-all duration-300 ${
              activeTab === 'booking' ? 'w-full' : 'w-0'
            }`} />
          </button>
        </div>
      </section>

      {/* Content */}
      <section className="px-8 pb-24">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'inquiry' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <div className="p-8 border border-theme-10 bg-[var(--bg)]/80 backdrop-blur-sm">
                <h2 className="text-2xl mb-8">Send a Message</h2>

                {success && (
                  <div className="bg-green-500/10 border border-green-500/30 text-green-500 p-4 rounded-lg mb-6">
                    메시지가 성공적으로 전송되었습니다. 곧 연락드리겠습니다.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs tracking-wider uppercase text-muted mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-transparent border border-theme-20 focus:border-theme transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-wider uppercase text-muted mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-transparent border border-theme-20 focus:border-theme transition-colors"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs tracking-wider uppercase text-muted mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-transparent border border-theme-20 focus:border-theme transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-wider uppercase text-muted mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-3 bg-transparent border border-theme-20 focus:border-theme transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-muted mb-2">
                      Subject *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-transparent border border-theme-20 focus:border-theme transition-colors"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="studio">Studio Inquiry</option>
                      <option value="model">Model Booking</option>
                      <option value="live">Live Commerce</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-muted mb-2">
                      Message *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 bg-transparent border border-theme-20 focus:border-theme transition-colors resize-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-4 bg-theme-inverse text-theme-inverse text-sm tracking-wider uppercase hover:opacity-80 transition-opacity disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="p-8 border border-theme-10 bg-[var(--bg)]/80 backdrop-blur-sm h-fit">
                <h2 className="text-2xl mb-8">Contact Information</h2>
                <div className="space-y-8 mb-12">
                  <div className="flex gap-4">
                    <Mail className="text-muted mt-1" size={20} />
                    <div>
                      <p className="text-xs tracking-wider uppercase text-muted mb-1">
                        Email
                      </p>
                      <a
                        href="mailto:contact@instant-agency.com"
                        className="hover:opacity-70 transition-opacity"
                      >
                        contact@instant-agency.com
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Clock className="text-muted mt-1" size={20} />
                    <div>
                      <p className="text-xs tracking-wider uppercase text-muted mb-1">
                        Business Hours
                      </p>
                      <p>Mon - Fri, 10:00 - 19:00</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl mb-6">Our Offices</h3>
                <div className="space-y-6">
                  {offices.map((office) => (
                    <div
                      key={office.city}
                      className="p-6 border border-theme-10"
                    >
                      <div className="flex items-start gap-4">
                        <MapPin className="text-muted mt-1" size={20} />
                        <div>
                          <h4 className="text-lg mb-2">{office.city}</h4>
                          <p className="text-sm text-muted mb-2">
                            {office.address}
                          </p>
                          <a
                            href={`tel:${office.phone}`}
                            className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity"
                          >
                            <Phone size={14} />
                            {office.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl mb-4 text-center">Book a Meeting</h2>
              <p className="text-muted text-center mb-8">
                문의사항이 있거나 미팅 예약이 필요하시면 아래에서 날짜와 시간을 선택해주세요.
              </p>
              <BookingCalendar />
            </div>
          )}
        </div>
      </section>

      {/* Map Section */}
      <section className="px-8 pb-24 max-w-[1400px] mx-auto">
        <div className="mb-8">
          <h2 className="font-logo text-2xl font-normal mb-2">Location</h2>
          <p className="text-sm text-muted">서울 본사 위치를 확인하세요</p>
        </div>
        <div className="map-container relative w-full h-[450px] border border-theme-10 overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.352889088086!2d127.02857831531037!3d37.49774987981102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca157a5f9b85f%3A0x7e6a1e3c2a4e4a1a!2sTeheran-ro%2C%20Gangnam-gu%2C%20Seoul!5e0!3m2!1sen!2skr!4v1"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-6 pt-6 border-t border-theme-10">
          <div>
            <strong className="block mb-1">Instant Agency Seoul HQ</strong>
            <span className="text-muted text-sm">서울특별시 강남구 테헤란로 123, Instant Agency빌딩 8F</span>
          </div>
          <a
            href="https://map.kakao.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-theme text-xs tracking-[0.1em] uppercase hover:bg-theme-inverse hover:text-theme-inverse transition-all duration-300"
          >
            Get Directions →
          </a>
        </div>
      </section>
    </div>
  );
}
