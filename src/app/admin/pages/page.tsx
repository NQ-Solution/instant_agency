import { FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const pages = [
  { id: 'home', name: 'Home', description: 'Main landing page with hero, divisions, and featured content', specialEditor: true },
  { id: 'about', name: 'About', description: 'Company story, values, and team information', specialEditor: false },
  { id: 'models', name: 'Models', description: 'Model listing and filtering options', specialEditor: false },
  { id: 'studio', name: 'Studio', description: 'Studio services, spaces, and pricing', specialEditor: false },
  { id: 'live', name: 'Live Commerce', description: 'Live commerce services and creator showcase', specialEditor: false },
  { id: 'contact', name: 'Contact', description: 'Contact form and office information', specialEditor: false },
];

export default function PagesManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl mb-2">Pages</h1>
        <p className="text-[var(--text-muted)]">Manage page content and sections</p>
      </div>

      <div className="grid gap-4">
        {pages.map((page) => (
          <Link
            key={page.id}
            href={page.specialEditor ? `/admin/pages/${page.id}` : `/admin/pages/${page.id}`}
            className="flex items-center justify-between p-6 border border-[var(--text)]/10 rounded-lg hover:border-[var(--text)]/30 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--text)]/10 rounded-lg flex items-center justify-center">
                <FileText size={24} className="text-[var(--text-muted)]" />
              </div>
              <div>
                <h3 className="font-serif text-lg mb-1">{page.name}</h3>
                <p className="text-sm text-[var(--text-muted)]">{page.description}</p>
              </div>
            </div>
            <ChevronRight
              size={20}
              className="text-[var(--text-muted)] group-hover:text-[var(--text)] transition-colors"
            />
          </Link>
        ))}
      </div>

      <div className="mt-8 p-6 bg-[var(--text)]/5 rounded-lg">
        <h3 className="font-serif text-lg mb-2">Page Content Management</h3>
        <p className="text-sm text-[var(--text-muted)]">
          각 페이지를 클릭하여 섹션별 콘텐츠를 편집할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
