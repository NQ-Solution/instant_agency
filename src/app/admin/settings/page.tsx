'use client';

import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Eye, EyeOff, Download, Upload, AlertTriangle, Database, Clock, HardDrive } from 'lucide-react';
import type { Settings } from '@/types';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    id: '',
    site: { name: '', tagline: '' },
    contact: { email: '', phone: '', businessHours: '' },
    business: {
      businessNumber: '',
      businessName: '',
      representative: '',
      businessAddress: '',
      ecommerceNumber: '',
      hostingProvider: '',
    },
    pageVisibility: {
      home: true,
      about: true,
      models: true,
      studio: true,
      live: true,
      contact: true,
    },
    offices: [],
    social: {},
    partners: [],
  });
  const [newPartner, setNewPartner] = useState('');
  const [backupLoading, setBackupLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [includeImages, setIncludeImages] = useState(false);
  const [clearExisting, setClearExisting] = useState(false);
  const [restoreResults, setRestoreResults] = useState<Record<string, { imported: number; errors: number }> | null>(null);

  // DB 백업 관련 상태
  const [dbBackups, setDbBackups] = useState<Array<{
    id: string;
    name: string;
    description: string | null;
    size: number;
    compressedSize: number;
    includesImages: boolean;
    createdAt: string;
  }>>([]);
  const [dbBackupLoading, setDbBackupLoading] = useState(false);
  const [dbBackupName, setDbBackupName] = useState('');
  const [dbIncludeImages, setDbIncludeImages] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchDbBackups();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success) {
        setSettings(data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const addOffice = () => {
    setSettings({
      ...settings,
      offices: [...(settings.offices || []), { city: '', address: '' }],
    });
  };

  const removeOffice = (index: number) => {
    setSettings({
      ...settings,
      offices: settings.offices?.filter((_, i) => i !== index) || [],
    });
  };

  const updateOffice = (index: number, field: 'city' | 'address', value: string) => {
    const updatedOffices = [...(settings.offices || [])];
    updatedOffices[index] = { ...updatedOffices[index], [field]: value };
    setSettings({ ...settings, offices: updatedOffices });
  };

  const addPartner = () => {
    if (newPartner.trim()) {
      setSettings({
        ...settings,
        partners: [...(settings.partners || []), newPartner.trim()],
      });
      setNewPartner('');
    }
  };

  const removePartner = (index: number) => {
    setSettings({
      ...settings,
      partners: settings.partners?.filter((_, i) => i !== index) || [],
    });
  };

  const handleBackup = async () => {
    setBackupLoading(true);
    try {
      const res = await fetch(`/api/backup?includeImages=${includeImages}`);
      const data = await res.json();

      if (data.success) {
        // JSON 파일로 다운로드
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('백업 파일이 다운로드되었습니다.');
      } else {
        alert('백업 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Backup error:', error);
      alert('백업 중 오류가 발생했습니다.');
    } finally {
      setBackupLoading(false);
    }
  };

  // DB 백업 목록 가져오기
  const fetchDbBackups = async () => {
    try {
      const res = await fetch('/api/backup?action=list');
      const data = await res.json();
      if (data.success) {
        setDbBackups(data.data);
      }
    } catch (error) {
      console.error('Error fetching DB backups:', error);
    }
  };

  // DB에 압축 백업 저장
  const handleSaveToDb = async () => {
    setDbBackupLoading(true);
    try {
      const res = await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'saveToDb',
          name: dbBackupName || undefined,
          includeImages: dbIncludeImages,
        }),
      });
      const data = await res.json();

      if (data.success) {
        alert(`백업이 DB에 저장되었습니다.\n압축률: ${data.data.compressionRatio}\n삭제된 오래된 백업: ${data.data.deletedOldBackups}개`);
        setDbBackupName('');
        fetchDbBackups();
      } else {
        alert('DB 백업 저장 실패');
      }
    } catch (error) {
      console.error('DB backup error:', error);
      alert('DB 백업 중 오류 발생');
    } finally {
      setDbBackupLoading(false);
    }
  };

  // DB 백업에서 복원
  const handleRestoreFromDb = async (backupId: string, backupName: string) => {
    if (!confirm(`"${backupName}" 백업에서 복원하시겠습니까?\n${clearExisting ? '⚠️ 기존 데이터가 삭제됩니다!' : '중복 항목은 덮어쓰기됩니다.'}`)) {
      return;
    }

    setRestoreLoading(true);
    setRestoreResults(null);

    try {
      // 백업 데이터 가져오기
      const getRes = await fetch(`/api/backup?action=download&id=${backupId}`);
      const getData = await getRes.json();

      if (!getData.success) {
        alert('백업 데이터 로드 실패');
        return;
      }

      // 복원 실행
      const restoreRes = await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: getData.data,
          options: { clearExisting },
        }),
      });

      const result = await restoreRes.json();

      if (result.success) {
        setRestoreResults(result.results);
        alert('복원 완료!');
        fetchSettings();
      } else {
        alert(`복원 실패: ${result.error}`);
      }
    } catch (error) {
      console.error('Restore from DB error:', error);
      alert('복원 중 오류 발생');
    } finally {
      setRestoreLoading(false);
    }
  };

  // DB 백업 삭제
  const handleDeleteDbBackup = async (backupId: string, backupName: string) => {
    if (!confirm(`"${backupName}" 백업을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/backup?id=${backupId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        alert('백업이 삭제되었습니다.');
        fetchDbBackups();
      } else {
        alert('삭제 실패');
      }
    } catch (error) {
      console.error('Delete backup error:', error);
      alert('삭제 중 오류 발생');
    }
  };

  // DB 백업 JSON으로 다운로드
  const handleDownloadDbBackup = async (backupId: string, backupName: string) => {
    try {
      const res = await fetch(`/api/backup?action=download&id=${backupId}`);
      const data = await res.json();

      if (data.success) {
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${backupName.replace(/[^a-zA-Z0-9가-힣]/g, '_')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        alert('다운로드 실패');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('다운로드 중 오류 발생');
    }
  };

  // 파일 크기 포맷
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleRestore = async (file: File) => {
    if (!confirm(clearExisting
      ? '⚠️ 경고: 기존 데이터가 모두 삭제되고 백업 파일의 데이터로 대체됩니다. 계속하시겠습니까?'
      : '백업 파일에서 데이터를 복원합니다. 중복된 항목은 덮어쓰기됩니다. 계속하시겠습니까?'
    )) {
      return;
    }

    setRestoreLoading(true);
    setRestoreResults(null);

    try {
      const text = await file.text();
      const backupData = JSON.parse(text);

      if (!backupData.version || !backupData.data) {
        alert('유효하지 않은 백업 파일입니다.');
        return;
      }

      const res = await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: backupData,
          options: { clearExisting },
        }),
      });

      const result = await res.json();

      if (result.success) {
        setRestoreResults(result.results);
        alert('데이터가 성공적으로 복원되었습니다.');
        // 설정 새로고침
        fetchSettings();
      } else {
        alert(`복원 실패: ${result.error}`);
      }
    } catch (error) {
      console.error('Restore error:', error);
      alert('복원 중 오류가 발생했습니다. 파일 형식을 확인해주세요.');
    } finally {
      setRestoreLoading(false);
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
      <div className="mb-8">
        <h1 className="font-serif text-3xl mb-2">Settings</h1>
        <p className="text-[var(--text-muted)]">Manage your site settings</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Site Settings */}
        <section className="border border-[var(--text)]/10 rounded-lg p-6">
          <h2 className="font-serif text-xl mb-4">Site Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={settings.site?.name || ''}
                onChange={(e) =>
                  setSettings({ ...settings, site: { ...settings.site, name: e.target.value } })
                }
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={settings.site?.tagline || ''}
                onChange={(e) =>
                  setSettings({ ...settings, site: { ...settings.site, tagline: e.target.value } })
                }
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
          </div>
        </section>

        {/* Page Visibility */}
        <section className="border border-[var(--text)]/10 rounded-lg p-6">
          <h2 className="font-serif text-xl mb-4">페이지 공개 설정</h2>
          <p className="text-sm text-[var(--text-muted)] mb-4">각 페이지의 공개/비공개 상태를 설정합니다.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: 'home', label: 'Home', path: '/' },
              { key: 'about', label: 'About', path: '/about' },
              { key: 'models', label: 'Models', path: '/models' },
              { key: 'studio', label: 'Studio', path: '/studio' },
              { key: 'live', label: 'Live', path: '/live' },
              { key: 'contact', label: 'Contact', path: '/contact' },
            ].map((page) => {
              const isVisible = settings.pageVisibility?.[page.key as keyof typeof settings.pageVisibility] !== false;
              return (
                <button
                  key={page.key}
                  type="button"
                  onClick={() =>
                    setSettings({
                      ...settings,
                      pageVisibility: {
                        ...settings.pageVisibility,
                        [page.key]: !isVisible,
                      },
                    })
                  }
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                    isVisible
                      ? 'border-green-500/50 bg-green-500/10'
                      : 'border-red-500/50 bg-red-500/10'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-medium">{page.label}</p>
                    <p className="text-xs text-[var(--text-muted)]">{page.path}</p>
                  </div>
                  {isVisible ? (
                    <Eye size={20} className="text-green-500" />
                  ) : (
                    <EyeOff size={20} className="text-red-500" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Contact Settings */}
        <section className="border border-[var(--text)]/10 rounded-lg p-6">
          <h2 className="font-serif text-xl mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Email
              </label>
              <input
                type="email"
                value={settings.contact?.email || ''}
                onChange={(e) =>
                  setSettings({ ...settings, contact: { ...settings.contact, email: e.target.value } })
                }
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={settings.contact?.phone || ''}
                onChange={(e) =>
                  setSettings({ ...settings, contact: { ...settings.contact, phone: e.target.value } })
                }
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Business Hours
              </label>
              <input
                type="text"
                value={settings.contact?.businessHours || ''}
                onChange={(e) =>
                  setSettings({ ...settings, contact: { ...settings.contact, businessHours: e.target.value } })
                }
                placeholder="e.g., Mon - Fri, 10:00 - 19:00"
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
          </div>
        </section>

        {/* Business Information */}
        <section className="border border-[var(--text)]/10 rounded-lg p-6">
          <h2 className="font-serif text-xl mb-4">사업자 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                사업자등록번호
              </label>
              <input
                type="text"
                value={settings.business?.businessNumber || ''}
                onChange={(e) =>
                  setSettings({ ...settings, business: { ...settings.business, businessNumber: e.target.value } })
                }
                placeholder="000-00-00000"
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                상호명
              </label>
              <input
                type="text"
                value={settings.business?.businessName || ''}
                onChange={(e) =>
                  setSettings({ ...settings, business: { ...settings.business, businessName: e.target.value } })
                }
                placeholder="회사/상호명"
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                대표자명
              </label>
              <input
                type="text"
                value={settings.business?.representative || ''}
                onChange={(e) =>
                  setSettings({ ...settings, business: { ...settings.business, representative: e.target.value } })
                }
                placeholder="대표자 성함"
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                통신판매업 신고번호
              </label>
              <input
                type="text"
                value={settings.business?.ecommerceNumber || ''}
                onChange={(e) =>
                  setSettings({ ...settings, business: { ...settings.business, ecommerceNumber: e.target.value } })
                }
                placeholder="제0000-서울강남-00000호"
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                사업장 주소
              </label>
              <input
                type="text"
                value={settings.business?.businessAddress || ''}
                onChange={(e) =>
                  setSettings({ ...settings, business: { ...settings.business, businessAddress: e.target.value } })
                }
                placeholder="사업장 소재지 주소"
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                호스팅 서비스 제공자
              </label>
              <input
                type="text"
                value={settings.business?.hostingProvider || ''}
                onChange={(e) =>
                  setSettings({ ...settings, business: { ...settings.business, hostingProvider: e.target.value } })
                }
                placeholder="예: Amazon Web Services, Vercel 등"
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section className="border border-[var(--text)]/10 rounded-lg p-6">
          <h2 className="font-serif text-xl mb-4">Social Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                Instagram
              </label>
              <input
                type="url"
                value={settings.social?.instagram || ''}
                onChange={(e) =>
                  setSettings({ ...settings, social: { ...settings.social, instagram: e.target.value } })
                }
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                TikTok
              </label>
              <input
                type="url"
                value={settings.social?.tiktok || ''}
                onChange={(e) =>
                  setSettings({ ...settings, social: { ...settings.social, tiktok: e.target.value } })
                }
                placeholder="https://tiktok.com/@..."
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                YouTube
              </label>
              <input
                type="url"
                value={settings.social?.youtube || ''}
                onChange={(e) =>
                  setSettings({ ...settings, social: { ...settings.social, youtube: e.target.value } })
                }
                placeholder="https://youtube.com/@..."
                className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              />
            </div>
          </div>
        </section>

        {/* Offices */}
        <section className="border border-[var(--text)]/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl">Offices</h2>
            <button
              type="button"
              onClick={addOffice}
              className="flex items-center gap-2 px-3 py-1 text-xs border border-[var(--text)]/20 rounded hover:bg-[var(--text)]/5"
            >
              <Plus size={14} />
              Add Office
            </button>
          </div>
          <div className="space-y-4">
            {settings.offices?.map((office, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={office.city}
                    onChange={(e) => updateOffice(index, 'city', e.target.value)}
                    placeholder="City"
                    className="px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
                  />
                  <input
                    type="text"
                    value={office.address}
                    onChange={(e) => updateOffice(index, 'address', e.target.value)}
                    placeholder="Address"
                    className="px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeOffice(index)}
                  className="p-3 text-red-500 hover:bg-red-500/10 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Partners */}
        <section className="border border-[var(--text)]/10 rounded-lg p-6">
          <h2 className="font-serif text-xl mb-4">Partners</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newPartner}
              onChange={(e) => setNewPartner(e.target.value)}
              placeholder="Add partner name"
              className="flex-1 px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPartner())}
            />
            <button
              type="button"
              onClick={addPartner}
              className="px-4 py-3 bg-theme-inverse text-theme-inverse rounded-lg hover:opacity-90"
            >
              <Plus size={18} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {settings.partners?.map((partner, index) => (
              <span
                key={index}
                className="flex items-center gap-2 px-3 py-1 bg-[var(--text)]/10 rounded-full text-sm"
              >
                {partner}
                <button
                  type="button"
                  onClick={() => removePartner(index)}
                  className="text-red-500 hover:text-red-400"
                >
                  <Trash2 size={12} />
                </button>
              </span>
            ))}
          </div>
        </section>

        {/* Backup & Restore */}
        <section className="border border-[var(--text)]/10 rounded-lg p-6">
          <h2 className="font-serif text-xl mb-4">데이터 백업 & 복원</h2>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            모든 데이터를 JSON 파일로 백업하거나, 백업 파일에서 데이터를 복원할 수 있습니다.
          </p>

          {/* Backup Section */}
          <div className="border border-[var(--text)]/10 rounded-lg p-4 mb-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Download size={18} />
              데이터 백업
            </h3>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              모델, 크리에이터, 예약, 페이지 콘텐츠, 설정 등 모든 데이터를 다운로드합니다.
            </p>
            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeImages}
                  onChange={(e) => setIncludeImages(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">이미지 포함</span>
              </label>
              <span className="text-xs text-[var(--text-muted)]">
                (이미지 포함 시 파일 크기가 커질 수 있습니다)
              </span>
            </div>
            <button
              type="button"
              onClick={handleBackup}
              disabled={backupLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Download size={16} />
              {backupLoading ? '백업 생성 중...' : '백업 다운로드'}
            </button>
          </div>

          {/* Restore Section */}
          <div className="border border-[var(--text)]/10 rounded-lg p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Upload size={18} />
              데이터 복원
            </h3>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              백업 파일(.json)을 선택하여 데이터를 복원합니다.
            </p>
            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={clearExisting}
                  onChange={(e) => setClearExisting(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-red-500 font-medium">기존 데이터 삭제 후 복원</span>
              </label>
            </div>
            {clearExisting && (
              <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg mb-4">
                <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-500">
                  <strong>경고:</strong> 이 옵션을 선택하면 현재 모든 데이터가 삭제되고 백업 파일의 데이터로 대체됩니다.
                  복원 전 반드시 현재 데이터를 백업하세요.
                </p>
              </div>
            )}
            <label
              className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-[var(--text)]/20 rounded-lg cursor-pointer hover:border-[var(--text)]/40 transition-colors ${restoreLoading ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <Upload size={20} />
              <span>{restoreLoading ? '복원 중...' : '백업 파일 선택'}</span>
              <input
                type="file"
                accept=".json"
                className="hidden"
                disabled={restoreLoading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleRestore(file);
                    e.target.value = '';
                  }
                }}
              />
            </label>

            {/* Restore Results */}
            {restoreResults && (
              <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <h4 className="font-medium text-green-600 mb-2">복원 완료</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  {Object.entries(restoreResults).map(([key, value]) => (
                    <div key={key} className="p-2 bg-[var(--bg)]/50 rounded">
                      <p className="font-medium capitalize">{key}</p>
                      <p className="text-[var(--text-muted)]">
                        성공: {value.imported} / 실패: {value.errors}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* DB Compressed Backup */}
        <section className="border border-[var(--text)]/10 rounded-lg p-6">
          <h2 className="font-serif text-xl mb-4 flex items-center gap-2">
            <Database size={24} />
            DB 압축 백업
          </h2>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            데이터를 압축하여 데이터베이스에 저장합니다. 최대 3개까지 유지되며, 오래된 백업은 자동으로 삭제됩니다.
          </p>

          {/* Create DB Backup */}
          <div className="border border-[var(--text)]/10 rounded-lg p-4 mb-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <HardDrive size={18} />
              새 백업 생성
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">백업 이름 (선택)</label>
                <input
                  type="text"
                  value={dbBackupName}
                  onChange={(e) => setDbBackupName(e.target.value)}
                  placeholder="예: 배포 전 백업"
                  className="w-full px-3 py-2 bg-transparent border border-[var(--text)]/20 rounded-lg text-sm"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dbIncludeImages}
                  onChange={(e) => setDbIncludeImages(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">이미지 포함</span>
                <span className="text-xs text-[var(--text-muted)]">(크기 증가)</span>
              </label>
              <button
                type="button"
                onClick={handleSaveToDb}
                disabled={dbBackupLoading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Database size={16} />
                {dbBackupLoading ? '저장 중...' : 'DB에 백업 저장'}
              </button>
            </div>
          </div>

          {/* DB Backup List */}
          <div className="border border-[var(--text)]/10 rounded-lg p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Clock size={18} />
              저장된 백업 ({dbBackups.length}/3)
            </h3>
            {dbBackups.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)] text-center py-4">
                저장된 백업이 없습니다.
              </p>
            ) : (
              <div className="space-y-2">
                {dbBackups.map((backup) => (
                  <div
                    key={backup.id}
                    className="flex items-center justify-between p-3 bg-[var(--text)]/5 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{backup.name}</p>
                      <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mt-1">
                        <span>{new Date(backup.createdAt).toLocaleString('ko-KR')}</span>
                        <span>원본: {formatBytes(backup.size)}</span>
                        <span>압축: {formatBytes(backup.compressedSize)}</span>
                        <span className="text-green-600">
                          ({((1 - backup.compressedSize / backup.size) * 100).toFixed(0)}% 절감)
                        </span>
                        {backup.includesImages && (
                          <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-600 rounded text-xs">
                            이미지 포함
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRestoreFromDb(backup.id, backup.name)}
                        disabled={restoreLoading}
                        className="p-2 text-green-600 hover:bg-green-500/10 rounded-lg transition-colors"
                        title="이 백업에서 복원"
                      >
                        <Upload size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadDbBackup(backup.id, backup.name)}
                        className="p-2 text-blue-600 hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="JSON으로 다운로드"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDbBackup(backup.id, backup.name)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="삭제"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-theme-inverse text-theme-inverse rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
