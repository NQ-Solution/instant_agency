'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2, Upload } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { AboutPageContent } from '@/types';

const defaultContent: AboutPageContent = {
  hero: {
    label: 'Our Story',
    title: 'About',
    subtitle: '스튜디오, 모델 에이전시, 라이브 커머스를 아우르는 종합 크리에이티브 그룹',
  },
  story: {
    image: '',
    title: 'Beyond the\nOrdinary',
    paragraphs: [],
  },
  values: {
    title: 'Our Values',
    items: [],
  },
  timeline: {
    title: 'Our Journey',
    subtitle: 'Milestones',
    items: [],
  },
  cta: {
    title: 'Work With Us',
    buttonText: 'Get in Touch',
  },
};

export default function EditAboutPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<AboutPageContent>(defaultContent);
  const [activeTab, setActiveTab] = useState<'hero' | 'story' | 'values' | 'timeline' | 'cta'>('hero');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/pages/about');
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
      const res = await fetch('/api/pages/about', {
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

  const handleImageUpload = async (file: File, callback: (url: string) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'about');
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) callback(data.data.url);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--text)]"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'hero' as const, label: 'Hero' },
    { id: 'story' as const, label: 'Story' },
    { id: 'values' as const, label: 'Values' },
    { id: 'timeline' as const, label: 'Timeline' },
    { id: 'cta' as const, label: 'CTA' },
  ];

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/pages" className="p-2 hover:bg-[var(--text)]/10 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-serif text-3xl">Edit About Page</h1>
          <p className="text-[var(--text-muted)]">About 페이지 콘텐츠 관리</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm whitespace-nowrap rounded-lg transition-colors ${
              activeTab === tab.id ? 'bg-theme-inverse text-theme-inverse' : 'border border-[var(--text)]/20 hover:bg-[var(--text)]/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {activeTab === 'hero' && (
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
        )}

        {activeTab === 'story' && (
          <div className="border border-[var(--text)]/10 rounded-lg p-6 space-y-4">
            <h2 className="font-serif text-xl mb-4">Story Section</h2>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Title (use \n for line break)</label>
              <input type="text" value={content.story.title} onChange={(e) => setContent({ ...content, story: { ...content.story, title: e.target.value } })} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Image</label>
              <div className="flex gap-2">
                <input type="text" value={content.story.image} onChange={(e) => setContent({ ...content, story: { ...content.story, image: e.target.value } })} className="flex-1 px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
                <label className="px-4 py-3 border border-[var(--text)]/20 rounded-lg cursor-pointer hover:bg-[var(--text)]/5">
                  <Upload size={16} />
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, (url) => setContent({ ...content, story: { ...content.story, image: url } }));
                  }} />
                </label>
              </div>
              {content.story.image && <div className="relative w-full h-48 mt-2 rounded-lg overflow-hidden"><Image src={content.story.image} alt="Story" fill className="object-cover" /></div>}
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs tracking-wider uppercase text-[var(--text-muted)]">Paragraphs</label>
                <button type="button" onClick={() => setContent({ ...content, story: { ...content.story, paragraphs: [...content.story.paragraphs, ''] } })} className="flex items-center gap-1 px-2 py-1 text-xs border border-[var(--text)]/20 rounded hover:bg-[var(--text)]/5">
                  <Plus size={14} /> Add
                </button>
              </div>
              {content.story.paragraphs.map((p, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <textarea value={p} onChange={(e) => {
                    const paragraphs = [...content.story.paragraphs];
                    paragraphs[i] = e.target.value;
                    setContent({ ...content, story: { ...content.story, paragraphs } });
                  }} rows={3} className="flex-1 px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm resize-none" />
                  <button type="button" onClick={() => setContent({ ...content, story: { ...content.story, paragraphs: content.story.paragraphs.filter((_, idx) => idx !== i) } })} className="p-2 text-red-500 hover:bg-red-500/10 rounded">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'values' && (
          <div className="border border-[var(--text)]/10 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl">Values Section</h2>
              <button type="button" onClick={() => setContent({ ...content, values: { ...content.values, items: [...content.values.items, { icon: '◇', title: '', desc: '' }] } })} className="flex items-center gap-2 px-3 py-2 text-sm border border-[var(--text)]/20 rounded-lg hover:bg-[var(--text)]/5">
                <Plus size={16} /> Add Value
              </button>
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Section Title</label>
              <input type="text" value={content.values.title} onChange={(e) => setContent({ ...content, values: { ...content.values, title: e.target.value } })} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
            </div>
            {content.values.items.map((item, i) => (
              <div key={i} className="border border-[var(--text)]/10 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-muted)]">Value {i + 1}</span>
                  <button type="button" onClick={() => setContent({ ...content, values: { ...content.values, items: content.values.items.filter((_, idx) => idx !== i) } })} className="p-1 text-red-500 hover:bg-red-500/10 rounded"><Trash2 size={14} /></button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <input type="text" value={item.icon} onChange={(e) => {
                    const items = [...content.values.items];
                    items[i] = { ...items[i], icon: e.target.value };
                    setContent({ ...content, values: { ...content.values, items } });
                  }} placeholder="Icon" className="px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm" />
                  <input type="text" value={item.title} onChange={(e) => {
                    const items = [...content.values.items];
                    items[i] = { ...items[i], title: e.target.value };
                    setContent({ ...content, values: { ...content.values, items } });
                  }} placeholder="Title" className="col-span-2 px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm" />
                </div>
                <textarea value={item.desc} onChange={(e) => {
                  const items = [...content.values.items];
                  items[i] = { ...items[i], desc: e.target.value };
                  setContent({ ...content, values: { ...content.values, items } });
                }} placeholder="Description" rows={2} className="w-full px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm resize-none" />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="border border-[var(--text)]/10 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl">Timeline Section</h2>
              <button type="button" onClick={() => setContent({ ...content, timeline: { ...content.timeline, items: [...content.timeline.items, { year: '', title: '', desc: '' }] } })} className="flex items-center gap-2 px-3 py-2 text-sm border border-[var(--text)]/20 rounded-lg hover:bg-[var(--text)]/5">
                <Plus size={16} /> Add Milestone
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Subtitle</label>
                <input type="text" value={content.timeline.subtitle} onChange={(e) => setContent({ ...content, timeline: { ...content.timeline, subtitle: e.target.value } })} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
              </div>
              <div>
                <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Title</label>
                <input type="text" value={content.timeline.title} onChange={(e) => setContent({ ...content, timeline: { ...content.timeline, title: e.target.value } })} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
              </div>
            </div>
            {content.timeline.items.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <input type="text" value={item.year} onChange={(e) => {
                  const items = [...content.timeline.items];
                  items[i] = { ...items[i], year: e.target.value };
                  setContent({ ...content, timeline: { ...content.timeline, items } });
                }} placeholder="Year" className="w-20 px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm" />
                <input type="text" value={item.title} onChange={(e) => {
                  const items = [...content.timeline.items];
                  items[i] = { ...items[i], title: e.target.value };
                  setContent({ ...content, timeline: { ...content.timeline, items } });
                }} placeholder="Title" className="flex-1 px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm" />
                <input type="text" value={item.desc} onChange={(e) => {
                  const items = [...content.timeline.items];
                  items[i] = { ...items[i], desc: e.target.value };
                  setContent({ ...content, timeline: { ...content.timeline, items } });
                }} placeholder="Description" className="flex-1 px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm" />
                <button type="button" onClick={() => setContent({ ...content, timeline: { ...content.timeline, items: content.timeline.items.filter((_, idx) => idx !== i) } })} className="p-2 text-red-500 hover:bg-red-500/10 rounded"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'cta' && (
          <div className="border border-[var(--text)]/10 rounded-lg p-6 space-y-4">
            <h2 className="font-serif text-xl mb-4">CTA Section</h2>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Title</label>
              <input type="text" value={content.cta.title} onChange={(e) => setContent({ ...content, cta: { ...content.cta, title: e.target.value } })} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Button Text</label>
              <input type="text" value={content.cta.buttonText} onChange={(e) => setContent({ ...content, cta: { ...content.cta, buttonText: e.target.value } })} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
            </div>
          </div>
        )}

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
