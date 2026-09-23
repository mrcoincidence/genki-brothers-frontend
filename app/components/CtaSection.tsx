// app/components/CtaSection.tsx
'use client';

export default function CtaSection({ lang = 'EN' }: { lang?: 'EN' | 'JP' }) {
  const titleFont = lang === 'JP' ? 'var(--font-biz-udpgothic), sans-serif' : 'var(--font-outfit), sans-serif';
  const bodyFont = lang === 'JP' ? 'var(--font-zen-kaku), sans-serif' : 'var(--font-inter), sans-serif';

  return (
    <section className="relative z-10 py-32 md:py-48 px-8 md:px-16 min-h-[75vh] flex flex-col justify-center items-center bg-transparent">
      <div className="max-w-4xl mx-auto space-y-8 w-full">
        {/* セクションタイトル */}
        <div className="text-left lg:text-center w-full">
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1"
            style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
          >
            // LET&apos;S BUILD TOGETHER
          </span>
        </div>

        {/* リードタイトル */}
        <h2
          className={`font-medium tracking-tight text-black dark:text-white text-left lg:text-center w-full ${
            lang === 'JP'
              ? 'text-[26px] md:text-[40px] leading-[1.38]'
              : 'text-[32px] md:text-[48px] leading-tight'
          }`}
          style={{ fontFamily: titleFont }}
        >
          {lang === 'JP' ? '素晴らしいプロダクトを共に作りませんか？' : 'Ready to Build Something Great?'}
        </h2>

        {/* 本文 */}
        <p
          className="text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto text-left lg:text-center w-full"
          style={{ fontFamily: bodyFont }}
        >
          {lang === 'JP'
            ? '野心的なブランドや企業とパートナーシップを組み、インパクトのあるデジタル体験を設計・構築・拡張します。まずはお気軽にご相談ください。'
            : 'We partner with ambitious brands to design, build, and scale high-impact digital experiences. Reach out and let\'s start a conversation.'}
        </p>

        {/* CTAボタン */}
        <div className="pt-4 text-left lg:text-center w-full">
          <a
            href="https://calendar.app.google/kEdQJyu5r68NhBjt9"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full lg:inline-block lg:w-auto text-center px-10 py-4 bg-black text-white dark:bg-white dark:text-black font-semibold tracking-wider text-base transition-all duration-500 ease-out rounded-[4px] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,225,0,0.3)] hover:bg-[#FFE100] dark:hover:bg-[#FFE100] hover:text-black dark:hover:text-black"
            style={{ fontFamily: titleFont }}
          >
            {lang === 'JP' ? 'ミーティングを予約する →' : 'Book an Intro Call →'}
          </a>
        </div>
      </div>
    </section>
  );
}