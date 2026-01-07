'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import type { LivePageContent } from '@/types';

const defaultContent: LivePageContent = {
  hero: {
    tag: 'Live Commerce',
    label: 'Live High With',
    title: 'Instant Agency',
    subtitle: '틱톡, 인스타그램 라이브를 통한 실시간 커머스 솔루션.\n크리에이터와 브랜드를 연결하고, 새로운 가능성을 만들어갑니다.',
  },
  cta: {
    title: 'Start Your Live Journey',
    description: '라이브 커머스로 브랜드의 새로운 가능성을 발견하세요.',
    buttonText: 'Get Started',
  },
};

export default function EditLivePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<LivePageContent>(defaultContent);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/pages/live');
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
      const res = await fetch('/api/pages/live', {
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
          <h1 className="font-serif text-3xl">Edit Live Page</h1>
          <p className="text-[var(--text-muted)]">Live Commerce 페이지 콘텐츠 관리</p>
        </div>
      </div>

      <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4 mb-6">
        <p className="text-sm">
          <strong>참고:</strong> 라이브 비디오와 크리에이터 목록은 각각의 관리 메뉴에서 관리됩니다.
          여기서는 페이지의 Hero 섹션과 CTA 섹션만 편집할 수 있습니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hero Section */}
        <div className="border border-[var(--text)]/10 rounded-lg p-6 space-y-4">
          <h2 className="font-serif text-xl mb-4">Hero Section</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Tag</label>
              <input type="text" value={content.hero.tag} onChange={(e) => setContent({ ...content, hero: { ...content.hero, tag: e.target.value } })} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Label</label>
              <input type="text" value={content.hero.label} onChange={(e) => setContent({ ...content, hero: { ...content.hero, label: e.target.value } })} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Title</label>
            <input type="text" value={content.hero.title} onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Subtitle (use \n for line break)</label>
            <textarea value={content.hero.subtitle} onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })} rows={3} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg resize-none" />
          </div>
        </div>

        {/* CTA Section */}
        <div className="border border-[var(--text)]/10 rounded-lg p-6 space-y-4">
          <h2 className="font-serif text-xl mb-4">CTA Section</h2>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Title</label>
            <input type="text" value={content.cta.title} onChange={(e) => setContent({ ...content, cta: { ...content.cta, title: e.target.value } })} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Description</label>
            <textarea value={content.cta.description} onChange={(e) => setContent({ ...content, cta: { ...content.cta, description: e.target.value } })} rows={2} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg resize-none" />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Button Text</label>
            <input type="text" value={content.cta.buttonText} onChange={(e) => setContent({ ...content, cta: { ...content.cta, buttonText: e.target.value } })} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
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
