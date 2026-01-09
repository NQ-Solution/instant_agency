'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import BookingCalendar from '@/components/public/BookingCalendar';
import PageGuard from '@/components/public/PageGuard';
import type { ContactPageContent } from '@/types';

interface Office {
  city: string;
  address: string;
  phone?: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  businessHours: string;
}

interface Settings {
  contact: ContactInfo;
  offices: Office[];
}

const defaultContent: ContactPageContent = {
  hero: {
    label: 'Instant Studio',
    title: 'Contact',
    subtitle: 'Get in touch with us for inquiries or schedule a profile submission meeting.',
  },
  info: {
    email: '',
    businessHours: '',
  },
  offices: [],
  map: {
    title: '오시는 길',
    subtitle: '오피스 위치를 확인하세요',
    embedUrl: '',
    address: '',
    directionsUrl: 'https://map.kakao.com',
  },
};

export default function ContactPage() {
  return (
    <PageGuard pageKey="contact">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--text)]"></div>
        </div>
      }>
        <ContactPageInner />
      </Suspense>
    </PageGuard>
  );
}

function ContactPageInner() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');

  const [content, setContent] = useState<ContactPageContent>(defaultContent);
  const [activeTab, setActiveTab] = useState<'inquiry' | 'booking'>(
    tabParam === 'inquiry' ? 'inquiry' : 'booking'
  );
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    instagram: '',
    tiktok: '',
    youtube: '',
    privacyConsent: false,
  });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pageRes, settingsRes] = await Promise.all([
          fetch('/api/pages/contact'),
          fetch('/api/settings'),
        ]);

        const pageData = await pageRes.json();
        const settingsData = await settingsRes.json();

        if (pageData.success && pageData.data?.sections?.content) {
          setContent({ ...defaultContent, ...pageData.data.sections.content });
        }

        if (settingsData.success && settingsData.data) {
          setSettings({
            contact: settingsData.data.contact || { email: '', phone: '', businessHours: '' },
            offices: settingsData.data.offices || [],
          });
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setPageLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          message: '',
          instagram: '',
          tiktok: '',
          youtube: '',
          privacyConsent: false,
        });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(data.error || '메시지 전송에 실패했습니다.');
      }
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      setError('메시지 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--text)]"></div>
      </div>
    );
  }

  // Merge page content with settings for display
  const displayEmail = content.info.email || settings?.contact?.email || '';
  const displayBusinessHours = content.info.businessHours || settings?.contact?.businessHours || '';
  const displayOffices = content.offices.length > 0 ? content.offices : settings?.offices || [];

  return (
    <div>
      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-8 relative">
        <p className="text-xs tracking-[0.3em] uppercase text-muted mb-6 animate-fade-up">
          {content.hero.label}
        </p>
        <h1 className="font-logo text-[clamp(4rem,15vw,12rem)] font-normal leading-[0.9] tracking-[-0.02em] animate-fade-up">
          {content.hero.title}
        </h1>
        <p className="text-muted mt-8 max-w-xl mx-auto leading-relaxed animate-fade-up-delay">
          {content.hero.subtitle}
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
            onClick={() => setActiveTab('booking')}
            className={`relative pb-4 text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${
              activeTab === 'booking'
                ? 'text-theme'
                : 'text-muted hover:text-theme'
            }`}
          >
            Profile Reservation
            <span className={`absolute bottom-0 left-0 h-px bg-theme transition-all duration-300 ${
              activeTab === 'booking' ? 'w-full' : 'w-0'
            }`} />
          </button>
          <button
            onClick={() => setActiveTab('inquiry')}
            className={`relative pb-4 text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${
              activeTab === 'inquiry'
                ? 'text-theme'
                : 'text-muted hover:text-theme'
            }`}
          >
            Live Commerce
            <span className={`absolute bottom-0 left-0 h-px bg-theme transition-all duration-300 ${
              activeTab === 'inquiry' ? 'w-full' : 'w-0'
            }`} />
          </button>
        </div>
      </section>

      {/* Content */}
      <section className="px-8 pb-24">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'booking' ? (
            <div>
              <h2 className="text-2xl mb-4 text-center">프로필 접수 및 지원</h2>
              <p className="text-muted text-center mb-8">
                프로필 접수 및 상담을 위한 미팅을 예약하세요.
              </p>
              <BookingCalendar />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <div className="p-8 border border-theme-10 bg-[var(--bg)]/80 backdrop-blur-sm">
                <h2 className="text-2xl mb-4">라이브커머스 지원</h2>
                <p className="text-muted text-sm mb-8">
                  라이브커머스 진행자 지원 또는 브랜드/기업 협업 문의를 남겨주세요.
                </p>

                {success && (
                  <div className="bg-green-500/10 border border-green-500/30 text-green-500 p-4 rounded-lg mb-6">
                    지원서가 성공적으로 제출되었습니다. 빠른 시일 내에 연락드리겠습니다.
                  </div>
                )}

                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-lg mb-6">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs tracking-wider uppercase text-muted mb-2">
                        이름 *
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
                        이메일 *
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
                        연락처
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
                        소속/회사
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
                      지원 유형 *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-transparent border border-theme-20 focus:border-theme transition-colors"
                      required
                    >
                      <option value="">지원 유형을 선택해주세요</option>
                      <option value="creator">크리에이터 지원</option>
                      <option value="brand">브랜드·기업 문의</option>
                    </select>
                  </div>
                  {/* Social Media */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs tracking-wider uppercase text-muted mb-2">
                        인스타그램
                      </label>
                      <input
                        type="text"
                        value={formData.instagram}
                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                        placeholder="@username"
                        className="w-full px-4 py-3 bg-transparent border border-theme-20 focus:border-theme transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-wider uppercase text-muted mb-2">
                        틱톡
                      </label>
                      <input
                        type="text"
                        value={formData.tiktok}
                        onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                        placeholder="@username"
                        className="w-full px-4 py-3 bg-transparent border border-theme-20 focus:border-theme transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs tracking-wider uppercase text-muted mb-2">
                        유튜브
                      </label>
                      <input
                        type="text"
                        value={formData.youtube}
                        onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                        placeholder="채널명 또는 URL"
                        className="w-full px-4 py-3 bg-transparent border border-theme-20 focus:border-theme transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-muted mb-2">
                      내용 *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 bg-transparent border border-theme-20 focus:border-theme transition-colors resize-none"
                      placeholder="자기소개, 경력, 포트폴리오 링크 등을 포함해주세요."
                      required
                    />
                  </div>
                  {/* Privacy Consent */}
                  <div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.privacyConsent}
                        onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
                        className="w-4 h-4 mt-0.5"
                        required
                      />
                      <span className="text-xs text-muted leading-relaxed">
                        개인정보 수집 및 이용에 동의합니다. 수집항목: 이름, 연락처, 이메일, 소속/회사명, SNS 계정 / 수집목적: 지원 심사 및 상담 / 보유기간: 지원 완료 후 1년
                      </span>
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !formData.privacyConsent}
                    className="flex items-center gap-2 px-8 py-4 bg-theme-inverse text-theme-inverse text-sm tracking-wider uppercase hover:opacity-80 transition-opacity disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                        제출 중...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        지원서 제출
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="p-8 border border-theme-10 bg-[var(--bg)]/80 backdrop-blur-sm h-fit">
                <h2 className="text-2xl mb-8">Contact Information</h2>
                <div className="space-y-8 mb-12">
                  {displayEmail && (
                    <div className="flex gap-4">
                      <Mail className="text-muted mt-1" size={20} />
                      <div>
                        <p className="text-xs tracking-wider uppercase text-muted mb-1">
                          Email
                        </p>
                        <a
                          href={`mailto:${displayEmail}`}
                          className="hover:opacity-70 transition-opacity"
                        >
                          {displayEmail}
                        </a>
                      </div>
                    </div>
                  )}
                  {settings?.contact?.phone && (
                    <div className="flex gap-4">
                      <Phone className="text-muted mt-1" size={20} />
                      <div>
                        <p className="text-xs tracking-wider uppercase text-muted mb-1">
                          Phone
                        </p>
                        <a
                          href={`tel:${settings.contact.phone}`}
                          className="hover:opacity-70 transition-opacity"
                        >
                          {settings.contact.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {displayBusinessHours && (
                    <div className="flex gap-4">
                      <Clock className="text-muted mt-1" size={20} />
                      <div>
                        <p className="text-xs tracking-wider uppercase text-muted mb-1">
                          Business Hours
                        </p>
                        <p>{displayBusinessHours}</p>
                      </div>
                    </div>
                  )}
                </div>

                {displayOffices.length > 0 && (
                  <>
                    <h3 className="text-xl mb-6">Our Offices</h3>
                    <div className="space-y-6">
                      {displayOffices.map((office, index) => (
                        <div
                          key={index}
                          className="p-6 border border-theme-10"
                        >
                          <div className="flex items-start gap-4">
                            <MapPin className="text-muted mt-1" size={20} />
                            <div>
                              <h4 className="text-lg mb-2">{office.city}</h4>
                              <p className="text-sm text-muted mb-2">
                                {office.address}
                              </p>
                              {office.phone && (
                                <a
                                  href={`tel:${office.phone}`}
                                  className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity"
                                >
                                  <Phone size={14} />
                                  {office.phone}
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Show placeholder when no settings */}
                {!displayEmail && !settings?.contact?.phone && displayOffices.length === 0 && (
                  <div className="text-center py-8 text-muted">
                    <p>Contact information has not been set up yet.</p>
                    <p className="text-sm mt-2">Please configure it in the admin settings.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Map Section */}
      {(content.map.embedUrl || (displayOffices.length > 0 && displayOffices[0]?.address)) && (
        <section className="px-8 pb-24 max-w-[1400px] mx-auto">
          <div className="mb-8">
            <h2 className="font-logo text-2xl font-normal mb-2">{content.map.title}</h2>
            <p className="text-sm text-muted">{content.map.subtitle}</p>
          </div>
          {content.map.embedUrl && (
            <div className="map-container relative w-full h-[450px] border border-theme-10 overflow-hidden">
              <iframe
                src={content.map.embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-6 pt-6 border-t border-theme-10">
            <div>
              <strong className="block mb-1">
                {displayOffices[0]?.city || 'Office'}
              </strong>
              <span className="text-muted text-sm">
                {content.map.address || displayOffices[0]?.address || ''}
              </span>
            </div>
            {content.map.directionsUrl && (
              <a
                href={content.map.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-theme text-xs tracking-[0.1em] hover:bg-theme-inverse hover:text-theme-inverse transition-all duration-300"
              >
                Get Directions →
              </a>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

