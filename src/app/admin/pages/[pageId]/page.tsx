'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Section {
  sectionId: string;
  title: string;
  subtitle?: string;
  description?: string;
  order: number;
}

interface PageData {
  pageId: string;
  sections: Section[];
}

const pageNames: Record<string, string> = {
  home: 'Home',
  about: 'About',
  models: 'Models',
  studio: 'Studio',
  live: 'Live Commerce',
  contact: 'Contact',
};

export default function EditPageContent({ params }: { params: Promise<{ pageId: string }> }) {
  const { pageId } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageData, setPageData] = useState<PageData>({
    pageId: pageId,
    sections: [],
  });

  useEffect(() => {
    fetchPage();
  }, [pageId]);

  const fetchPage = async () => {
    try {
      const res = await fetch(`/api/pages/${pageId}`);
      const data = await res.json();
      if (data.success && data.data) {
        setPageData(data.data);
      }
    } catch (error) {
      console.error('Error fetching page:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageData),
      });

      if (res.ok) {
        alert('Page saved successfully!');
      } else {
        alert('Failed to save page');
      }
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  const addSection = () => {
    const newSection: Section = {
      sectionId: `section-${Date.now()}`,
      title: '',
      subtitle: '',
      description: '',
      order: pageData.sections.length + 1,
    };
    setPageData({
      ...pageData,
      sections: [...pageData.sections, newSection],
    });
  };

  const removeSection = (index: number) => {
    setPageData({
      ...pageData,
      sections: pageData.sections.filter((_, i) => i !== index),
    });
  };

  const updateSection = (index: number, field: keyof Section, value: string | number) => {
    const updatedSections = [...pageData.sections];
    updatedSections[index] = { ...updatedSections[index], [field]: value };
    setPageData({ ...pageData, sections: updatedSections });
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
        <Link
          href="/admin/pages"
          className="p-2 hover:bg-[var(--text)]/10 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-serif text-3xl">Edit {pageNames[pageId] || pageId} Page</h1>
          <p className="text-[var(--text-muted)]">Manage page sections and content</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl">Sections</h2>
          <button
            type="button"
            onClick={addSection}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-[var(--text)]/20 rounded-lg hover:bg-[var(--text)]/5"
          >
            <Plus size={16} />
            Add Section
          </button>
        </div>

        {pageData.sections.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[var(--text)]/20 rounded-lg">
            <p className="text-[var(--text-muted)] mb-4">No sections yet</p>
            <button
              type="button"
              onClick={addSection}
              className="inline-flex items-center gap-2 px-4 py-2 bg-theme-inverse text-theme-inverse rounded-lg hover:opacity-90"
            >
              <Plus size={16} />
              Add First Section
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {pageData.sections.map((section, index) => (
              <div
                key={section.sectionId}
                className="border border-[var(--text)]/10 rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">
                    Section {index + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSection(index)}
                    className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                      Section ID
                    </label>
                    <input
                      type="text"
                      value={section.sectionId}
                      onChange={(e) => updateSection(index, 'sectionId', e.target.value)}
                      className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSection(index, 'title', e.target.value)}
                      className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={section.subtitle || ''}
                      onChange={(e) => updateSection(index, 'subtitle', e.target.value)}
                      className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-[var(--text-muted)] mb-2">
                      Description
                    </label>
                    <textarea
                      value={section.description || ''}
                      onChange={(e) => updateSection(index, 'description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-transparent border border-[var(--text)]/20 rounded-lg focus:outline-none focus:border-[var(--text)] resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-theme-inverse text-theme-inverse rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Page'}
          </button>
          <Link
            href="/admin/pages"
            className="px-6 py-3 border border-[var(--text)]/20 rounded-lg hover:bg-[var(--text)]/5 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
