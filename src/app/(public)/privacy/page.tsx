'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PrivacyContent {
  companyName: string;
  representative: string;
  email: string;
  phone: string;
  address: string;
}

export default function PrivacyPage() {
  const [content, setContent] = useState<PrivacyContent>({
    companyName: 'Instant Agency',
    representative: '',
    email: '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings', { cache: 'no-store' });
        const data = await res.json();

        if (data.success && data.data) {
          setContent({
            companyName: data.data.site?.name || 'Instant Agency',
            representative: data.data.business?.representative || '',
            email: data.data.contact?.email || '',
            phone: data.data.contact?.phone || '',
            address: data.data.business?.businessAddress || '',
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      {/* Header */}
      <section className="px-8 mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-muted mb-6">
            Legal
          </p>
          <h1 className="font-logo text-4xl md:text-5xl lg:text-6xl font-normal mb-8">
            개인정보 처리방침
          </h1>
          <p className="text-muted">
            {content.companyName}는 고객님의 개인정보를 소중히 여기며, 관련 법규를 준수합니다.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-8">
        <div className="max-w-4xl mx-auto prose prose-invert prose-sm">
          <div className="space-y-12">
            {/* 1. 개인정보 수집 항목 */}
            <div className="border-b border-theme-10 pb-8">
              <h2 className="text-xl font-normal mb-4">1. 개인정보 수집 항목</h2>
              <p className="text-muted leading-relaxed mb-4">
                {content.companyName}는 서비스 제공을 위해 아래와 같은 개인정보를 수집합니다.
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside">
                <li>필수 항목: 이름, 이메일, 연락처</li>
                <li>선택 항목: 회사명, 직책</li>
                <li>자동 수집 항목: 접속 IP, 접속 일시, 서비스 이용 기록</li>
              </ul>
            </div>

            {/* 2. 개인정보 수집 및 이용 목적 */}
            <div className="border-b border-theme-10 pb-8">
              <h2 className="text-xl font-normal mb-4">2. 개인정보 수집 및 이용 목적</h2>
              <ul className="text-muted space-y-2 list-disc list-inside">
                <li>서비스 제공 및 계약 이행: 예약 관리, 상담 서비스 제공</li>
                <li>고객 관리: 문의 응대, 공지사항 전달</li>
                <li>마케팅 활용: 이벤트 안내, 서비스 개선 (별도 동의 시)</li>
              </ul>
            </div>

            {/* 3. 개인정보 보유 및 이용 기간 */}
            <div className="border-b border-theme-10 pb-8">
              <h2 className="text-xl font-normal mb-4">3. 개인정보 보유 및 이용 기간</h2>
              <p className="text-muted leading-relaxed mb-4">
                수집된 개인정보는 수집 목적이 달성된 후 지체 없이 파기합니다. 단, 관련 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관됩니다.
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside">
                <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
                <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
                <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
                <li>표시/광고에 관한 기록: 6개월</li>
              </ul>
            </div>

            {/* 4. 개인정보 제3자 제공 */}
            <div className="border-b border-theme-10 pb-8">
              <h2 className="text-xl font-normal mb-4">4. 개인정보 제3자 제공</h2>
              <p className="text-muted leading-relaxed">
                {content.companyName}는 고객님의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside mt-4">
                <li>고객님이 사전에 동의한 경우</li>
                <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
              </ul>
            </div>

            {/* 5. 개인정보 처리 위탁 */}
            <div className="border-b border-theme-10 pb-8">
              <h2 className="text-xl font-normal mb-4">5. 개인정보 처리 위탁</h2>
              <p className="text-muted leading-relaxed">
                서비스 향상을 위해 아래와 같이 개인정보 처리 업무를 위탁하고 있습니다.
              </p>
              <div className="mt-4 p-4 bg-theme-inverse/5 border border-theme-10">
                <table className="w-full text-sm text-muted">
                  <thead>
                    <tr className="border-b border-theme-10">
                      <th className="text-left py-2">수탁업체</th>
                      <th className="text-left py-2">위탁업무</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2">웹 호스팅 서비스 제공업체</td>
                      <td className="py-2">서버 운영 및 관리</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 6. 정보주체의 권리 */}
            <div className="border-b border-theme-10 pb-8">
              <h2 className="text-xl font-normal mb-4">6. 정보주체의 권리</h2>
              <p className="text-muted leading-relaxed mb-4">
                고객님은 언제든지 다음과 같은 권리를 행사할 수 있습니다.
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside">
                <li>개인정보 열람 요구</li>
                <li>오류 등이 있을 경우 정정 요구</li>
                <li>삭제 요구</li>
                <li>처리정지 요구</li>
              </ul>
              <p className="text-muted leading-relaxed mt-4">
                위 권리 행사는 서면, 이메일, 전화 등으로 요청하실 수 있으며, 지체 없이 조치하겠습니다.
              </p>
            </div>

            {/* 7. 개인정보의 안전성 확보 조치 */}
            <div className="border-b border-theme-10 pb-8">
              <h2 className="text-xl font-normal mb-4">7. 개인정보의 안전성 확보 조치</h2>
              <p className="text-muted leading-relaxed mb-4">
                {content.companyName}는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside">
                <li>관리적 조치: 내부관리계획 수립, 직원 교육</li>
                <li>기술적 조치: 개인정보처리시스템 접근권한 관리, 암호화 기술 적용</li>
                <li>물리적 조치: 전산실 및 자료보관실 접근통제</li>
              </ul>
            </div>

            {/* 8. 개인정보 보호책임자 */}
            <div className="border-b border-theme-10 pb-8">
              <h2 className="text-xl font-normal mb-4">8. 개인정보 보호책임자</h2>
              <p className="text-muted leading-relaxed mb-4">
                개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
              </p>
              <div className="p-4 bg-theme-inverse/5 border border-theme-10">
                <p className="text-muted mb-2">
                  <span className="text-theme">담당:</span> {content.representative || '개인정보 보호책임자'}
                </p>
                {content.email && (
                  <p className="text-muted mb-2">
                    <span className="text-theme">이메일:</span> {content.email}
                  </p>
                )}
                {content.phone && (
                  <p className="text-muted">
                    <span className="text-theme">연락처:</span> {content.phone}
                  </p>
                )}
              </div>
            </div>

            {/* 9. 개인정보 처리방침 변경 */}
            <div className="border-b border-theme-10 pb-8">
              <h2 className="text-xl font-normal mb-4">9. 개인정보 처리방침 변경</h2>
              <p className="text-muted leading-relaxed">
                이 개인정보 처리방침은 법령, 정책 또는 보안기술의 변경에 따라 내용의 추가, 삭제 및 수정이 있을 시에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
              </p>
            </div>

            {/* 10. 권익침해 구제방법 */}
            <div>
              <h2 className="text-xl font-normal mb-4">10. 권익침해 구제방법</h2>
              <p className="text-muted leading-relaxed mb-4">
                정보주체는 개인정보침해로 인한 구제를 받기 위하여 개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터 등에 분쟁해결이나 상담 등을 신청할 수 있습니다.
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside">
                <li>개인정보분쟁조정위원회: 1833-6972 (www.kopico.go.kr)</li>
                <li>개인정보침해신고센터: 118 (privacy.kisa.or.kr)</li>
                <li>대검찰청: 1301 (www.spo.go.kr)</li>
                <li>경찰청: 182 (ecrm.cyber.go.kr)</li>
              </ul>
            </div>

            {/* 시행일 */}
            <div className="pt-8 text-center">
              <p className="text-muted text-sm">
                본 개인정보 처리방침은 2024년 1월 1일부터 시행됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <section className="px-8 mt-16 text-center">
        <Link
          href="/"
          className="inline-block px-8 py-4 border border-theme text-sm tracking-wider uppercase hover:bg-theme-inverse hover:text-theme-inverse transition-all duration-300"
        >
          홈으로 돌아가기
        </Link>
      </section>
    </div>
  );
}
