'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import type { ContactPageContent } from '@/types';

const defaultContent: ContactPageContent = {
  hero: {
    label: 'Get in Touch',
    title: 'Contact',
    subtitle: '문의사항이 있거나 미팅 예약이 필요하시면 아래에서 선택해주세요.',
  },
  info: {
    email: 'contact@instant-agency.com',
    businessHours: 'Mon - Fri, 10:00 - 19:00',
  },
  offices: [],
  map: {
    title: 'Location',
    subtitle: '서울 본사 위치를 확인하세요',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.352889088086!2d127.02857831531037!3d37.49774987981102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca157a5f9b85f%3A0x7e6a1e3c2a4e4a1a!2sTeheran-ro%2C%20Gangnam-gu%2C%20Seoul!5e0!3m2!1sen!2skr!4v1',
    address: '서울특별시 강남구 테헤란로 123, Instant Agency빌딩 8F',
    directionsUrl: 'https://map.kakao.com',
  },
};

export default function EditContactPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<ContactPageContent>(defaultContent);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/pages/contact');
      const data = await res.json();
      if (data.success && data.data?.sections?.content) {
        setContent({ ...defaultContent, ...data.data.sections.content });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/pages/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: { content } }),
      });
      if (res.ok) alert('저장되었습니다!');
      else alert('저장 실패');
    } catch (error) {
      alert('저장 실패');
    } finally {
      setSaving(false);
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
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/pages" className="p-2 hover:bg-[var(--text)]/10 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-serif text-3xl">Edit Contact Page</h1>
          <p className="text-[var(--text-muted)]">Contact 페이지 콘텐츠 관리</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hero Section */}
        <div className="border border-[var(--text)]/10 rounded-lg p-6 space-y-4">
          <h2 className="font-serif text-xl mb-4">Hero Section</h2>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Label</label>
            <input type="text" value={content.hero.label} onChange={(e) => setContent({ ...content, hero: { ...content.hero, label: e.target.value } })} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Title</label>
            <input type="text" value={content.hero.title} onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Subtitle</label>
            <textarea value={content.hero.subtitle} onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })} rows={2} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg resize-none" />
          </div>
        </div>

        {/* Contact Info */}
        <div className="border border-[var(--text)]/10 rounded-lg p-6 space-y-4">
          <h2 className="font-serif text-xl mb-4">Contact Information</h2>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Email</label>
            <input type="email" value={content.info.email} onChange={(e) => setContent({ ...content, info: { ...content.info, email: e.target.value } })} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Business Hours</label>
            <input type="text" value={content.info.businessHours} onChange={(e) => setContent({ ...content, info: { ...content.info, businessHours: e.target.value } })} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
          </div>
        </div>

        {/* Offices */}
        <div className="border border-[var(--text)]/10 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl">Offices</h2>
            <button type="button" onClick={() => setContent({ ...content, offices: [...content.offices, { city: '', address: '', phone: '' }] })} className="flex items-center gap-2 px-3 py-2 text-sm border border-[var(--text)]/20 rounded-lg hover:bg-[var(--text)]/5">
              <Plus size={16} /> Add Office
            </button>
          </div>
          {content.offices.map((office, i) => (
            <div key={i} className="border border-[var(--text)]/10 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)]">Office {i + 1}</span>
                <button type="button" onClick={() => setContent({ ...content, offices: content.offices.filter((_, idx) => idx !== i) })} className="p-1 text-red-500 hover:bg-red-500/10 rounded"><Trash2 size={14} /></button>
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">City</label>
                <input type="text" value={office.city} onChange={(e) => {
                  const offices = [...content.offices];
                  offices[i] = { ...offices[i], city: e.target.value };
                  setContent({ ...content, offices });
                }} className="w-full px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Address</label>
                <input type="text" value={office.address} onChange={(e) => {
                  const offices = [...content.offices];
                  offices[i] = { ...offices[i], address: e.target.value };
                  setContent({ ...content, offices });
                }} className="w-full px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Phone</label>
                <input type="text" value={office.phone} onChange={(e) => {
                  const offices = [...content.offices];
                  offices[i] = { ...offices[i], phone: e.target.value };
                  setContent({ ...content, offices });
                }} className="w-full px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm" />
              </div>
            </div>
          ))}
        </div>

        {/* Map Section */}
        <div className="border border-[var(--text)]/10 rounded-lg p-6 space-y-4">
          <h2 className="font-serif text-xl mb-4">Map Section</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Title</label>
              <input type="text" value={content.map.title} onChange={(e) => setContent({ ...content, map: { ...content.map, title: e.target.value } })} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Subtitle</label>
              <input type="text" value={content.map.subtitle} onChange={(e) => setContent({ ...content, map: { ...content.map, subtitle: e.target.value } })} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Google Maps Embed URL</label>
            <input type="text" value={content.map.embedUrl} onChange={(e) => setContent({ ...content, map: { ...content.map, embedUrl: e.target.value } })} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Address Display</label>
            <input type="text" value={content.map.address} onChange={(e) => setContent({ ...content, map: { ...content.map, address: e.target.value } })} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Directions URL (Kakao/Naver Map)</label>
            <input type="text" value={content.map.directionsUrl} onChange={(e) => setContent({ ...content, map: { ...content.map, directionsUrl: e.target.value } })} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 bg-theme-inverse text-theme-inverse rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
            <Save size={18} />
            {saving ? 'Saving...' : 'Save All'}
          </button>
          <Link href="/admin/pages" className="px-6 py-3 border border-[var(--text)]/20 rounded-lg hover:bg-[var(--text)]/5 transition-colors">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
