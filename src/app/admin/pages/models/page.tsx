'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import type { ModelsPageContent } from '@/types';

const defaultContent: ModelsPageContent = {
  hero: {
    tag: 'Model Agency',
    label: 'Discover Extraordinary',
    title: 'Talent',
    subtitle: '국내외 최고의 패션 모델들과 함께합니다',
  },
  cta: {
    title: 'Become a Model',
    description: 'Join our roster of talented models',
    buttonText: 'Apply Now',
  },
};

export default function EditModelsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<ModelsPageContent>(defaultContent);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/pages/models');
      const data = await res.json();
      if (data.success && data.data?.sections?.content) {
        setContent({ ...defaultContent, ...data.data.sections.content });
      }
    } catch (error) {
      console.error('Error fetching models page content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/pages/models', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: { content } }),
      });

      if (res.ok) {
        alert('Models 페이지가 저장되었습니다!');
      } else {
        alert('저장 실패');
      }
    } catch (error) {
      console.error('Error saving:', error);
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
          <h1 className="font-serif text-3xl">Edit Models Page</h1>
          <p className="text-[var(--text-muted)]">모델 페이지 콘텐츠 관리</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hero Section */}
        <div className="border border-[var(--text)]/10 rounded-lg p-6 space-y-4">
          <h2 className="font-serif text-xl mb-4">Hero Section</h2>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
              Tag
            </label>
            <input
              type="text"
              value={content.hero.tag}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, tag: e.target.value } })}
              className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
            />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
              Label
            </label>
            <input
              type="text"
              value={content.hero.label}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, label: e.target.value } })}
              className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
            />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
              Title
            </label>
            <input
              type="text"
              value={content.hero.title}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
              className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
            />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
              Subtitle
            </label>
            <textarea
              value={content.hero.subtitle}
              onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
              rows={2}
              className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)] resize-none"
            />
          </div>
        </div>

        {/* CTA Section */}
        <div className="border border-[var(--text)]/10 rounded-lg p-6 space-y-4">
          <h2 className="font-serif text-xl mb-4">CTA Section</h2>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
              Title
            </label>
            <input
              type="text"
              value={content.cta.title}
              onChange={(e) => setContent({ ...content, cta: { ...content.cta, title: e.target.value } })}
              className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
            />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
              Description
            </label>
            <textarea
              value={content.cta.description}
              onChange={(e) => setContent({ ...content, cta: { ...content.cta, description: e.target.value } })}
              rows={2}
              className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)] resize-none"
            />
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
              Button Text
            </label>
            <input
              type="text"
              value={content.cta.buttonText}
              onChange={(e) => setContent({ ...content, cta: { ...content.cta, buttonText: e.target.value } })}
              className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="p-4 bg-[var(--text)]/5 rounded-lg">
          <p className="text-sm text-[var(--text-muted)]">
            모델 목록은 <Link href="/admin/models" className="underline">Models 관리</Link> 메뉴에서 관리할 수 있습니다.
            Featured로 설정된 모델이 상단에 크게 표시됩니다.
          </p>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-theme-inverse text-theme-inverse rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <Link href="/admin/pages" className="px-6 py-3 border border-[var(--text)]/20 rounded-lg hover:bg-[var(--text)]/5 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
