import Link from 'next/link';
import Image from 'next/image';

const values = [
  { icon: '◇', title: 'Creativity', desc: '경계를 넘어서는 창의적 시도로 새로운 비주얼 언어를 만들어갑니다' },
  { icon: '○', title: 'Excellence', desc: '완벽을 추구하는 장인정신으로 모든 프로젝트에 임합니다' },
  { icon: '△', title: 'Innovation', desc: '기술과 예술의 융합으로 미래를 선도합니다' },
  { icon: '□', title: 'Integrity', desc: '신뢰와 투명성을 바탕으로 지속 가능한 파트너십을 구축합니다' },
  { icon: '◈', title: 'Diversity', desc: '다양한 배경과 관점을 존중하며 포용적인 환경을 만들어갑니다' },
  { icon: '✧', title: 'Collaboration', desc: '브랜드, 아티스트와의 협업을 통해 시너지를 창출합니다' },
];

const timeline = [
  { year: '2010', title: 'Instant Agency Founded', desc: '서울 강남에서 프리미엄 포토 스튜디오로 시작' },
  { year: '2013', title: 'Studio Expansion', desc: '강남 플래그십 스튜디오 확장 오픈' },
  { year: '2015', title: 'Model Agency Launch', desc: '모델 매니지먼트 사업부 런칭' },
  { year: '2018', title: 'Paris Expansion', desc: '파리 마레 지구에 유럽 본부 설립' },
  { year: '2020', title: 'Digital Transformation', desc: '디지털 콘텐츠 제작 역량 강화' },
  { year: '2022', title: 'NYC Office Opening', desc: '뉴욕 소호 지역에 글로벌 오피스 오픈' },
  { year: '2024', title: 'Live Commerce Division', desc: '라이브 커머스 전문 부서 신설' },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-8 relative">
        <p className="text-xs tracking-[0.3em] uppercase text-muted mb-6 animate-fade-up">
          Our Story
        </p>
        <h1 className="font-logo text-[clamp(3rem,12vw,10rem)] font-normal leading-[0.9] tracking-[-0.02em] animate-fade-up">
          About
        </h1>
        <p className="text-muted mt-8 max-w-xl mx-auto leading-relaxed animate-fade-up-delay">
          스튜디오, 모델 에이전시, 라이브 커머스를 아우르는 종합 크리에이티브 그룹
        </p>

        {/* Scroll Indicator */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-fade-up-delay">
          <span className="text-[0.65rem] tracking-[0.3em] uppercase text-muted">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-current to-transparent animate-scroll-pulse" />
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 max-w-[1400px] mx-auto items-center">
          {/* Image */}
          <div className="relative group">
            <div className="relative h-[50vh] lg:h-[70vh] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800"
                alt="Instant Agency Studio"
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-normal mb-8 leading-[1.3]">
              Beyond the<br />Ordinary
            </h2>
            <div className="space-y-6 text-muted leading-relaxed">
              <p>
                Instant Agency는 2010년 서울에서 시작된 크리에이티브 스튜디오입니다.
                &apos;비어있음&apos;을 의미하는 이름처럼, 우리는 무한한 가능성의 공간을 만들어갑니다.
              </p>
              <p>
                단순한 촬영 공간을 넘어, 모델 매니지먼트와 라이브 커머스까지
                크리에이티브 산업의 모든 영역을 아우르는 종합 솔루션을 제공합니다.
              </p>
              <p>
                파리, 뉴욕으로 확장하며 글로벌 네트워크를 구축해온 Instant Agency는
                동서양의 미학을 결합한 독창적인 비주얼 아이덴티티로
                세계 무대에서 인정받고 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-theme-inverse text-theme-inverse">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal">
            Our Values
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1200px] mx-auto px-8">
          {values.map((value) => (
            <div
              key={value.title}
              className="p-8 border border-current/10 text-center hover:border-current transition-colors"
            >
              <div className="text-3xl opacity-80 mb-6">{value.icon}</div>
              <h3 className="text-xl mb-4">{value.title}</h3>
              <p className="text-sm opacity-70 leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 px-8 overflow-hidden">
        <div className="text-center mb-16">
          <p className="text-xs tracking-widest uppercase text-muted mb-4">
            Milestones
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal">
            Our Journey
          </h2>
        </div>
        <div className="overflow-x-auto pb-8">
          <div className="flex gap-0 min-w-max px-8">
            {timeline.map((item) => (
              <div
                key={item.year}
                className="flex-shrink-0 w-[300px] px-8 text-center relative"
              >
                <div className="absolute top-[60px] left-0 right-0 h-px bg-theme-20" />
                <div className="relative z-10 mb-12">
                  <span className="text-3xl md:text-4xl">{item.year}</span>
                </div>
                <div className="w-3 h-3 border-2 border-theme rounded-full bg-[var(--bg)] mx-auto mb-8" />
                <h3 className="text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-center text-xs tracking-wider uppercase text-muted opacity-60">
          ← Scroll to explore →
        </p>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8 text-center border-t border-theme-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal mb-8">
          Work With Us
        </h2>
        <Link
          href="/contact"
          className="inline-block px-12 py-5 border border-theme text-sm tracking-wider uppercase hover:bg-theme-inverse hover:text-theme-inverse transition-all duration-300"
        >
          Get in Touch
        </Link>
      </section>
    </div>
  );
}
