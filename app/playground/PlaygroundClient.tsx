// app/playground/PlaygroundClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import HeaderLogo from '../components/HeaderLogo';
import { useTheme } from '../components/ThemeProvider';
import { useLanguage } from '../components/LanguageContext';

interface ToolItem {
  id: string;
  title: string;
  titleJp?: string;
  category: string;
  badge: string;
  description: string;
  descriptionJp?: string;
  link: string;
  imageUrl: string;
  categoryTextColor?: string;
}

const prototypeTools: ToolItem[] = [
  {
    id: 'tool-virtual-try-on',
    title: 'Virtual Try-On',
    category: 'FASHION & E-COMMERCE',
    badge: 'AI COMPUTER VISION',
    description:
      'Experience real-time virtual apparel fitting powered by generative computer vision models, allowing users to visualize garments effortlessly.',
    descriptionJp:
      '生成型コンピュータビジョンモデルによるリアルタイム仮想アパレル試着。ユーザーが服の試着イメージを瞬時に確認できる実験的UI。',
    link: 'https://fashion.genkibrothers.co/',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'tool-cv-builder',
    title: 'AI-Powered Japanese CV Builder',
    titleJp: 'AI日本語履歴書・職務経歴書ジェネレーター',
    category: 'CAREER & HR TECH',
    badge: 'NLP & LOCALIZATION',
    description:
      'Seamlessly converts global professional experiences into perfectly formatted, localized Japanese resumes (Rirekisho & Shokumukeirekisho).',
    descriptionJp:
      '海外での職務経歴を日本のフォーマットに準拠した履歴書・職務経歴書へ自動最適化・ローカライズ変換するAIツール。',
    link: 'https://cv-generator.genkibrothers.co/',
    imageUrl: 'http://api.genkibrothers.co/wp-content/uploads/2025/06/resume-genius-9si2noVCVH8-unsplash.jpg',
  },
  {
    id: 'tool-avatar-chat',
    title: 'Avatar Chat',
    titleJp: 'リアルタイム アバターチャット',
    category: 'INTERACTIVE AI',
    badge: 'VOICE & VISION',
    description:
      'Engage with lifelike digital avatars capable of real-time conversational responses, emotional expression, and context-aware guidance.',
    descriptionJp:
      'リアルタイムな対話、感情表現、コンテキストを理解したガイドが可能なデジタルアバターシステム。',
    link: 'https://avatar.genkibrothers.co/',
    imageUrl: 'http://api.genkibrothers.co/wp-content/uploads/2026/08/mulyadi-kL4coQHVj_A-unsplash-scaled.jpg',
  },
  {
    id: 'tool-strategy-canvas',
    title: 'Product Strategy Canvas',
    titleJp: 'プロダクト戦略キャンバス AI',
    category: 'STRATEGY & FRAMEWORKS',
    badge: 'AI WORKSPACE',
    description:
      'An intelligent workspace that transforms raw business goals into structured product roadmaps, value propositions, and opportunity maps.',
    descriptionJp:
      'ビジネス目標を構造化されたプロダクトロードマップやバリュープロポジションへ自動展開するインテリジェントワークスペース。',
    link: 'https://product-dev.genkibrothers.co/',
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1000&auto=format&fit=crop',
    categoryTextColor: 'text-black font-bold',
  },
];

export default function PlaygroundClient() {
  const [showHeader, setShowHeader] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const { lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const titleFont = lang === 'JP' ? 'var(--font-biz-udpgothic), sans-serif' : 'var(--font-outfit), sans-serif';
  const bodyFont = lang === 'JP' ? 'var(--font-zen-kaku), sans-serif' : 'var(--font-inter), sans-serif';

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

  return (
    <main className="min-h-screen bg-white text-black dark:bg-[#0a0a0c] dark:text-white transition-colors duration-500 relative overflow-x-hidden selection:bg-[#FFE100] selection:text-black">
      
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
          <a href="/playground" className="text-black dark:text-[#FFE100] font-bold transition-colors">Playground</a>
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
          <a href="/playground" onClick={() => setMenuOpen(false)} className="text-black dark:text-[#FFE100] font-bold">Playground</a>
          <a href="/about" onClick={() => setMenuOpen(false)} className="hover:text-[#FFE100] transition-colors">About</a>
        </nav>

        <div className="space-y-6 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase text-zinc-400" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>Language</span>
            <div className="flex items-center space-x-2 font-semibold text-base tracking-wider" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              <button onClick={() => setLang('JP')} className={`pb-0.5 ${lang === 'JP' ? 'text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] font-bold' : 'text-zinc-400'}`}>JP</button>
              <span className="text-zinc-300 dark:text-zinc-700">/</span>
              <button onClick={() => setLang('EN')} className={`pb-0.5 ${lang === 'EN' ? 'text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] font-bold' : 'text-zinc-400'}`}>EN</button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold uppercase text-zinc-400" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>Theme</span>
            <button onClick={toggleTheme} className="px-4 py-1.5 border border-zinc-300 dark:border-zinc-800 rounded-full font-semibold text-base tracking-wider text-black dark:text-white" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
          </div>

          <a href="https://calendar.app.google/kEdQJyu5r68NhBjt9" target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} className="block w-full text-center py-4 bg-black text-white dark:bg-white dark:text-black font-semibold tracking-wider text-base rounded-[4px] shadow-lg" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
            {lang === 'JP' ? 'ミーティングを予約する →' : 'Book an Intro Call →'}
          </a>
        </div>
      </div>

      <article className="pt-36 pb-32 space-y-28 md:space-y-36">
        
        {/* 1. Hero Section */}
        <header className="px-8 md:px-16 max-w-5xl mx-auto space-y-6 w-full pt-8">
          <div className="text-left lg:text-center w-full">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              // PLAYGROUND & EXPERIMENTS
            </span>
          </div>
          <h1
            className={`font-medium tracking-tight text-left lg:text-center text-black dark:text-white ${
              lang === 'JP'
                ? 'text-3xl md:text-5xl lg:text-[64px] leading-[1.28]'
                : 'text-4xl md:text-6xl lg:text-7xl leading-[1.12]'
            }`}
            style={{ fontFamily: titleFont }}
          >
            {lang === 'JP' ? '実験的なAIツールとプロトタイプ。' : 'Experimental AI Tools'}
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-left lg:text-center leading-relaxed" style={{ fontFamily: bodyFont }}>
            {lang === 'JP'
              ? '最先端のAI技術、インタラクティブなプロトタイプ、実際のビジネス課題を解決するデザインユーティリティを探求するプロダクトラボ。'
              : 'A hands-on laboratory exploring emerging AI technologies, interactive prototypes, and design utilities built to solve real-world digital challenges.'}
          </p>
        </header>

        {/* 2. Hero 16:9 Image Section */}
        <section className="px-8 md:px-16 max-w-7xl mx-auto w-full">
          <div className="rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 aspect-[16/9] relative shadow-lg">
            <img
              src="https://api.genkibrothers.co/wp-content/uploads/2026/09/chris-schurmann-9X1VJKrz1lU-unsplash-scaled.jpg"
              alt="Playground Hero Visual"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* 3. Our Perspective Section */}
        <section className="px-8 md:px-16 max-w-4xl mx-auto w-full space-y-6">
          <div className="text-center w-full">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              // OUR PERSPECTIVE
            </span>
          </div>

          <div className="space-y-6 text-left max-w-3xl mx-auto">
            <h2
              className={`font-medium tracking-tight text-black dark:text-white ${
                lang === 'JP'
                  ? 'text-2xl md:text-4xl lg:text-[40px] leading-[1.38]'
                  : 'text-[36px] leading-snug'
              }`}
              style={{ fontFamily: titleFont }}
            >
              {lang === 'JP'
                ? 'ツールそのものが目的化するとき、本質的な目的を見失う。'
                : 'When the Tool Becomes the Goal, You Lose Sight of the Purpose.'}
            </h2>

            <div className="space-y-6 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans" style={{ fontFamily: bodyFont }}>
              {lang === 'JP' ? (
                <>
                  <p>
                    AIを導入するための急激な競争の中で、多くのプロダクトが「技術を導入すること自体」を目的とする罠に陥っています。生成モデルや高度なアルゴリズムは強力な加速器ですが、意図的な人間中心設計が欠けていれば、無個性のコンテンツやUXの摩擦を生むリスクをはらんでいます。
                  </p>
                  <p>
                    テクノロジー単体では人間の課題を解決できません。それを可能にするのは共感に基づいたデジタルアーキテクチャです。だからこそ、AI技術を直感的で意味のあるプロダクトへと変換するUXデザインの役割が、今日ほど重要になっている時代はありません。
                  </p>
                </>
              ) : (
                <>
                  <p>
                    In the rapid race to adopt artificial intelligence, many products fall into the trap of implementing technology for its own sake. Generative models and complex algorithms are incredible accelerators, but without intentional human-centered design, they risk creating generic outputs, cognitive friction, and fragmented user experiences.
                  </p>
                  <p>
                    Technology alone doesn&apos;t solve human problems—empathetic digital architecture does. That is why UX design is more critical today than ever before: it serves as the essential bridge that transforms raw AI capabilities into intuitive, meaningful, and scalable digital products.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* 4. Storytelling Bridge Section */}
        <section className="px-8 md:px-16 max-w-4xl mx-auto w-full space-y-6 pt-4">
          <div className="text-center w-full">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              // FROM THEORY TO PRACTICE
            </span>
          </div>

          <div className="space-y-4 text-left max-w-3xl mx-auto">
            <h2
              className={`font-medium tracking-tight text-black dark:text-white ${
                lang === 'JP'
                  ? 'text-2xl md:text-4xl lg:text-[40px] leading-[1.38]'
                  : 'text-[36px] leading-snug'
              }`}
              style={{ fontFamily: titleFont }}
            >
              {lang === 'JP'
                ? 'AI時代における人間中心の体験設計とプロトタイピング。'
                : 'Prototyping Human Experience in the Intelligence Age.'}
            </h2>

            <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans" style={{ fontFamily: bodyFont }}>
              {lang === 'JP'
                ? '記事を書くだけでなく、実際の体験を構築して検証を行う。生成型ビジョン、自然言語処理、リアルタイムアバター、戦略キャンバスなど、デザイン手法を直接試していただける4つのWebプロダクトを公開しています。'
                : 'To test our hypotheses in real-world scenarios, we don\'t just write articles—we build. We designed four core AI prototypes, applying rigorous UX methodology to generative computer vision, natural language processing, real-time avatars, and strategic canvases. Here is what we created for you to experience firsthand.'}
            </p>
          </div>
        </section>

        {/* 5. In-House Prototypes */}
        <section className="px-8 md:px-16 max-w-7xl mx-auto w-full space-y-12">
          <div className="flex flex-col items-center text-center space-y-3">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              // IN-HOUSE PROTOTYPES
            </span>
            <h2
              className={`font-medium tracking-tight text-black dark:text-white ${
                lang === 'JP'
                  ? 'text-2xl md:text-4xl lg:text-[40px] leading-[1.38]'
                  : 'text-3xl md:text-4xl'
              }`}
              style={{ fontFamily: titleFont }}
            >
              {lang === 'JP' ? 'インタラクティブ AIツール' : 'Interactive AI Tools'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {prototypeTools.map((tool) => (
              <a
                key={tool.id}
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group/card relative block w-full"
              >
                <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/50 shadow-md">
                  <img
                    src={tool.imageUrl}
                    alt={tool.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover/card:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10 opacity-80 transition-opacity duration-300 pointer-events-none" />
                  <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-between z-10 pointer-events-none">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase tracking-wider text-black bg-[#FFE100] px-3.5 py-1 rounded-full shadow-sm" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                        {tool.badge}
                      </span>
                      <span className={`text-xs font-mono uppercase tracking-widest ${tool.categoryTextColor || 'text-zinc-300'}`}>
                        {tool.category}
                      </span>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white capitalize group-hover/card:underline leading-tight" style={{ fontFamily: titleFont }}>
                        {lang === 'JP' && tool.titleJp ? tool.titleJp : tool.title}
                      </h3>
                      <p className="text-sm text-zinc-300 leading-relaxed line-clamp-3 font-sans" style={{ fontFamily: bodyFont }}>
                        {lang === 'JP' && tool.descriptionJp ? tool.descriptionJp : tool.description}
                      </p>
                      <div className="pt-2 flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-[#FFE100]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                        <span>{lang === 'JP' ? 'デモツールを試す' : 'Try Interactive Demo'}</span>
                        <span className="transition-transform duration-300 group-hover/card:translate-x-1">↗</span>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 6. CTA Section */}
        <section className="px-8 md:px-16 pt-16 pb-12 space-y-8 max-w-4xl mx-auto w-full flex flex-col lg:items-center">
          <div className="text-left lg:text-center w-full">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              // LET&apos;S BUILD TOGETHER
            </span>
          </div>
          <h2
            className={`font-medium tracking-tight text-left lg:text-center w-full text-black dark:text-white ${
              lang === 'JP'
                ? 'text-[26px] md:text-[40px] leading-[1.38]'
                : 'text-[32px] md:text-[48px] leading-tight'
            }`}
            style={{ fontFamily: titleFont }}
          >
            {lang === 'JP' ? '素晴らしいプロダクトを共に作りませんか？' : 'Ready to Build Something Great?'}
          </h2>
          <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-xl lg:mx-auto text-left lg:text-center w-full" style={{ fontFamily: bodyFont }}>
            {lang === 'JP'
              ? '野心的なブランドや企業とパートナーシップを組み、インパクトのあるデジタル体験を設計・構築・拡張します。まずはお気軽にご相談ください。'
              : 'We partner with ambitious brands to design, build, and scale high-impact digital experiences. Reach out and let\'s start a conversation.'}
          </p>
          <div className="pt-4 w-full flex justify-start lg:justify-center">
            <a href="https://calendar.app.google/kEdQJyu5r68NhBjt9" target="_blank" rel="noopener noreferrer" className="block w-full lg:w-auto text-center px-10 py-4 bg-black text-white dark:bg-white dark:text-black font-semibold tracking-wider text-base rounded-[4px] hover:-translate-y-1 hover:bg-[#FFE100] dark:hover:bg-[#FFE100] hover:text-black transition-all duration-500" style={{ fontFamily: titleFont }}>
              {lang === 'JP' ? 'ミーティングを予約する →' : 'Book an Intro Call →'}
            </a>
          </div>
        </section>

      </article>

      {/* Footer */}
      <footer
        className="px-8 md:px-16 py-12 text-xs text-zinc-500 font-medium flex flex-col md:flex-row justify-center items-center gap-3 md:gap-4 text-center"
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