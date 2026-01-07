'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2, Upload, Star, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { HomePageContent, DivisionItem, StatItem, Model } from '@/types';

const defaultContent: HomePageContent = {
  hero: {
    title: 'Instant Agency',
    subtitle: 'Creative Studio & Management',
    scrollText: 'Scroll',
  },
  divisions: {
    sectionNumber: '01',
    title: 'What We Do',
    items: [
      {
        id: 'studio',
        number: '01',
        title: 'Photo Studio',
        desc: '전문 촬영 장비와 공간을 갖춘 프리미엄 스튜디오. 화보, 광고, 프로필 촬영까지.',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
        href: '/studio',
      },
      {
        id: 'models',
        number: '02',
        title: 'Model Agency',
        desc: '독보적인 재능을 가진 모델 발굴과 체계적인 매니지먼트 서비스.',
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800',
        href: '/models',
      },
      {
        id: 'live',
        number: '03',
        title: 'Live Commerce',
        desc: '틱톡, 인스타 라이브 등 실시간 스트리밍 콘텐츠 제작 및 커머스 솔루션.',
        image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800',
        href: '/live',
      },
    ],
  },
  talents: {
    sectionNumber: '02',
    title: 'Our Talents',
    buttonText: 'View All Models',
  },
  stats: [
    { value: '150+', label: 'Elite Models' },
    { value: '50+', label: 'Countries' },
    { value: '1K+', label: 'Campaigns' },
    { value: '14', label: 'Years' },
  ],
  about: {
    sectionNumber: '04',
    title: 'Creative\nBeyond Limits',
    description: 'Instant Agency는 스튜디오, 모델 에이전시, 라이브 커머스를 아우르는 종합 크리에이티브 그룹입니다.\n각 분야의 전문성을 바탕으로 브랜드와 크리에이터에게 최상의 솔루션을 제공합니다.\n\n프리미엄 촬영 공간부터 모델 매니지먼트, 실시간 라이브 콘텐츠 제작까지,\nInstant Agency와 함께라면 모든 크리에이티브 니즈를 한 곳에서 해결할 수 있습니다.',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800',
    stats: [
      { value: '150+', label: 'Models Worldwide' },
      { value: '14', label: 'Years Experience' },
      { value: '500+', label: 'Brand Partners' },
    ],
  },
  cta: {
    sectionNumber: '06',
    title: "Let's Create",
    email: 'hello@instantagency.com',
    socialLinks: [
      { label: 'Instagram', href: '#' },
      { label: 'LinkedIn', href: '#' },
      { label: 'Twitter', href: '#' },
    ],
    offices: [
      { title: 'Seoul Office', address: 'Gangnam-gu, Seoul' },
      { title: 'Paris Office', address: 'Le Marais, Paris' },
      { title: 'NYC Office', address: 'SoHo, New York' },
    ],
  },
};

export default function EditHomePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<HomePageContent>(defaultContent);
  const [activeTab, setActiveTab] = useState<'hero' | 'divisions' | 'talents' | 'stats' | 'about' | 'cta'>('hero');
  const [models, setModels] = useState<Model[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);

  useEffect(() => {
    fetchContent();
    fetchModels();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/pages/home');
      const data = await res.json();
      if (data.success && data.data?.sections) {
        const sections = data.data.sections;
        if (sections.content) {
          setContent({ ...defaultContent, ...sections.content });
        }
      }
    } catch (error) {
      console.error('Error fetching home content:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchModels = async () => {
    try {
      const res = await fetch('/api/models?includeInactive=true');
      const data = await res.json();
      if (data.success) {
        setModels(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  const toggleFeatured = async (modelId: string, currentFeatured: boolean) => {
    setModelsLoading(true);
    try {
      const res = await fetch(`/api/models/${modelId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentFeatured }),
      });
      if (res.ok) {
        setModels(models.map(m =>
          m.id === modelId ? { ...m, featured: !currentFeatured } : m
        ));
      }
    } catch (error) {
      console.error('Error updating model:', error);
    } finally {
      setModelsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/pages/home', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: { content } }),
      });

      if (res.ok) {
        alert('홈페이지가 저장되었습니다!');
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

  const handleImageUpload = async (
    file: File,
    callback: (url: string) => void
  ) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'home');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        callback(data.data.url);
      }
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const updateDivision = (index: number, field: keyof DivisionItem, value: string) => {
    const items = [...content.divisions.items];
    items[index] = { ...items[index], [field]: value };
    setContent({ ...content, divisions: { ...content.divisions, items } });
  };

  const addDivision = () => {
    const newItem: DivisionItem = {
      id: `division-${Date.now()}`,
      number: String(content.divisions.items.length + 1).padStart(2, '0'),
      title: '',
      desc: '',
      image: '',
      href: '/',
    };
    setContent({
      ...content,
      divisions: { ...content.divisions, items: [...content.divisions.items, newItem] },
    });
  };

  const removeDivision = (index: number) => {
    const items = content.divisions.items.filter((_, i) => i !== index);
    setContent({ ...content, divisions: { ...content.divisions, items } });
  };

  const updateStat = (index: number, field: keyof StatItem, value: string) => {
    const stats = [...content.stats];
    stats[index] = { ...stats[index], [field]: value };
    setContent({ ...content, stats });
  };

  const addStat = () => {
    setContent({ ...content, stats: [...content.stats, { value: '', label: '' }] });
  };

  const removeStat = (index: number) => {
    setContent({ ...content, stats: content.stats.filter((_, i) => i !== index) });
  };

  const updateAboutStat = (index: number, field: keyof StatItem, value: string) => {
    const stats = [...content.about.stats];
    stats[index] = { ...stats[index], [field]: value };
    setContent({ ...content, about: { ...content.about, stats } });
  };

  const addAboutStat = () => {
    setContent({
      ...content,
      about: { ...content.about, stats: [...content.about.stats, { value: '', label: '' }] },
    });
  };

  const removeAboutStat = (index: number) => {
    setContent({
      ...content,
      about: { ...content.about, stats: content.about.stats.filter((_, i) => i !== index) },
    });
  };

  const updateSocialLink = (index: number, field: 'label' | 'href', value: string) => {
    const socialLinks = [...content.cta.socialLinks];
    socialLinks[index] = { ...socialLinks[index], [field]: value };
    setContent({ ...content, cta: { ...content.cta, socialLinks } });
  };

  const addSocialLink = () => {
    setContent({
      ...content,
      cta: { ...content.cta, socialLinks: [...content.cta.socialLinks, { label: '', href: '#' }] },
    });
  };

  const removeSocialLink = (index: number) => {
    setContent({
      ...content,
      cta: { ...content.cta, socialLinks: content.cta.socialLinks.filter((_, i) => i !== index) },
    });
  };

  const updateOffice = (index: number, field: 'title' | 'address', value: string) => {
    const offices = [...content.cta.offices];
    offices[index] = { ...offices[index], [field]: value };
    setContent({ ...content, cta: { ...content.cta, offices } });
  };

  const addOffice = () => {
    setContent({
      ...content,
      cta: { ...content.cta, offices: [...content.cta.offices, { title: '', address: '' }] },
    });
  };

  const removeOffice = (index: number) => {
    setContent({
      ...content,
      cta: { ...content.cta, offices: content.cta.offices.filter((_, i) => i !== index) },
    });
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
    { id: 'divisions' as const, label: 'What We Do' },
    { id: 'talents' as const, label: 'Our Talents' },
    { id: 'stats' as const, label: 'Stats' },
    { id: 'about' as const, label: 'About' },
    { id: 'cta' as const, label: 'CTA' },
  ];

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/pages" className="p-2 hover:bg-[var(--text)]/10 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-serif text-3xl">Edit Home Page</h1>
          <p className="text-[var(--text-muted)]">홈페이지 전체 콘텐츠 관리</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm whitespace-nowrap rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-theme-inverse text-theme-inverse'
                : 'border border-[var(--text)]/20 hover:bg-[var(--text)]/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hero Section */}
        {activeTab === 'hero' && (
          <div className="border border-[var(--text)]/10 rounded-lg p-6 space-y-4">
            <h2 className="font-serif text-xl mb-4">Hero Section</h2>
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
              <input
                type="text"
                value={content.hero.subtitle}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Scroll Text
              </label>
              <input
                type="text"
                value={content.hero.scrollText}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, scrollText: e.target.value } })}
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
          </div>
        )}

        {/* Divisions Section */}
        {activeTab === 'divisions' && (
          <div className="border border-[var(--text)]/10 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl">What We Do Section</h2>
              <button type="button" onClick={addDivision} className="flex items-center gap-2 px-3 py-2 text-sm border border-[var(--text)]/20 rounded-lg hover:bg-[var(--text)]/5">
                <Plus size={16} /> Add Item
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Section Number</label>
                <input
                  type="text"
                  value={content.divisions.sectionNumber}
                  onChange={(e) => setContent({ ...content, divisions: { ...content.divisions, sectionNumber: e.target.value } })}
                  className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
                />
              </div>
              <div>
                <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Section Title</label>
                <input
                  type="text"
                  value={content.divisions.title}
                  onChange={(e) => setContent({ ...content, divisions: { ...content.divisions, title: e.target.value } })}
                  className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
                />
              </div>
            </div>
            {content.divisions.items.map((item, index) => (
              <div key={item.id} className="border border-[var(--text)]/10 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--text-muted)] uppercase">Item {index + 1}</span>
                  <button type="button" onClick={() => removeDivision(index)} className="p-1 text-red-500 hover:bg-red-500/10 rounded">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">Number</label>
                    <input type="text" value={item.number} onChange={(e) => updateDivision(index, 'number', e.target.value)} className="w-full px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">Title</label>
                    <input type="text" value={item.title} onChange={(e) => updateDivision(index, 'title', e.target.value)} className="w-full px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1">Description</label>
                  <textarea value={item.desc} onChange={(e) => updateDivision(index, 'desc', e.target.value)} rows={2} className="w-full px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">Link</label>
                    <input type="text" value={item.href} onChange={(e) => updateDivision(index, 'href', e.target.value)} className="w-full px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-muted)] mb-1">Image URL</label>
                    <div className="flex gap-2">
                      <input type="text" value={item.image} onChange={(e) => updateDivision(index, 'image', e.target.value)} className="flex-1 px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm" />
                      <label className="px-3 py-2 border border-[var(--text)]/20 rounded-lg cursor-pointer hover:bg-[var(--text)]/5">
                        <Upload size={16} />
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, (url) => updateDivision(index, 'image', url));
                        }} />
                      </label>
                    </div>
                  </div>
                </div>
                {item.image && (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Talents Section */}
        {activeTab === 'talents' && (
          <div className="space-y-6">
            {/* Section Settings */}
            <div className="border border-[var(--text)]/10 rounded-lg p-6 space-y-4">
              <h2 className="font-serif text-xl mb-4">Our Talents Section</h2>
              <div>
                <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Section Number</label>
                <input
                  type="text"
                  value={content.talents.sectionNumber}
                  onChange={(e) => setContent({ ...content, talents: { ...content.talents, sectionNumber: e.target.value } })}
                  className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
                />
              </div>
              <div>
                <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Section Title</label>
                <input
                  type="text"
                  value={content.talents.title}
                  onChange={(e) => setContent({ ...content, talents: { ...content.talents, title: e.target.value } })}
                  className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
                />
              </div>
              <div>
                <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Button Text</label>
                <input
                  type="text"
                  value={content.talents.buttonText}
                  onChange={(e) => setContent({ ...content, talents: { ...content.talents, buttonText: e.target.value } })}
                  className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
                />
              </div>
            </div>

            {/* Featured Models Selection */}
            <div className="border border-[var(--text)]/10 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-lg">Featured Models</h3>
                  <p className="text-sm text-[var(--text-muted)]">
                    홈페이지에 표시할 모델을 선택하세요 (최대 8개)
                  </p>
                </div>
                <Link
                  href="/admin/models"
                  className="flex items-center gap-2 px-3 py-2 text-sm border border-[var(--text)]/20 rounded-lg hover:bg-[var(--text)]/5"
                >
                  <ExternalLink size={14} />
                  모델 관리
                </Link>
              </div>

              {/* Featured Count */}
              <div className="flex items-center gap-4 mb-4 p-3 bg-[var(--text)]/5 rounded-lg">
                <Star className="text-yellow-500" size={18} />
                <span className="text-sm">
                  현재 Featured: <strong>{models.filter(m => m.featured && m.active).length}</strong>개 / 8개
                </span>
              </div>

              {/* Models Grid */}
              {models.length === 0 ? (
                <div className="text-center py-12 text-[var(--text-muted)]">
                  <p>등록된 모델이 없습니다.</p>
                  <Link href="/admin/models/new" className="text-sm underline mt-2 inline-block">
                    새 모델 추가하기
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {models
                    .filter(m => m.active)
                    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
                    .map((model) => (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => toggleFeatured(model.id, model.featured)}
                        disabled={modelsLoading || (!model.featured && models.filter(m => m.featured && m.active).length >= 8)}
                        className={`relative aspect-[3/4] rounded-lg overflow-hidden group transition-all ${
                          model.featured
                            ? 'ring-2 ring-yellow-500'
                            : 'opacity-60 hover:opacity-100'
                        } ${modelsLoading ? 'pointer-events-none' : ''}`}
                      >
                        {model.profileImage ? (
                          <Image
                            src={model.profileImage}
                            alt={model.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-[var(--text)]/10" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
                          <p className="text-sm font-medium truncate">{model.name}</p>
                          <p className="text-xs opacity-70">{model.category}</p>
                        </div>
                        {model.featured && (
                          <div className="absolute top-2 right-2 bg-yellow-500 text-black p-1 rounded-full">
                            <Star size={12} fill="currentColor" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs">
                            {model.featured ? 'Featured 해제' : 'Featured 설정'}
                          </span>
                        </div>
                      </button>
                    ))}
                </div>
              )}

              {/* Inactive Models Notice */}
              {models.filter(m => !m.active).length > 0 && (
                <p className="text-xs text-[var(--text-muted)] mt-4">
                  * 비활성 모델 {models.filter(m => !m.active).length}개는 목록에서 제외됩니다.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Stats Section */}
        {activeTab === 'stats' && (
          <div className="border border-[var(--text)]/10 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl">Stats Section</h2>
              <button type="button" onClick={addStat} className="flex items-center gap-2 px-3 py-2 text-sm border border-[var(--text)]/20 rounded-lg hover:bg-[var(--text)]/5">
                <Plus size={16} /> Add Stat
              </button>
            </div>
            {content.stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3">
                <input type="text" value={stat.value} onChange={(e) => updateStat(index, 'value', e.target.value)} placeholder="Value (e.g., 150+)" className="flex-1 px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
                <input type="text" value={stat.label} onChange={(e) => updateStat(index, 'label', e.target.value)} placeholder="Label" className="flex-1 px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
                <button type="button" onClick={() => removeStat(index)} className="p-2 text-red-500 hover:bg-red-500/10 rounded">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* About Section */}
        {activeTab === 'about' && (
          <div className="border border-[var(--text)]/10 rounded-lg p-6 space-y-4">
            <h2 className="font-serif text-xl mb-4">About Preview Section</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Section Number</label>
                <input type="text" value={content.about.sectionNumber} onChange={(e) => setContent({ ...content, about: { ...content.about, sectionNumber: e.target.value } })} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
              </div>
              <div>
                <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Title (use \n for line break)</label>
                <input type="text" value={content.about.title} onChange={(e) => setContent({ ...content, about: { ...content.about, title: e.target.value } })} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
              </div>
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Description</label>
              <textarea value={content.about.description} onChange={(e) => setContent({ ...content, about: { ...content.about, description: e.target.value } })} rows={5} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg resize-none" />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Image</label>
              <div className="flex gap-2">
                <input type="text" value={content.about.image} onChange={(e) => setContent({ ...content, about: { ...content.about, image: e.target.value } })} className="flex-1 px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
                <label className="px-4 py-3 border border-[var(--text)]/20 rounded-lg cursor-pointer hover:bg-[var(--text)]/5">
                  <Upload size={16} />
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, (url) => setContent({ ...content, about: { ...content.about, image: url } }));
                  }} />
                </label>
              </div>
              {content.about.image && (
                <div className="relative w-full h-48 mt-2 rounded-lg overflow-hidden">
                  <Image src={content.about.image} alt="About" fill className="object-cover" />
                </div>
              )}
            </div>
            <div className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs tracking-wider uppercase text-[var(--text-muted)]">Stats Box</label>
                <button type="button" onClick={addAboutStat} className="flex items-center gap-1 px-2 py-1 text-xs border border-[var(--text)]/20 rounded hover:bg-[var(--text)]/5">
                  <Plus size={14} /> Add
                </button>
              </div>
              {content.about.stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3 mb-2">
                  <input type="text" value={stat.value} onChange={(e) => updateAboutStat(index, 'value', e.target.value)} placeholder="Value" className="flex-1 px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm" />
                  <input type="text" value={stat.label} onChange={(e) => updateAboutStat(index, 'label', e.target.value)} placeholder="Label" className="flex-1 px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm" />
                  <button type="button" onClick={() => removeAboutStat(index)} className="p-1 text-red-500 hover:bg-red-500/10 rounded">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        {activeTab === 'cta' && (
          <div className="border border-[var(--text)]/10 rounded-lg p-6 space-y-4">
            <h2 className="font-serif text-xl mb-4">CTA Section (Let&apos;s Create)</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Section Number</label>
                <input type="text" value={content.cta.sectionNumber} onChange={(e) => setContent({ ...content, cta: { ...content.cta, sectionNumber: e.target.value } })} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
              </div>
              <div>
                <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Title</label>
                <input type="text" value={content.cta.title} onChange={(e) => setContent({ ...content, cta: { ...content.cta, title: e.target.value } })} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
              </div>
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">Email</label>
              <input type="email" value={content.cta.email} onChange={(e) => setContent({ ...content, cta: { ...content.cta, email: e.target.value } })} className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg" />
            </div>
            <div className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs tracking-wider uppercase text-[var(--text-muted)]">Social Links</label>
                <button type="button" onClick={addSocialLink} className="flex items-center gap-1 px-2 py-1 text-xs border border-[var(--text)]/20 rounded hover:bg-[var(--text)]/5">
                  <Plus size={14} /> Add
                </button>
              </div>
              {content.cta.socialLinks.map((link, index) => (
                <div key={index} className="flex items-center gap-3 mb-2">
                  <input type="text" value={link.label} onChange={(e) => updateSocialLink(index, 'label', e.target.value)} placeholder="Label" className="flex-1 px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm" />
                  <input type="text" value={link.href} onChange={(e) => updateSocialLink(index, 'href', e.target.value)} placeholder="URL" className="flex-1 px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm" />
                  <button type="button" onClick={() => removeSocialLink(index)} className="p-1 text-red-500 hover:bg-red-500/10 rounded">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs tracking-wider uppercase text-[var(--text-muted)]">Offices</label>
                <button type="button" onClick={addOffice} className="flex items-center gap-1 px-2 py-1 text-xs border border-[var(--text)]/20 rounded hover:bg-[var(--text)]/5">
                  <Plus size={14} /> Add
                </button>
              </div>
              {content.cta.offices.map((office, index) => (
                <div key={index} className="flex items-center gap-3 mb-2">
                  <input type="text" value={office.title} onChange={(e) => updateOffice(index, 'title', e.target.value)} placeholder="Title" className="flex-1 px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm" />
                  <input type="text" value={office.address} onChange={(e) => updateOffice(index, 'address', e.target.value)} placeholder="Address" className="flex-1 px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm" />
                  <button type="button" onClick={() => removeOffice(index)} className="p-1 text-red-500 hover:bg-red-500/10 rounded">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-theme-inverse text-theme-inverse rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save All'}
          </button>
          <Link href="/admin/pages" className="px-6 py-3 border border-[var(--text)]/20 rounded-lg hover:bg-[var(--text)]/5 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
