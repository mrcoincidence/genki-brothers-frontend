// app/components/AboutSection.tsx
'use client';

export default function AboutSection({ lang = 'EN' }: { lang?: 'EN' | 'JP' }) {
  const titleFont = lang === 'JP' ? 'var(--font-biz-udpgothic), sans-serif' : 'var(--font-outfit), sans-serif';
  const bodyFont = lang === 'JP' ? 'var(--font-zen-kaku), sans-serif' : 'var(--font-inter), sans-serif';

  return (
    <section className="relative z-10 py-32 md:py-48 px-8 md:px-16 min-h-[85vh] flex flex-col justify-center items-center bg-transparent">
      {/* セクションタイトル: 常に Outfit */}
      <div className="w-full text-left lg:text-center mb-8">
        <span
          className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1"
          style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
        >
          // ABOUT US
        </span>
      </div>

      {/* ポートレート写真 */}
      <div className="mb-10 w-36 h-36 md:w-48 md:h-48 relative rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800/50 shadow-md bg-zinc-100 dark:bg-zinc-900">
        <img
          src="http://api.genkibrothers.co/wp-content/uploads/2026/09/profile-04.jpg"
          alt="Yoshinori Kawamura - Founder of Genki Brothers"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900 -z-10" />
      </div>

      {/* リードタイトル (日本語Line Heightを leading-[1.38] に拡張) */}
      <h2
        className={`font-medium tracking-tight text-black dark:text-white mb-6 max-w-4xl text-left lg:text-center w-full ${
          lang === 'JP'
            ? 'text-2xl md:text-4xl lg:text-[40px] leading-[1.38]'
            : 'text-3xl md:text-5xl leading-tight'
        }`}
        style={{ fontFamily: titleFont }}
      >
        {lang === 'JP'
          ? '料理のUX思想、グローバルなクラフトマンシップ、先端テクノロジーの融合。'
          : 'Bridging Culinary UX Principles, Global Craft, and Emerging Tech.'}
      </h2>

      {/* 本文 */}
      <p
        className="text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed text-left lg:text-center w-full"
        style={{ fontFamily: bodyFont }}
      >
        {lang === 'JP' ? (
          <>
            Genki Brothersは、20年以上のグローバルな実績を持つクリエイティブディレクター／UX・UIストラテジストの<strong>河村 慶典（Yoshinori Kawamura）</strong>によって設立されました。イギリスやカナダでプロのシェフとしてキャリアを歩み始めた彼は、料理の芸術とデジタルプロダクトデザインがまったく同じDNA（人間の潜在的なニーズを先回りし、即座に忘れられない価値を提供すること）を共有していることに気づきました。
          </>
        ) : (
          <>
            Genki Brothers was founded by <strong>Yoshinori Kawamura</strong>, a Creative Director &amp; UX/UI Strategist with over 20 years of global craft. Starting his career as a professional chef in the UK and Canada, Yoshinori discovered that culinary arts and digital product design share the exact same DNA—both exist to anticipate human needs and deliver immediate, unforgettable value.
          </>
        )}
      </p>

      {/* CTAボタン */}
      <div className="w-full text-left lg:text-center">
        <a
          href="/about"
          className="block w-full lg:inline-block lg:w-auto text-center px-8 py-3.5 border border-black dark:border-white text-black dark:text-white rounded-[4px] font-semibold text-base tracking-wider transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,225,0,0.3)] hover:bg-[#FFE100] hover:border-[#FFE100] hover:text-black dark:hover:text-black"
          style={{ fontFamily: titleFont }}
        >
          {lang === 'JP' ? '私達について詳しく見る →' : 'Learn More About Us →'}
        </a>
      </div>
    </section>
  );
}