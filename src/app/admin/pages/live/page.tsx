'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2, Upload, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { LivePageContent, LiveServiceItem, LiveShowcaseItem, LiveStatItem } from '@/types';

const defaultContent: LivePageContent = {
  hero: {
    tag: 'Live Commerce',
    label: 'Live High With',
    title: 'Instant Agency',
    subtitle: '틱톡, 인스타그램 라이브를 통한 실시간 커머스 솔루션.\n크리에이터와 브랜드를 연결하고, 새로운 가능성을 만들어갑니다.',
  },
  services: [
    { num: '01', title: 'Live Management', desc: '크리에이터의 라이브 방송 스케줄링부터 실시간 운영까지 전문적으로 관리합니다.', features: ['스케줄 관리', '실시간 모니터링', '위기 대응'] },
    { num: '02', title: 'Content Monetization', desc: '다양한 수익화 채널을 통해 크리에이터의 수익을 극대화합니다.', features: ['브랜드 협찬', '커머스 연동', '후원 시스템'] },
    { num: '03', title: 'Production Support', desc: '고품질 콘텐츠 제작을 위한 스튜디오와 장비를 지원합니다.', features: ['전문 스튜디오', '촬영 장비', '편집 지원'] },
    { num: '04', title: 'Data Consulting', desc: '데이터 기반의 인사이트로 성장 전략을 제시합니다.', features: ['성과 분석', '트렌드 리포트', '성장 전략'] },
  ],
  showcase: [
    {
      label: 'To Brands',
      title: 'Live Entertainment',
      desc: '실시간으로 소통하며 브랜드의 이야기를 전달합니다.',
      features: ['실시간 Q&A 및 소통', '인플루언서 콜라보레이션', '바이럴 콘텐츠 제작'],
      image: '',
    },
    {
      label: 'To Brands',
      title: 'Live Commerce Solution',
      desc: '기획부터 방송, 결제까지 원스톱 라이브 커머스 솔루션을 제공합니다.',
      features: ['전문 쇼호스트 매칭', '결제 시스템 연동', '실시간 데이터 대시보드'],
      image: '',
    },
  ],
  stats: [
    { value: '100+', label: 'Creators' },
    { value: '500M+', label: 'Total Views' },
    { value: '8.5%', label: 'Avg. Conversion' },
    { value: '200+', label: 'Brand Partners' },
  ],
  cta: {
    title: 'Start Your Live Journey',
    description: '라이브 커머스로 브랜드의 새로운 가능성을 발견하세요.',
    buttonText: 'Get Started',
  },
  sectionVisibility: {
    hero: true,
    videos: true,
    services: true,
    showcase: true,
    creators: true,
    stats: true,
    cta: true,
  },
};

export default function EditLivePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<LivePageContent>(defaultContent);
  const [activeTab, setActiveTab] = useState<'visibility' | 'hero' | 'services' | 'showcase' | 'stats' | 'cta'>('visibility');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/pages/live');
      const data = await res.json();
      if (data.success && data.data?.sections?.content) {
        const saved = data.data.sections.content;
        setContent({
          hero: { ...defaultContent.hero, ...saved.hero },
          services: saved.services?.length ? saved.services : defaultContent.services,
          showcase: saved.showcase?.length ? saved.showcase : defaultContent.showcase,
          stats: saved.stats?.length ? saved.stats : defaultContent.stats,
          cta: { ...defaultContent.cta, ...saved.cta },
          sectionVisibility: { ...defaultContent.sectionVisibility, ...saved.sectionVisibility },
        });
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

  const handleImageUpload = async (file: File, callback: (url: string) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'live');
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success) callback(data.data.url);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const toggleSection = (section: keyof NonNullable<LivePageContent['sectionVisibility']>) => {
    setContent({
      ...content,
      sectionVisibility: {
        ...content.sectionVisibility,
        [section]: !content.sectionVisibility?.[section],
      },
    });
  };

  const addService = () => {
    const num = String(content.services.length + 1).padStart(2, '0');
    setContent({
      ...content,
      services: [...content.services, { num, title: '', desc: '', features: [] }],
    });
  };

  const updateService = (index: number, field: keyof LiveServiceItem, value: string | string[]) => {
    const services = [...content.services];
    services[index] = { ...services[index], [field]: value };
    setContent({ ...content, services });
  };

  const removeService = (index: number) => {
    setContent({ ...content, services: content.services.filter((_, i) => i !== index) });
  };

  const addShowcase = () => {
    setContent({
      ...content,
      showcase: [...content.showcase, { label: '', title: '', desc: '', features: [], image: '' }],
    });
  };

  const updateShowcase = (index: number, field: keyof LiveShowcaseItem, value: string | string[]) => {
    const showcase = [...content.showcase];
    showcase[index] = { ...showcase[index], [field]: value };
    setContent({ ...content, showcase });
  };

  const removeShowcase = (index: number) => {
    setContent({ ...content, showcase: content.showcase.filter((_, i) => i !== index) });
  };

  const addStat = () => {
    setContent({
      ...content,
      stats: [...content.stats, { value: '', label: '' }],
    });
  };

  const updateStat = (index: number, field: keyof LiveStatItem, value: string) => {
    const stats = [...content.stats];
    stats[index] = { ...stats[index], [field]: value };
    setContent({ ...content, stats });
  };

  const removeStat = (index: number) => {
    setContent({ ...content, stats: content.stats.filter((_, i) => i !== index) });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--text)]"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'visibility' as const, label: '섹션 표시' },
    { id: 'hero' as const, label: 'Hero' },
    { id: 'services' as const, label: 'Services' },
    { id: 'showcase' as const, label: 'Showcase' },
    { id: 'stats' as const, label: 'Stats' },
    { id: 'cta' as const, label: 'CTA' },
  ];

  const sectionLabels = {
    hero: 'Hero 섹션',
    videos: '라이브 비디오',
    services: '서비스 소개',
    showcase: '쇼케이스',
    creators: '크리에이터',
    stats: '통계',
    cta: 'CTA 섹션',
  };

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
        </p>
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
        {/* Section Visibility */}
        {activeTab === 'visibility' && (
          <div className="border border-[var(--text)]/10 rounded-lg p-6">
            <h2 className="font-serif text-xl mb-4">섹션 표시 설정</h2>
            <p className="text-sm text-[var(--text-muted)] mb-4">각 섹션의 표시/숨김을 설정합니다.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(sectionLabels).map(([key, label]) => {
                const isVisible = content.sectionVisibility?.[key as keyof typeof content.sectionVisibility] !== false;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleSection(key as keyof NonNullable<LivePageContent['sectionVisibility']>)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      isVisible ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'
                    }`}
                  >
                    <span className="text-sm">{label}</span>
                    {isVisible ? <Eye size={18} className="text-green-500" /> : <EyeOff size={18} className="text-red-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Hero Section */}
        {activeTab === 'hero' && (
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
        )}

        {/* Services Section */}
        {activeTab === 'services' && (
          <div className="border border-[var(--text)]/10 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl">Services</h2>
              <button type="button" onClick={addService} className="flex items-center gap-2 px-3 py-2 text-sm border border-[var(--text)]/20 rounded-lg hover:bg-[var(--text)]/5">
                <Plus size={16} /> Add Service
              </button>
            </div>
            {content.services.map((service, i) => (
              <div key={i} className="border border-[var(--text)]/10 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-muted)]">Service {i + 1}</span>
                  <button type="button" onClick={() => removeService(i)} className="p-1 text-red-500 hover:bg-red-500/10 rounded"><Trash2 size={14} /></button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <input type="text" value={service.num} onChange={(e) => updateService(i, 'num', e.target.value)} placeholder="번호" className="px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm" />
                  <input type="text" value={service.title} onChange={(e) => updateService(i, 'title', e.target.value)} placeholder="제목" className="col-span-3 px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm" />
                </div>
                <textarea value={service.desc} onChange={(e) => updateService(i, 'desc', e.target.value)} placeholder="설명" rows={2} className="w-full px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm resize-none" />
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">Features (쉼표로 구분)</label>
                  <input type="text" value={service.features.join(', ')} onChange={(e) => updateService(i, 'features', e.target.value.split(',').map(f => f.trim()).filter(f => f))} placeholder="기능1, 기능2, 기능3" className="w-full px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Showcase Section */}
        {activeTab === 'showcase' && (
          <div className="border border-[var(--text)]/10 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl">Showcase</h2>
              <button type="button" onClick={addShowcase} className="flex items-center gap-2 px-3 py-2 text-sm border border-[var(--text)]/20 rounded-lg hover:bg-[var(--text)]/5">
                <Plus size={16} /> Add Showcase
              </button>
            </div>
            {content.showcase.map((item, i) => (
              <div key={i} className="border border-[var(--text)]/10 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-muted)]">Showcase {i + 1}</span>
                  <button type="button" onClick={() => removeShowcase(i)} className="p-1 text-red-500 hover:bg-red-500/10 rounded"><Trash2 size={14} /></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" value={item.label} onChange={(e) => updateShowcase(i, 'label', e.target.value)} placeholder="Label" className="px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm" />
                  <input type="text" value={item.title} onChange={(e) => updateShowcase(i, 'title', e.target.value)} placeholder="Title" className="px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm" />
                </div>
                <textarea value={item.desc} onChange={(e) => updateShowcase(i, 'desc', e.target.value)} placeholder="Description" rows={2} className="w-full px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm resize-none" />
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">Features (쉼표로 구분)</label>
                  <input type="text" value={item.features.join(', ')} onChange={(e) => updateShowcase(i, 'features', e.target.value.split(',').map(f => f.trim()).filter(f => f))} placeholder="기능1, 기능2, 기능3" className="w-full px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">Image</label>
                  <div className="flex gap-2">
                    <input type="text" value={item.image} onChange={(e) => updateShowcase(i, 'image', e.target.value)} placeholder="Image URL" className="flex-1 px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm" />
                    <label className="px-3 py-2 border border-[var(--text)]/20 rounded-lg cursor-pointer hover:bg-[var(--text)]/5">
                      <Upload size={16} />
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, (url) => updateShowcase(i, 'image', url));
                      }} />
                    </label>
                  </div>
                  {item.image && <div className="relative w-full h-32 mt-2 rounded-lg overflow-hidden"><Image src={item.image} alt="Showcase" fill className="object-cover" /></div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Section */}
        {activeTab === 'stats' && (
          <div className="border border-[var(--text)]/10 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl">Statistics</h2>
              <button type="button" onClick={addStat} className="flex items-center gap-2 px-3 py-2 text-sm border border-[var(--text)]/20 rounded-lg hover:bg-[var(--text)]/5">
                <Plus size={16} /> Add Stat
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {content.stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="text" value={stat.value} onChange={(e) => updateStat(i, 'value', e.target.value)} placeholder="값 (예: 100+)" className="w-24 px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm" />
                  <input type="text" value={stat.label} onChange={(e) => updateStat(i, 'label', e.target.value)} placeholder="라벨" className="flex-1 px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm" />
                  <button type="button" onClick={() => removeStat(i)} className="p-2 text-red-500 hover:bg-red-500/10 rounded"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        {activeTab === 'cta' && (
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
