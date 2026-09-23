'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import HeaderLogo from '../components/HeaderLogo';
import { useTheme } from '../components/ThemeProvider';
import { useLanguage } from '../components/LanguageContext';

interface ExpertiseItem {
  id: string;
  name: string;
  nameJp?: string;
  category: 'R&D' | 'Sales & Marketing' | 'Creative & Craft';
}

const expertiseItems: ExpertiseItem[] = [
  // R&D
  { id: 'rd-1', name: 'Business Vision and Strategy', nameJp: '事業ビジョン & 戦略', category: 'R&D' },
  { id: 'rd-2', name: 'Product Discovery', nameJp: 'プロダクトディスカバリー', category: 'R&D' },
  { id: 'rd-3', name: 'Product Strategy', nameJp: 'プロダクト戦略', category: 'R&D' },
  { id: 'rd-4', name: 'Product Roadmap', nameJp: 'プロダクトロードマップ', category: 'R&D' },
  { id: 'rd-5', name: 'UX & Market Research', nameJp: 'UX & ユーザーリサーチ', category: 'R&D' },
  { id: 'rd-6', name: 'UX Design', nameJp: 'UXデザイン', category: 'R&D' },
  { id: 'rd-7', name: 'Prototype', nameJp: 'プロトタイピング', category: 'R&D' },

  // Sales & Marketing
  { id: 'sm-1', name: 'Marketing Strategy', nameJp: 'マーケティング戦略', category: 'Sales & Marketing' },
  { id: 'sm-2', name: 'Marketing Campaign', nameJp: 'マーケティングキャンペーン', category: 'Sales & Marketing' },
  { id: 'sm-3', name: 'CRM Strategy', nameJp: 'CRM戦略', category: 'Sales & Marketing' },

  // Creative & Craft
  { id: 'cc-1', name: 'UI Design', nameJp: 'UIデザイン', category: 'Creative & Craft' },
  { id: 'cc-2', name: 'Creative Direction', nameJp: 'クリエイティブディレクション', category: 'Creative & Craft' },
  { id: 'cc-3', name: 'Branding', nameJp: 'ブランディング', category: 'Creative & Craft' },
  { id: 'cc-4', name: 'Information Architecture', nameJp: '情報設計 (IA)', category: 'Creative & Craft' },
  { id: 'cc-5', name: 'Design ops & Workflow', nameJp: 'デザインOps & ワークフロー', category: 'Creative & Craft' },
  { id: 'cc-6', name: 'Design System', nameJp: 'デザインシステム', category: 'Creative & Craft' },
  { id: 'cc-7', name: 'Front-end Development', nameJp: 'フロントエンド開発', category: 'Creative & Craft' },
  { id: 'cc-8', name: 'Back-end Development', nameJp: 'バックエンド開発', category: 'Creative & Craft' },
  { id: 'cc-9', name: 'Video Production', nameJp: '映像制作', category: 'Creative & Craft' },
  { id: 'cc-10', name: 'Retail Installation', nameJp: 'リテールインスタレーション', category: 'Creative & Craft' },
  { id: 'cc-11', name: 'Editorial Design', nameJp: 'エディトリアルデザイン', category: 'Creative & Craft' },
  { id: 'cc-12', name: 'Sound Design', nameJp: 'サウンドデザイン', category: 'Creative & Craft' },
  { id: 'cc-13', name: 'Music', nameJp: '音楽・楽曲制作', category: 'Creative & Craft' },
];

const filterCategoriesEN = ['All', 'R&D', 'Sales & Marketing', 'Creative & Craft'] as const;
const filterCategoriesJP = ['すべて', 'R&D', 'Sales & Marketing', 'Creative & Craft'] as const;

export default function AboutClient() {
  const [showHeader, setShowHeader] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
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

  const activeCategories = lang === 'JP' ? filterCategoriesJP : filterCategoriesEN;

  const filteredItems = selectedCategory === 'All' || selectedCategory === 'すべて'
    ? expertiseItems
    : expertiseItems.filter((item) => item.category === selectedCategory);

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
          <a href="/playground" className="hover:text-[#FFE100] transition-colors">Playground</a>
          <a href="/about" className="text-black dark:text-[#FFE100] font-bold transition-colors">About</a>
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
          <a href="/about" onClick={() => setMenuOpen(false)} className="text-black dark:text-[#FFE100] font-bold">About</a>
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
              // ABOUT GENKI BROTHERS
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
            {lang === 'JP'
              ? '単なるブランドを超えて — 信頼と共創に基づく歩み。'
              : 'More Than Just a Brand — A Journey Built on Collaboration & Trust.'}
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-left lg:text-center leading-relaxed" style={{ fontFamily: bodyFont }}>
            {lang === 'JP'
              ? '「Brothers」という名には、世界中の優秀なエンジニア、映像ディレクター、ストラテジスト、専門的な才能を持つ人々との深く永続的な繋がりが込められています。'
              : 'The name "Brothers" reflects the deep, enduring connections formed with brilliant engineers, film directors, strategists, and specialized talents across the world.'}
          </p>
        </header>

        {/* 2. Hero Visual (New Photo DSC05371-bw.jpg) */}
        <section className="px-8 md:px-16 max-w-7xl mx-auto w-full">
          <div className="rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 aspect-[16/9] relative shadow-lg">
            <img
              src="https://api.genkibrothers.co/wp-content/uploads/2026/09/DSC05371-bw.jpg"
              alt="Genki Brothers Founder"
              className="w-full h-full object-cover object-center grayscale contrast-105"
            />
          </div>
        </section>

        {/* 3. Collective Story Section */}
        <section className="px-8 md:px-16 max-w-4xl mx-auto w-full space-y-6">
          <div className="text-center w-full">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              // THE CREATIVE COLLECTIVE
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
                ? '創業者 Yoshinori Kawamura のクリエイティブな探求と、柔軟なコレクティブ構造。'
                : 'Embodying Creative Craft with Agile Precision.'}
            </h2>

            <div className="space-y-6 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans" style={{ fontFamily: bodyFont }}>
              {lang === 'JP' ? (
                <>
                  <p>
                    Genki Brothersは、創業者 <strong>河村 慶典（Yoshinori Kawamura）</strong> のクリエイティブな歩みそのものを体現したプロダクションです。柔軟なクリエイティブ・コレクティブ（共同体）として、従来型の代理店組織の無駄なオーバーヘッドを排除し、複雑な課題に直面した際には領域を超えた専任のスクワッド（チーム）を編成します。
                  </p>
                  <p>
                    この機動的かつハイパーアダプティブな体制こそが、私たちの独創的な強みです。境界を超える独創性と組織的な厳格さを兼ね備え、アイデアの誕生から勝利の瞬間まで、一貫して妥協のないクオリティで大胆なビジョンを形にします。
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Genki Brothers is the embodiment of the founder&apos;s creative journey, founded by <strong>Yoshinori Kawamura</strong>. Operating as a flexible Creative Collective, we assemble dedicated squads to tackle complex challenges, celebrate victories, and bring bold ideas to life with institutional rigor.
                  </p>
                  <p>
                    By bypassing traditional agency overhead, our hyper-adaptable model combines boundary-pushing originality with precise craftsmanship—empowering us to adapt dynamically to every unique vision and execute high-impact digital products with uncompromised quality.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* 4. Culinary Roots Section */}
        <section className="px-8 md:px-16 max-w-4xl mx-auto w-full space-y-6 pt-4">
          <div className="text-center w-full">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              // CULINARY ROOTS TO DIGITAL UX
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
                ? '厨房から画面へ：料理の技法から生まれた究極のUX思想。'
                : 'From the Kitchen to the Screen: Culinary Arts as the Ultimate UX.'}
            </h2>

            <div className="space-y-6 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans" style={{ fontFamily: bodyFont }}>
              {lang === 'JP' ? (
                <>
                  <p>
                    創業者のデジタルデザインへの歩みは、画面やピクセルの世界から遠く離れた場所から始まりました。高校卒業直後、<strong>河村 慶典（Yoshinori Kawamura）</strong> はイギリスとカナダの非常に緊迫感のあるプロの厨房へと飛び込み、プロのシェフとしてキャリアを歩み始めました。
                  </p>
                  <p>
                    料理は彼に人間体験の根本を教えました。言葉にされないゲストのニーズを先回りすること、タイミングの調整、五感の細部の調和、排他的で即座に感動を届けること。デジタルデザインやUX/UI戦略の世界へと転身した際、彼は料理とプロダクトデザインがまったく同じDNAを持っていることに気づきました。どちらも人々に奉仕し、忘れられない価値を創造するために存在しています。
                  </p>
                  <p>
                    現在、Genki Brothersは同じく高級レストランのバックグラウンドを持つ二人の兄弟、<strong>河村 慶典（Yoshinori Kawamura）</strong> と <strong>桑原 豪（Go Kuwahara）</strong> によって設立・運営されています。慶典（Yoshi）がリアルのビジョンを最先端のデジタル世界へ昇華させ、豪（Go）が枠に囚われないコンテンツとストーリーテリングで圧倒的な体験を生み出します。
                  </p>
                </>
              ) : (
                <>
                  <p>
                    The founder&apos;s professional path began far from digital screens. Immediately after graduating high school, Yoshinori stepped into the high-intensity kitchens of the United Kingdom and Canada, working as a professional chef.
                  </p>
                  <p>
                    Cooking taught him the fundamentals of human experience: anticipating a guest&apos;s unspoken needs, orchestrating timing, balancing sensory details, and delivering immediate value. When he transitioned into digital design and UX/UI strategy, he realized that cooking and product design share the exact same DNA—both exist solely to serve people and create unforgettable moments of value.
                  </p>
                  <p>
                    Now, Genki Brothers is formed and run by two brothers, <strong>Yoshinori Kawamura</strong> and <strong>Go Kuwahara</strong>, who also come from a rich high-end restaurant background. Yoshi transforms physical vision into cutting-edge digital ecosystems, while Go creates stunning experiences with unlimited content and compelling narrative.
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        {/* 5. Areas of Expertise */}
        <section className="px-8 md:px-16 max-w-4xl mx-auto w-full space-y-10 pt-4">
          <div className="flex flex-col items-center text-center space-y-3">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              // AREAS OF EXPERTISE
            </span>
            <h2
              className={`font-medium tracking-tight text-black dark:text-white ${
                lang === 'JP'
                  ? 'text-2xl md:text-4xl lg:text-[40px] leading-[1.38]'
                  : 'text-3xl md:text-4xl'
              }`}
              style={{ fontFamily: titleFont }}
            >
              {lang === 'JP'
                ? 'デザイン・戦略・テクノロジーを横断する機能'
                : 'World-Class Capabilities Across Design, Strategy, & Tech'}
            </h2>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 pt-2">
            {activeCategories.map((cat) => {
              const isActive = selectedCategory === cat || (selectedCategory === 'All' && cat === 'すべて');
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat === 'すべて' ? 'All' : cat)}
                  className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
                    isActive
                      ? 'bg-black text-white dark:bg-[#FFE100] dark:text-black shadow-md'
                      : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                  }`}
                  style={{ fontFamily: titleFont }}
                >
                  {cat.toUpperCase()}
                </button>
              );
            })}
          </div>

          <motion.div layout className="flex flex-wrap justify-center items-start content-start gap-3 pt-4 min-h-[160px]">
            <AnimatePresence>
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="inline-flex items-center space-x-2 px-4 py-2 h-fit rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFE100] flex-none" />
                  <span
                    className="text-sm font-medium text-zinc-800 dark:text-zinc-200 whitespace-nowrap"
                    style={{ fontFamily: titleFont }}
                  >
                    {lang === 'JP' && item.nameJp ? item.nameJp : item.name}
                  </span>
                  {(selectedCategory === 'All' || selectedCategory === 'すべて') && (
                    <span className="text-[10px] font-mono uppercase text-zinc-400 ml-1 whitespace-nowrap">
                      • {item.category}
                    </span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* 6. CTA Section */}
        <section className="px-8 md:px-16 pt-16 pb-12 space-y-8 max-w-4xl mx-auto w-full flex flex-col lg:items-center">
          <div className="text-left lg:text-center w-full">
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              // GLOBAL CRAFT & PARTNERSHIP
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

          <p className="text-base text-zinc-600 dark:text-zinc-400 text-left lg:text-center max-w-xl mx-auto font-sans leading-relaxed" style={{ fontFamily: bodyFont }}>
            {lang === 'JP' ? (
              <>
                Converse、Nike、Adidas、Disney、楽天といった世界的なブランドのプロダクト設計や、東京・APACでのSaaS事業創業など、20年以上の実績を結集。野心的なチームと連携し、インパクトのあるデジタル体験を構築・拡張します。まずはお気軽にご相談ください。
              </>
            ) : (
              <>
                With over 20 years of experience shaping products for iconic global brands—including Converse, Nike, Adidas, Disney, and Rakuten—as well as founding SaaS ventures across Tokyo and APAC, we partner with ambitious teams to design, build, and scale high-impact digital experiences. Reach out and let&apos;s start a conversation.
              </>
            )}
          </p>

          <div className="pt-4 text-left lg:text-center w-full flex justify-start lg:justify-center">
            <a
              href="https://calendar.app.google/kEdQJyu5r68NhBjt9"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full lg:w-auto text-center px-10 py-4 bg-black text-white dark:bg-white dark:text-black font-semibold tracking-wider text-base rounded-[4px] hover:-translate-y-1 hover:bg-[#FFE100] dark:hover:bg-[#FFE100] hover:text-black transition-all duration-500"
              style={{ fontFamily: titleFont }}
            >
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
