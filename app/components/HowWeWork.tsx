// app/components/HowWeWork.tsx
'use client';

const stepsEN = [
  {
    num: '01',
    title: 'Discovery',
    desc: 'We dive deep into your brand identity, business challenges, and audience landscape to define clear digital goals.',
  },
  {
    num: '02',
    title: 'Architecture',
    desc: 'Translating strategic insights into bold visual concepts, interactive prototypes, and scalable design systems.',
  },
  {
    num: '03',
    title: 'Craft',
    desc: 'Building high-performance web experiences with smooth animations, robust code, and meticulous attention to detail.',
  },
  {
    num: '04',
    title: 'Scale Impact',
    desc: 'Deploying seamlessly, measuring user engagement, and continuously optimizing for long-term growth and impact.',
  },
];

const stepsJP = [
  {
    num: '01',
    title: 'ディスカバリー',
    desc: 'ブランドのアイデンティティ、事業課題、ターゲット像を深く紐解き、明確なデジタルゴールを定義します。',
  },
  {
    num: '02',
    title: 'アーキテクチャ',
    desc: '戦略的インサイトを本質的なビジュアルコンセプト、プロトタイプ、拡張可能なデザインシステムへ落とし込みます。',
  },
  {
    num: '03',
    title: 'クラフトマンシップ',
    desc: '滑らかなアニメーション、堅牢なコード、そして細部への徹底的なこだわりを結集し、高品質なWeb体験を構築します。',
  },
  {
    num: '04',
    title: 'インパクトの拡張',
    desc: 'シームレスにデプロイし、エンゲージメントを測定しながら、長期的な成長と効果に向けて最適化し続けます。',
  },
];

export default function HowWeWork({ lang = 'EN' }: { lang?: 'EN' | 'JP' }) {
  const steps = lang === 'JP' ? stepsJP : stepsEN;

  const titleFont = lang === 'JP' ? 'var(--font-biz-udpgothic), sans-serif' : 'var(--font-outfit), sans-serif';
  const bodyFont = lang === 'JP' ? 'var(--font-zen-kaku), sans-serif' : 'var(--font-inter), sans-serif';

  return (
    <section className="relative z-10 py-32 md:py-48 px-8 md:px-16 max-w-7xl mx-auto bg-transparent min-h-[80vh] flex flex-col justify-center">
      <div className="mb-20 max-w-3xl mx-auto w-full">
        {/* セクションタイトル: 常に Outfit */}
        <div className="text-left lg:text-center w-full">
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1 mb-4"
            style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
          >
            // HOW WE WORK
          </span>
        </div>

        {/* リードタイトル (日本語Line Heightを leading-[1.38] に拡張) */}
        <h2
          className={`font-medium tracking-tight text-black dark:text-white text-left lg:text-center ${
            lang === 'JP'
              ? 'text-2xl md:text-4xl lg:text-[40px] leading-[1.38]'
              : 'text-3xl md:text-5xl leading-tight'
          }`}
          style={{ fontFamily: titleFont }}
        >
          {lang === 'JP'
            ? 'チームを動かし、確かなインパクトと成長を生む共感型戦略。'
            : 'Empathetic Strategy That Aligns Teams And Drives Scale Impact.'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step) => (
          <div
            key={step.num}
            className="p-8 bg-transparent border border-zinc-200 dark:border-zinc-800/40 rounded-2xl backdrop-blur-md flex flex-col justify-between min-h-[260px]"
          >
            <div>
              <span className="inline-block text-xs font-mono text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1 mb-4">
                [{step.num}]
              </span>
              <h3
                className="text-2xl font-bold text-black dark:text-white mb-4 text-left"
                style={{ fontFamily: titleFont }}
              >
                {step.title}
              </h3>
              <p
                className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal text-left"
                style={{ fontFamily: bodyFont }}
              >
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}