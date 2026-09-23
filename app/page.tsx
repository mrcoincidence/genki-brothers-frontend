// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, Variants } from 'framer-motion';
import InvaderCanvas from './components/InvaderCanvas';
import HeaderLogo from './components/HeaderLogo';
import ClientLogos from './components/ClientLogos';
import SelectedWorks from './components/SelectedWorks';
import HowWeWork from './components/HowWeWork';
import AboutSection from './components/AboutSection';
import CtaSection from './components/CtaSection';
import { useTheme } from './components/ThemeProvider';
import { useLanguage } from './components/LanguageContext';

export default function Home() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [showHeader, setShowHeader] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const { lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

  // TypeScriptの型ミスマッチを防ぐため Variants 型と as const を明示
  const curtainVariant: Variants = {
    hidden: { y: '100%', opacity: 0 },
    visible: (i: number) => ({
      y: '0%',
      opacity: 1,
      transition: {
        duration: 1.1,
        ease: [0.16, 1, 0.3, 1] as const,
        delay: i * 0.15,
      },
    }),
  };

  const titleFont = lang === 'JP' ? 'var(--font-biz-udpgothic), sans-serif' : 'var(--font-outfit), sans-serif';
  const bodyFont = lang === 'JP' ? 'var(--font-zen-kaku), sans-serif' : 'var(--font-inter), sans-serif';

  return (
    <main className="min-h-screen bg-white text-black dark:bg-[#0a0a0c] dark:text-white transition-colors duration-500 relative overflow-x-hidden font-sans selection:bg-[#FFE100] selection:text-black">
      <InvaderCanvas isDarkMode={theme === 'dark'} />

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

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen px-6 md:px-16 flex flex-col justify-center items-center">
        <div className="max-w-5xl space-y-8 w-full">
          <div className="overflow-hidden text-left lg:text-center w-full">
            <motion.span
              custom={0}
              initial="hidden"
              animate="visible"
              variants={curtainVariant}
              className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              // CREATIVE STUDIO &amp; DIGITAL ARCHITECTURE
            </motion.span>
          </div>

          <div className="overflow-hidden">
            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={curtainVariant}
              className={`font-medium tracking-tight text-black dark:text-white text-left lg:text-center ${
                lang === 'JP'
                  ? 'text-3xl md:text-5xl lg:text-[64px] leading-[1.28]'
                  : 'text-4xl md:text-6xl lg:text-7xl leading-[1.12]'
              }`}
              style={{ fontFamily: titleFont }}
            >
              {lang === 'JP'
                ? '感情を揺さぶり、確かなインパクトと成長を生むデジタル体験を構築。'
                : 'We Build Digital Experiences That Disrupt, Provoke Emotion, And Scale Impact.'}
            </motion.h1>
          </div>

          <div className="overflow-hidden">
            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={curtainVariant}
              className="max-w-2xl mx-auto text-zinc-600 dark:text-zinc-400 text-xl leading-relaxed font-normal text-left lg:text-center"
              style={{ fontFamily: bodyFont }}
            >
              {lang === 'JP'
                ? '文化的な多様性と多角的な視点を尊重したデジタルアーキテクチャ。繊細なニュアンスを力強いデザインへ落とし込み、複雑なビジョンを心に響く体験へと昇華させます。'
                : 'Engineered with a deep appreciation for cultural diversity and perspective. We translate nuance into bold design, turning complex vision into resonant human experiences.'}
            </motion.p>
          </div>

          <div className="overflow-hidden pt-4 text-left lg:text-center w-full">
            <motion.div custom={3} initial="hidden" animate="visible" variants={curtainVariant} className="w-full">
              <a
                href="https://calendar.app.google/kEdQJyu5r68NhBjt9"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full lg:inline-block lg:w-auto text-center px-9 py-4 bg-black text-white dark:bg-white dark:text-black font-semibold tracking-wider text-base transition-all duration-500 ease-out rounded-[4px] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,225,0,0.3)] hover:bg-[#FFE100] dark:hover:bg-[#FFE100] hover:text-black dark:hover:text-black"
                style={{ fontFamily: titleFont }}
              >
                {lang === 'JP' ? 'ミーティングを予約する →' : 'Book an Intro Call →'}
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <ClientLogos />
      <SelectedWorks lang={lang} />
      <HowWeWork lang={lang} />
      <AboutSection lang={lang} />
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