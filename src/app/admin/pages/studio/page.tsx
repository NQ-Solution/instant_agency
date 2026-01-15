'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2, Upload, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { StudioPageContent } from '@/types';

const defaultContent: StudioPageContent = {
  hero: {
    tag: 'Photo Studio',
    label: 'Create Your Vision',
    title: 'Studio',
    subtitle: '프로페셔널 촬영을 위한 프리미엄 스튜디오 공간을 제공합니다',
  },
  info: {
    image: '',
    label: 'Studio Rental',
    title: '공간 대여 서비스',
    description: '화보, 광고, 프로필 촬영을 위한 전문 스튜디오 공간을 대여해 드립니다. 최신 장비와 편의시설을 갖춘 프리미엄 환경에서 완벽한 결과물을 만들어보세요.',
    features: [],
    linkText: '문의하기',
  },
  cta: {
    title: '스튜디오 예약',
    description: '촬영 일정과 요청사항을 알려주시면 맞춤 견적을 안내해 드립니다.',
    buttonText: 'Contact Us',
  },
  sectionVisibility: {
    hero: true,
    info: true,
    cta: true,
  },
};

export default function EditStudioPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [content, setContent] = useState<StudioPageContent>(defaultContent);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/pages/studio');
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
      const res = await fetch('/api/pages/studio', {
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
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'studio');
    try {
      console.log('Uploading file:', file.name, file.type, file.size);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      console.log('Response status:', res.status, res.statusText);

      const text = await res.text();
      console.log('Response text:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        alert(`서버 응답 파싱 실패: ${text.substring(0, 100)}`);
        return;
      }

      if (data.success) {
        callback(data.data.url);
        alert('이미지가 업로드되었습니다.');
      } else {
        alert(`업로드 실패: ${data.error || '알 수 없는 오류'}`);
        console.error('Upload failed:', data);
      }
    } catch (error) {
      alert('업로드 중 오류가 발생했습니다. 콘솔을 확인해주세요.');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
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
          <h1 className="font-serif text-3xl">Edit Studio Page</h1>
          <p className="text-[var(--text-muted)]">Studio 페이지 콘텐츠 관리</p>
        </div>
      </div>

      {/* Section Visibility Controls */}
      <div className="border border-[var(--text)]/10 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium mb-3">섹션 표시/숨김 설정</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { id: 'hero' as const, label: 'Hero' },
            { id: 'info' as const, label: 'Info' },
            { id: 'cta' as const, label: 'CTA' },
          ].map((section) => {
            const isVisible = content.sectionVisibility?.[section.id] !== false;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setContent({
                  ...content,
                  sectionVisibility: {
                    ...content.sectionVisibility,
                    [section.id]: !isVisible,
                  },
                })}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                  isVisible
                    ? 'border-green-500/30 bg-green-500/10 text-green-600'
                    : 'border-red-500/30 bg-red-500/10 text-red-500'
                }`}
              >
                {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                <span className="text-sm">{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hero Section */}
        <div className={`border border-[var(--text)]/10 rounded-lg p-6 space-y-4 ${content.sectionVisibility?.hero === false ? 'opacity-50' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl">Hero Section</h2>
            {content.sectionVisibility?.hero === false && <span className="text-xs text-red-500 bg-red-500/10 px-2 py-1 rounded">숨김</span>}
          </div>
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
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Subtitle</label>
            <textarea value={content.hero.subtitle} onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })} rows={2} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg resize-none" />
          </div>
        </div>

        {/* Info Section */}
        <div className={`border border-[var(--text)]/10 rounded-lg p-6 space-y-4 ${content.sectionVisibility?.info === false ? 'opacity-50' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl">Info Section</h2>
            {content.sectionVisibility?.info === false && <span className="text-xs text-red-500 bg-red-500/10 px-2 py-1 rounded">숨김</span>}
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Image</label>
            <div className="flex gap-2">
              <input type="text" value={content.info.image} onChange={(e) => setContent({ ...content, info: { ...content.info, image: e.target.value } })} className="flex-1 px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
              <label className={`px-4 py-3 border border-[var(--text)]/20 rounded-lg cursor-pointer hover:bg-[var(--text)]/5 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                {uploading ? <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" /> : <Upload size={16} />}
                <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, (url) => setContent({ ...content, info: { ...content.info, image: url } }));
                }} />
              </label>
            </div>
            {content.info.image && <div className="relative w-full h-48 mt-2 rounded-lg overflow-hidden"><Image src={content.info.image} alt="Studio" fill className="object-cover" /></div>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Label</label>
              <input type="text" value={content.info.label} onChange={(e) => setContent({ ...content, info: { ...content.info, label: e.target.value } })} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Title</label>
              <input type="text" value={content.info.title} onChange={(e) => setContent({ ...content, info: { ...content.info, title: e.target.value } })} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Description</label>
            <textarea value={content.info.description} onChange={(e) => setContent({ ...content, info: { ...content.info, description: e.target.value } })} rows={3} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg resize-none" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs tracking-wider uppercase text-[var(--text-muted)]">Features</label>
              <button type="button" onClick={() => setContent({ ...content, info: { ...content.info, features: [...content.info.features, ''] } })} className="flex items-center gap-1 px-2 py-1 text-xs border border-[var(--text)]/20 rounded hover:bg-[var(--text)]/5">
                <Plus size={14} /> Add
              </button>
            </div>
            {content.info.features.map((f, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input type="text" value={f} onChange={(e) => {
                  const features = [...content.info.features];
                  features[i] = e.target.value;
                  setContent({ ...content, info: { ...content.info, features } });
                }} className="flex-1 px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm" />
                <button type="button" onClick={() => setContent({ ...content, info: { ...content.info, features: content.info.features.filter((_, idx) => idx !== i) } })} className="p-2 text-red-500 hover:bg-red-500/10 rounded">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Link Text</label>
            <input type="text" value={content.info.linkText} onChange={(e) => setContent({ ...content, info: { ...content.info, linkText: e.target.value } })} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
          </div>
        </div>

        {/* CTA Section */}
        <div className={`border border-[var(--text)]/10 rounded-lg p-6 space-y-4 ${content.sectionVisibility?.cta === false ? 'opacity-50' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl">CTA Section</h2>
            {content.sectionVisibility?.cta === false && <span className="text-xs text-red-500 bg-red-500/10 px-2 py-1 rounded">숨김</span>}
          </div>
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
