// app/works/[slug]/WorkDetailClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import HeaderLogo from '../../components/HeaderLogo';
import CtaSection from '../../components/CtaSection';
import { useTheme } from '../../components/ThemeProvider';
import { useLanguage } from '../../components/LanguageContext';

interface WorkNode {
  id: string;
  title: string;
  slug: string;
  uri?: string;
  link?: string;
  featuredImage?: {
    node?: {
      sourceUrl: string;
    };
  };
  workDetails?: {
    brand?: string;
    thumbnailLabel?: string;
    metaClient?: string;
    metaYear?: string;
    metaRole?: string;
    metaDeliverables?: string;
    heroHeadline?: string;
    heroSubheadline?: string;
    whyStarted?: string;
    challengeText?: string;
    solutionText?: string;
    impactMetrics?: string;
  };
}

interface WorkDetailClientProps {
  work: WorkNode;
  otherWorks: WorkNode[];
}

export default function WorkDetailClient({ work, otherWorks }: WorkDetailClientProps) {
  const [showHeader, setShowHeader] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 100) {
      setShowHeader(false);
      setMenuOpen(false);
    } else {
      setShowHeader(true);
    }
  });

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [menuOpen]);

  const titleFont = lang === 'JP' ? 'var(--font-biz-udpgothic), sans-serif' : 'var(--font-outfit), sans-serif';
  const bodyFont = lang === 'JP' ? 'var(--font-zen-kaku), sans-serif' : 'var(--font-inter), sans-serif';

  const details = work.workDetails || {};
  const imageSrc = work.featuredImage?.node?.sourceUrl || '/images/works/converse.webp';

  // 他のすべての事例を表示（特定の除外条件を解除し、受け取ったotherWorksを全表示）
  const displayOtherWorks = otherWorks;

  return (
    <main className="min-h-screen bg-white text-black dark:bg-[#0a0a0c] dark:text-white transition-colors duration-500 relative overflow-x-hidden font-sans selection:bg-[#FFE100] selection:text-black">
      {/* Header */}
      <motion.header
        animate={{ y: showHeader ? 0 : -100 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-6 bg-transparent backdrop-blur-md transition-colors duration-500"
      >
        <a href="/" className="hover:opacity-70 transition block z-50">
          <HeaderLogo />
        </a>

        <nav
          className="hidden lg:flex items-center space-x-10 text-base tracking-wider font-medium text-zinc-600 dark:text-zinc-400 absolute left-1/2 -translate-x-1/2"
          style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
        >
          <a href="/works" className="hover:text-[#FFE100] transition-colors">Works</a>
          <a href="/articles" className="hover:text-[#FFE100] transition-colors">Articles</a>
          <a href="/playground" className="hover:text-[#FFE100] transition-colors">Playground</a>
          <a href="/about" className="hover:text-[#FFE100] transition-colors">About</a>
        </nav>

        <div className="hidden lg:flex items-center space-x-6 z-50">
          <div className="flex items-center space-x-1.5 font-semibold text-base tracking-wider" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
            <button
              onClick={() => setLang('JP')}
              className={`transition-all duration-300 pb-0.5 ${
                lang === 'JP'
                  ? 'text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent font-bold'
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-black dark:hover:text-white'
              }`}
            >
              JP
            </button>
            <span className="text-zinc-300 dark:text-zinc-700 select-none">/</span>
            <button
              onClick={() => setLang('EN')}
              className={`transition-all duration-300 pb-0.5 ${
                lang === 'EN'
                  ? 'text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent font-bold'
                  : 'text-zinc-400 dark:text-zinc-500 hover:text-black dark:hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          <button
            onClick={toggleTheme}
            className="px-5 py-2 border border-zinc-300 dark:border-zinc-800 rounded-full hover:border-[#FFE100] hover:bg-[#FFE100] hover:text-black transition-all duration-300 font-semibold text-base tracking-wider text-black dark:text-white"
            style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden z-50 relative w-10 h-10 flex flex-col justify-center items-center space-y-1.5 focus:outline-none"
          aria-label="Toggle Menu"
        >
          <span className={`w-6 h-[2px] bg-black dark:bg-white transition-all duration-300 ease-in-out ${menuOpen ? 'rotate-45 translate-y-[4px]' : ''}`} />
          <span className={`w-6 h-[2px] bg-black dark:bg-white transition-all duration-300 ease-in-out ${menuOpen ? '-rotate-45 -translate-y-[4px]' : ''}`} />
        </button>
      </motion.header>

      {/* Mobile Overlay Menu */}
      <div
        className={`fixed inset-0 z-40 bg-white/95 dark:bg-[#0a0a0c]/95 backdrop-blur-2xl transition-all duration-500 ease-in-out lg:hidden flex flex-col justify-between px-8 pt-32 pb-12 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col space-y-6 text-base font-medium tracking-tight" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
          <a href="/works" onClick={() => setMenuOpen(false)} className="hover:text-[#FFE100] transition-colors">Works</a>
          <a href="/articles" onClick={() => setMenuOpen(false)} className="hover:text-[#FFE100] transition-colors">Articles</a>
          <a href="/playground" onClick={() => setMenuOpen(false)} className="hover:text-[#FFE100] transition-colors">Playground</a>
          <a href="/about" onClick={() => setMenuOpen(false)} className="hover:text-[#FFE100] transition-colors">About</a>
        </nav>

        <div className="space-y-6 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase text-zinc-400" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>Language</span>
            <div className="flex items-center space-x-2 font-semibold text-base tracking-wider" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              <button
                onClick={() => setLang('JP')}
                className={`transition-all duration-300 pb-0.5 ${lang === 'JP' ? 'text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent font-bold' : 'text-zinc-400 dark:text-zinc-500'}`}
              >
                JP
              </button>
              <span className="text-zinc-300 dark:text-zinc-700">/</span>
              <button
                onClick={() => setLang('EN')}
                className={`transition-all duration-300 pb-0.5 ${lang === 'EN' ? 'text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent font-bold' : 'text-zinc-400 dark:text-zinc-500'}`}
              >
                EN
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase text-zinc-400" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>Theme</span>
            <button
              onClick={toggleTheme}
              className="px-4 py-1.5 border border-zinc-300 dark:border-zinc-800 rounded-full font-semibold text-base tracking-wider text-black dark:text-white"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>

          <a
            href="https://calendar.app.google/kEdQJyu5r68NhBjt9"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="block w-full text-center py-4 bg-black text-white dark:bg-white dark:text-black font-semibold tracking-wider text-base rounded-[4px] shadow-lg"
            style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
          >
            {lang === 'JP' ? 'ミーティングを予約する →' : 'Book an Intro Call →'}
          </a>
        </div>
      </div>

      {/* Hero Header */}
      <section className="pt-40 pb-16 px-6 md:px-16 max-w-7xl mx-auto">
        <a
          href="/works"
          className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:text-black dark:hover:text-[#FFE100] transition-colors mb-12"
          style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
        >
          ← {lang === 'JP' ? 'Works 一覧へ戻る' : 'Back to Works'}
        </a>

        <div className="space-y-6">
          <span
            className="text-xs font-semibold uppercase tracking-widest text-[#FFE100] bg-black dark:bg-[#18181b] px-3 py-1.5 rounded-[2px]"
            style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
          >
            {details.brand || details.thumbnailLabel || 'CASE STUDY'}
          </span>
          <h1
            className="text-4xl md:text-6xl font-medium tracking-tight leading-tight max-w-4xl"
            style={{ fontFamily: titleFont }}
          >
            {work.title}
          </h1>
          {details.heroSubheadline && (
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed" style={{ fontFamily: bodyFont }}>
              {details.heroSubheadline}
            </p>
          )}
        </div>

        {/* Key Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 my-12 border-y border-zinc-200 dark:border-zinc-800">
          <div>
            <span className="block text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>Client</span>
            <span className="text-base font-medium">{details.metaClient || 'N/A'}</span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>Year</span>
            <span className="text-base font-medium">{details.metaYear || 'N/A'}</span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>Role</span>
            <span className="text-base font-medium">{details.metaRole || 'Design & Engineering'}</span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>Deliverables</span>
            <span className="text-base font-medium">{details.metaDeliverables || 'Web Application'}</span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <img
            src={imageSrc}
            alt={work.title}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Case Content */}
      {(details.challengeText || details.solutionText || details.impactMetrics) && (
        <section className="py-16 px-6 md:px-16 max-w-5xl mx-auto space-y-20">
          {details.challengeText && (
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>// 01. THE CHALLENGE</span>
              <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal" style={{ fontFamily: bodyFont }}>
                {details.challengeText}
              </p>
            </div>
          )}

          {details.solutionText && (
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>// 02. OUR APPROACH &amp; SOLUTION</span>
              <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal" style={{ fontFamily: bodyFont }}>
                {details.solutionText}
              </p>
            </div>
          )}

          {details.impactMetrics && (
            <div className="p-8 md:p-12 rounded-2xl bg-zinc-50 dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 space-y-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#FFE100]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>// 03. IMPACT &amp; RESULTS</span>
              <p className="text-xl md:text-2xl font-medium leading-relaxed" style={{ fontFamily: titleFont }}>
                {details.impactMetrics}
              </p>
            </div>
          )}
        </section>
      )}

      {/* Other Works Section */}
      {displayOtherWorks.length > 0 && (
        <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto border-t border-zinc-200 dark:border-zinc-800">
          <div className="mb-12 flex justify-between items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 block mb-2" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                // OTHER WORKS
              </span>
              <h2 className="text-3xl font-medium tracking-tight" style={{ fontFamily: titleFont }}>
                {lang === 'JP' ? 'その他の実績' : 'Explore More Projects'}
              </h2>
            </div>
            <a
              href="/works"
              className="text-sm font-semibold uppercase tracking-wider text-zinc-500 hover:text-black dark:hover:text-[#FFE100] transition-colors hidden md:inline-block"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              {lang === 'JP' ? 'すべて見る →' : 'View All Works →'}
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayOtherWorks.map((item) => {
              const itemImg = item.featuredImage?.node?.sourceUrl || '/images/works/converse.webp';
              return (
                <a
                  key={item.id}
                  href={`/works/${item.slug}`}
                  className="group block space-y-4 p-4 rounded-xl border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-all duration-300"
                >
                  <div className="aspect-[16/10] rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <img
                      src={itemImg}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block mb-1" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                      {item.workDetails?.brand || item.workDetails?.thumbnailLabel || 'CASE STUDY'}
                    </span>
                    <h3 className="text-xl font-medium group-hover:text-[#FFE100] transition-colors" style={{ fontFamily: titleFont }}>
                      {item.title}
                    </h3>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      <CtaSection lang={lang} />

      {/* Footer */}
      <footer
        className="relative z-10 px-8 md:px-16 py-12 text-xs text-zinc-500 font-medium flex flex-col md:flex-row justify-center items-center gap-3 md:gap-4 text-center bg-transparent"
        style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
      >
        <span>
          © 2026{' '}
          <a
            href="https://genkibrothers.co"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 dark:hover:text-zinc-300 transition-colors"
          >
            Genki Brothers
          </a>
        </span>
        <span className="hidden md:inline text-zinc-700 dark:text-zinc-800">•</span>
        <div className="flex items-center gap-4">
          <a href="/privacy" className="hover:text-zinc-300 transition-colors capitalize">
            Privacy Policy
          </a>
          <span className="text-zinc-700 dark:text-zinc-800">•</span>
          <a
            href="https://www.linkedin.com/in/yoshinori-kawamura/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300 transition-colors capitalize"
          >
            LinkedIn
          </a>
        </div>
      </footer>
    </main>
  );
}