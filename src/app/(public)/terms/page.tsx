'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TermsContent {
  companyName: string;
  email: string;
}

export default function TermsPage() {
  const [content, setContent] = useState<TermsContent>({
    companyName: 'Instant Agency',
    email: '',
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
            email: data.data.contact?.email || '',
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
            이용약관
          </h1>
          <p className="text-muted">
            {content.companyName} 서비스 이용에 관한 약관입니다.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {/* 제1조 목적 */}
            <div className="border-b border-theme-10 pb-8">
              <h2 className="text-xl font-normal mb-4">제1조 (목적)</h2>
              <p className="text-muted leading-relaxed">
                이 약관은 {content.companyName}(이하 &quot;회사&quot;)가 제공하는 서비스의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
            </div>

            {/* 제2조 정의 */}
            <div className="border-b border-theme-10 pb-8">
              <h2 className="text-xl font-normal mb-4">제2조 (정의)</h2>
              <ul className="text-muted space-y-3 list-decimal list-inside">
                <li>&quot;서비스&quot;란 회사가 제공하는 스튜디오 대여, 모델 에이전시, 라이브 커머스 등 모든 서비스를 의미합니다.</li>
                <li>&quot;이용자&quot;란 회사의 서비스에 접속하여 이 약관에 따라 회사가 제공하는 서비스를 이용하는 고객을 말합니다.</li>
                <li>&quot;예약&quot;이란 이용자가 회사의 서비스를 이용하기 위해 날짜와 시간을 지정하여 신청하는 것을 말합니다.</li>
              </ul>
            </div>

            {/* 제3조 약관의 효력 및 변경 */}
            <div className="border-b border-theme-10 pb-8">
              <h2 className="text-xl font-normal mb-4">제3조 (약관의 효력 및 변경)</h2>
              <ul className="text-muted space-y-3 list-decimal list-inside">
                <li>이 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용됩니다.</li>
                <li>회사는 필요하다고 인정되는 경우 이 약관을 변경할 수 있으며, 변경된 약관은 공지사항을 통해 공지합니다.</li>
                <li>이용자는 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단할 수 있습니다.</li>
              </ul>
            </div>

            {/* 제4조 서비스의 제공 */}
            <div className="border-b border-theme-10 pb-8">
              <h2 className="text-xl font-normal mb-4">제4조 (서비스의 제공)</h2>
              <p className="text-muted leading-relaxed mb-4">
                회사는 다음과 같은 서비스를 제공합니다.
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside">
                <li>스튜디오 대여 서비스</li>
                <li>모델 캐스팅 및 에이전시 서비스</li>
                <li>라이브 커머스 기획 및 진행 서비스</li>
                <li>기타 회사가 정하는 서비스</li>
              </ul>
            </div>

            {/* 제5조 서비스 이용 시간 */}
            <div className="border-b border-theme-10 pb-8">
              <h2 className="text-xl font-normal mb-4">제5조 (서비스 이용 시간)</h2>
              <ul className="text-muted space-y-3 list-decimal list-inside">
                <li>서비스는 회사의 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴, 1일 24시간 제공됩니다.</li>
                <li>회사는 시스템 점검, 교체, 고장, 통신 두절 등의 사유가 발생한 경우 서비스 제공을 일시적으로 중단할 수 있습니다.</li>
              </ul>
            </div>

            {/* 제6조 예약 및 결제 */}
            <div className="border-b border-theme-10 pb-8">
              <h2 className="text-xl font-normal mb-4">제6조 (예약 및 결제)</h2>
              <ul className="text-muted space-y-3 list-decimal list-inside">
                <li>이용자는 회사가 정한 방법에 따라 서비스 예약을 신청할 수 있습니다.</li>
                <li>예약은 회사의 확인 후 확정되며, 확정 여부는 이메일 또는 전화로 통보됩니다.</li>
                <li>결제는 회사가 정한 방법에 따라 이루어지며, 자세한 사항은 별도로 안내됩니다.</li>
              </ul>
            </div>

            {/* 제7조 예약 취소 및 환불 */}
            <div className="border-b border-theme-10 pb-8">
              <h2 className="text-xl font-normal mb-4">제7조 (예약 취소 및 환불)</h2>
              <ul className="text-muted space-y-3 list-decimal list-inside">
                <li>이용자는 예약일 기준 3일 전까지 예약을 취소할 수 있으며, 이 경우 전액 환불됩니다.</li>
                <li>예약일 기준 2일 전 취소 시 50%가 환불됩니다.</li>
                <li>예약일 기준 1일 전 또는 당일 취소 시에는 환불이 불가합니다.</li>
                <li>회사의 사정으로 서비스를 제공하지 못하는 경우 전액 환불됩니다.</li>
              </ul>
            </div>

            {/* 제8조 이용자의 의무 */}
            <div className="border-b border-theme-10 pb-8">
              <h2 className="text-xl font-normal mb-4">제8조 (이용자의 의무)</h2>
              <p className="text-muted leading-relaxed mb-4">
                이용자는 다음 행위를 하여서는 안 됩니다.
              </p>
              <ul className="text-muted space-y-2 list-disc list-inside">
                <li>허위 정보를 기재하는 행위</li>
                <li>타인의 정보를 도용하는 행위</li>
                <li>회사의 시설물을 훼손하는 행위</li>
                <li>서비스의 안정적인 운영을 방해하는 행위</li>
                <li>기타 관련 법령에 위반되는 행위</li>
              </ul>
            </div>

            {/* 제9조 회사의 의무 */}
            <div className="border-b border-theme-10 pb-8">
              <h2 className="text-xl font-normal mb-4">제9조 (회사의 의무)</h2>
              <ul className="text-muted space-y-3 list-decimal list-inside">
                <li>회사는 관련 법령과 이 약관이 금지하는 행위를 하지 않으며, 지속적이고 안정적인 서비스를 제공하기 위해 노력합니다.</li>
                <li>회사는 이용자의 개인정보를 보호하기 위해 보안시스템을 구비하여야 합니다.</li>
                <li>회사는 이용자로부터 제기되는 의견이나 불만이 정당하다고 인정되는 경우 적절한 조치를 취합니다.</li>
              </ul>
            </div>

            {/* 제10조 면책조항 */}
            <div className="border-b border-theme-10 pb-8">
              <h2 className="text-xl font-normal mb-4">제10조 (면책조항)</h2>
              <ul className="text-muted space-y-3 list-decimal list-inside">
                <li>회사는 천재지변, 전쟁, 기타 불가항력적인 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.</li>
                <li>회사는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대해 책임을 지지 않습니다.</li>
                <li>회사는 이용자가 서비스를 통해 기대하는 수익을 얻지 못하거나 상실한 것에 대해 책임을 지지 않습니다.</li>
              </ul>
            </div>

            {/* 제11조 분쟁 해결 */}
            <div className="border-b border-theme-10 pb-8">
              <h2 className="text-xl font-normal mb-4">제11조 (분쟁 해결)</h2>
              <ul className="text-muted space-y-3 list-decimal list-inside">
                <li>회사와 이용자 간에 발생한 분쟁에 관한 소송은 회사의 본사 소재지를 관할하는 법원을 관할 법원으로 합니다.</li>
                <li>회사와 이용자 간에 제기된 소송에는 대한민국 법을 적용합니다.</li>
              </ul>
            </div>

            {/* 부칙 */}
            <div>
              <h2 className="text-xl font-normal mb-4">부칙</h2>
              <p className="text-muted leading-relaxed">
                이 약관은 2024년 1월 1일부터 시행합니다.
              </p>
            </div>

            {/* 문의 */}
            <div className="pt-8 p-6 bg-theme-inverse/5 border border-theme-10">
              <h3 className="text-lg mb-4">문의사항</h3>
              <p className="text-muted leading-relaxed">
                본 약관에 대한 문의사항이 있으시면 아래로 연락해주세요.
              </p>
              {content.email && (
                <p className="text-muted mt-2">
                  이메일: <a href={`mailto:${content.email}`} className="text-theme hover:underline">{content.email}</a>
                </p>
              )}
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
