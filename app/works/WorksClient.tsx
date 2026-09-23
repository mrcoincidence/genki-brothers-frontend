// app/works/WorksClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import HeaderLogo from '../components/HeaderLogo';
import { useTheme } from '../components/ThemeProvider';
import { useLanguage } from '../components/LanguageContext';

const WP_GRAPHQL_URL = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL || 'https://api.genkibrothers.co/graphql';

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
    whyStarted?: string;
  };
}

interface ArchiveItem {
  brand: string;
  url: string;
  role: string;
  delivery: string;
  year: string;
}

const archiveList: ArchiveItem[] = [
  { brand: 'Landit', url: 'https://landit.co.jp/', role: 'Creative & UX/UI', delivery: 'Product Launch', year: '2025' },
  { brand: 'Manabu Kun', url: '', role: 'Strategy, Creative & UX/UI', delivery: 'SaaS Launch', year: '2023' },
  { brand: 'AI Speech Tool', url: '', role: 'Strategy, Creative & UX/UI', delivery: 'SaaS Launch', year: '2023' },
  { brand: 'Opetra', url: '', role: 'Strategy, Creative & UX/UI', delivery: 'SaaS Launch', year: '2022' },
  { brand: 'Connect', url: 'https://getconnect.me/', role: 'Strategy, Creative & UX/UI', delivery: 'Startup', year: '2021' },
  { brand: 'ION-Sei', url: '', role: 'Strategy, Creative & UX/UI', delivery: 'Branding, E commerce', year: '2018' },
  { brand: 'Better Labs', url: '', role: 'Strategy & UX/UI', delivery: 'E commerce', year: '2018' },
  { brand: 'Koala Bear Hair', url: '', role: 'Strategy & UX/UI', delivery: 'E commerce', year: '2018' },
  { brand: 'Bloo Vision', url: 'https://bloo.vision/', role: 'Strategy, Creative & UX/UI', delivery: 'Startup', year: '2017' },
  { brand: 'Nutricia EC Site', url: 'https://www.nutricia.com/', role: 'Strategy & UX/UI', delivery: 'E commerce', year: '2017' },
  { brand: 'Adidas Hackathon', url: '', role: 'Creative & UX/UI', delivery: 'Web Application', year: '2016' },
  { brand: 'Herschel China Launch', url: 'https://herschel.com.cn', role: 'Strategy, Creative & UX/UI', delivery: 'E commerce', year: '2016' },
  { brand: 'Airbnb China Social Campaign', url: '', role: 'Creative & UX/UI', delivery: 'Web Campaign', year: '2015' },
  { brand: 'Converse China Website Renewal', url: 'https://www.converse.com.cn/', role: 'Strategy & UX/UI', delivery: 'E commerce', year: '2015' },
  { brand: 'Converse APAC Website Governance', url: '', role: 'Strategy & UX/UI', delivery: 'E commerce', year: '2015' },
  { brand: 'Converse Made By You', url: '', role: 'Creative & UX/UI', delivery: 'Web Campaign', year: '2015' },
  { brand: 'Pacific Epoch', url: '', role: 'Strategy & UX/UI', delivery: 'Web Application', year: '2015' },
  { brand: 'Converse Sneaker Clash', url: '', role: 'Creative & UX/UI', delivery: 'Event & Campaign', year: '2014' },
  { brand: 'Converse Sneaker App', url: '', role: 'Strategy & UX/UI', delivery: 'Product Launch', year: '2014' },
  { brand: 'Budweiser ETV', url: 'https://vimeo.com/435056229?', role: 'Creative & UX/UI', delivery: 'Retail Installation', year: '2014' },
  { brand: 'Converse Summer Sales Campaign', url: '', role: 'Creative & UX/UI', delivery: 'E commerce & Campaign', year: '2014' },
  { brand: 'Converse WWUD Campaign', url: '', role: 'Creative & UX/UI', delivery: 'E commerce & Campaign', year: '2014' },
  { brand: 'Interactive Mirror', url: 'https://vimeo.com/257467152', role: 'Strategy & UX/UI', delivery: 'Product Launch', year: '2014' },
  { brand: 'Nike Free', url: 'https://vimeo.com/121365902', role: 'Creative & UX/UI', delivery: 'Retail Installation', year: '2013' },
  { brand: 'Converse John Varvatos Launch', url: '', role: 'Strategy & UX/UI', delivery: 'E commerce & Web Application', year: '2013' },
  { brand: 'Converse Get Loud Campaign', url: '', role: 'Creative & UX/UI', delivery: 'Event & Campaign', year: '2013' },
  { brand: 'Jaguar X 007 Campaign', url: '', role: 'Creative & UX/UI', delivery: 'Web Campaign', year: '2012' },
  { brand: 'KMS California', url: 'https://www.kmshair.com/', role: 'UX/UI', delivery: 'Web Site', year: '2011' },
  { brand: 'Pele Sports', url: 'https://www.instagram.com/pelesports/', role: 'UX/UI', delivery: 'Web Site', year: '2010' },
  { brand: 'Tokyo Disney Resort', url: 'https://www.tokyodisneyresort.jp/', role: 'Strategy & UX/UI', delivery: 'E commerce & Web Application', year: '2008' },
  { brand: 'Xlarge', url: 'https://xlarge.jp/', role: 'Strategy & UX/UI', delivery: 'E commerce', year: '2007' },
  { brand: 'Docomo', url: 'https://www.docomo.ne.jp/', role: 'UX/UI', delivery: 'Web Application', year: '2006' },
  { brand: 'Castrol', url: 'https://www.castrol.com/ja_jp/japan/home.html', role: 'UX/UI', delivery: 'Blog Widget', year: '2006' },
  { brand: 'Rakuten', url: 'https://www.rakuten.co.jp/', role: 'UX/UI', delivery: 'E Commerce', year: '2005' },
];

function isJapaneseWork(work: WorkNode): boolean {
  if (!work) return false;
  const jpRegex = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/;
  const hasJpChar =
    jpRegex.test(work.title || '') ||
    jpRegex.test(work.workDetails?.brand || '') ||
    jpRegex.test(work.workDetails?.thumbnailLabel || '') ||
    jpRegex.test(work.workDetails?.metaClient || '');
  const linkUrl = work.link || work.uri || '';
  const hasJaInUrl = linkUrl.includes('/ja/') || linkUrl.includes('/jp/');
  const slug = work.slug || '';
  const hasJaInSlug =
    slug.endsWith('-2') ||
    slug.endsWith('-ja') ||
    slug.endsWith('-jp') ||
    slug.includes('-ja-') ||
    slug.includes('-jp-');
  return hasJpChar || hasJaInUrl || hasJaInSlug;
}

export default function WorksClient({
  selectedWorks: initialSelected,
  startupWorks: initialStartups,
}: {
  selectedWorks: WorkNode[];
  startupWorks: WorkNode[];
}) {
  const [showHeader, setShowHeader] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const { lang, setLang } = useLanguage();
  
  const [selectedWorks, setSelectedWorks] = useState<WorkNode[]>(initialSelected);
  const [startupWorks, setStartupWorks] = useState<WorkNode[]>(initialStartups);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    async function fetchWorksByLang() {
      setLoading(true);
      const langCode = lang === 'JP' ? 'JA' : 'EN';
      const query = `
        query GetWorksByLang($language: LanguageCodeFilterEnum!) {
          works(first: 50, where: { language: $language, orderby: { field: DATE, order: DESC } }) {
            nodes {
              id
              title
              slug
              uri
              link
              featuredImage { node { sourceUrl } }
              workDetails { brand thumbnailLabel metaClient metaYear whyStarted }
            }
          }
        }
      `;

      try {
        const res = await fetch(WP_GRAPHQL_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, variables: { language: langCode } }),
        });
        const json = await res.json();
        if (json.data?.works?.nodes) {
          const nodes: WorkNode[] = json.data.works.nodes;
          const selected = nodes.filter((w) => !w.workDetails?.metaYear && !w.workDetails?.whyStarted);
          const startups = nodes.filter((w) => w.workDetails?.metaYear || w.workDetails?.whyStarted);
          setSelectedWorks(selected);
          setStartupWorks(startups);
        } else {
          const isJp = lang === 'JP';
          setSelectedWorks(initialSelected.filter((w) => (isJp ? isJapaneseWork(w) : !isJapaneseWork(w))));
          setStartupWorks(initialStartups.filter((w) => (isJp ? isJapaneseWork(w) : !isJapaneseWork(w))));
        }
      } catch (err) {
        const isJp = lang === 'JP';
        setSelectedWorks(initialSelected.filter((w) => (isJp ? isJapaneseWork(w) : !isJapaneseWork(w))));
        setStartupWorks(initialStartups.filter((w) => (isJp ? isJapaneseWork(w) : !isJapaneseWork(w))));
      } finally {
        setLoading(false);
      }
    }

    fetchWorksByLang();
  }, [lang, initialSelected, initialStartups]);

  return (
    <main className="min-h-screen bg-white text-black dark:bg-[#0a0a0c] dark:text-white transition-colors duration-500 relative overflow-x-hidden selection:bg-[#FFE100] selection:text-black">
      
      {/* Header Nav */}
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
          <a href="/works" className="text-black dark:text-[#FFE100] font-bold transition-colors">Works</a>
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
          <a href="/works" onClick={() => setMenuOpen(false)} className="text-black dark:text-[#FFE100] font-bold">Works</a>
          <a href="/articles" onClick={() => setMenuOpen(false)} className="hover:text-[#FFE100] transition-colors">Articles</a>
          <a href="/playground" onClick={() => setMenuOpen(false)} className="hover:text-[#FFE100] transition-colors">Playground</a>
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

      <article className="pt-36 pb-32 space-y-32 md:space-y-40">
        
        {/* 1. Hero Title */}
        <header className="px-8 md:px-16 max-w-5xl mx-auto space-y-6 w-full pt-8">
          <div className="text-left lg:text-center w-full">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              // WORKS
            </span>
          </div>
          <h1
            className={`font-medium tracking-tight text-left lg:text-center ${
              lang === 'JP' ? 'text-3xl md:text-5xl lg:text-[64px] leading-[1.28]' : 'text-4xl md:text-6xl lg:text-7xl leading-[1.12]'
            }`}
            style={{ fontFamily: titleFont }}
          >
            {lang === 'JP'
              ? 'インパクトのあるデジタル体験とスケールするWebプロダクトの構築。'
              : 'Building High-Impact Digital Experiences & Scalable Web Products.'}
          </h1>
          <p
            className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-left lg:text-center leading-relaxed"
            style={{ fontFamily: bodyFont }}
          >
            {lang === 'JP'
              ? 'グローバルブランドのキャンペーンからSaaSプラットフォーム、自社新規事業まで、成長に特化したデジタルアーキテクチャを設計します。'
              : 'From global brand campaigns to SaaS platforms and venture builds, we engineer digital architecture tailored for growth.'}
          </p>
        </header>

        {/* 2. Selected Case Studies */}
        <section className="px-8 md:px-16 max-w-7xl mx-auto w-full space-y-12">
          <div className="flex flex-col items-center text-center space-y-3">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              // FEATURED
            </span>
            <h2
              className={`font-medium tracking-tight ${lang === 'JP' ? 'text-2xl md:text-4xl lg:text-[40px] leading-[1.38]' : 'text-3xl md:text-4xl'}`}
              style={{ fontFamily: titleFont }}
            >
              {lang === 'JP' ? 'ケーススタディ' : 'Selected Case Studies'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[2/3] w-full rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse border border-zinc-200 dark:border-zinc-800" />
              ))
            ) : selectedWorks && selectedWorks.length > 0 ? (
              selectedWorks.map((item) => {
                const imageUrl = item.featuredImage?.node?.sourceUrl || '';
                const brandName = item.workDetails?.brand || 'WORK';
                const label = item.workDetails?.thumbnailLabel || item.workDetails?.metaClient || 'PROJECT';

                return (
                  <a key={item.id} href={`/works/${item.slug}`} className="group/card relative block">
                    <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/50 shadow-md">
                      <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 via-zinc-300 to-zinc-200 dark:from-zinc-800 dark:via-zinc-900 dark:to-black transition-transform duration-[2000ms] ease-out group-hover/card:scale-105 flex items-center justify-center">
                        <span className="text-5xl font-bold text-zinc-500 dark:text-zinc-800 uppercase tracking-tighter select-none" style={{ fontFamily: titleFont }}>
                          {brandName}
                        </span>
                      </div>

                      {imageUrl && (
                        <img src={imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover/card:scale-105" />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 opacity-90 transition-opacity duration-300 pointer-events-none" />

                      <div className="absolute inset-0 p-8 flex flex-col justify-between z-10 pointer-events-none">
                        <div className="flex justify-start items-center">
                          <span className="text-xs font-bold uppercase tracking-wider text-black bg-white/90 backdrop-blur-md px-3.5 py-1 rounded-full shadow-sm" style={{ fontFamily: titleFont }}>
                            {label.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs uppercase tracking-widest text-[#FFE100] block mb-1 font-medium" style={{ fontFamily: titleFont }}>
                            {brandName.toUpperCase()}
                          </span>
                          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white capitalize group-hover/card:underline" style={{ fontFamily: titleFont }}>
                            {item.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })
            ) : (
              <div className="col-span-2 text-center text-zinc-500 font-mono py-12">No Works Found.</div>
            )}
          </div>
        </section>

        {/* 3. Own Startups */}
        <section className="px-8 md:px-16 max-w-7xl mx-auto w-full space-y-12">
          <div className="flex flex-col items-center text-center space-y-3">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              // VENTURES
            </span>
            <h2
              className={`font-medium tracking-tight ${lang === 'JP' ? 'text-2xl md:text-4xl lg:text-[40px] leading-[1.38]' : 'text-3xl md:text-4xl'}`}
              style={{ fontFamily: titleFont }}
            >
              {lang === 'JP' ? '自社プロダクト・事業' : 'Own Startups'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {startupWorks && startupWorks.length > 0 ? (
              startupWorks.map((item) => {
                const imageUrl = item.featuredImage?.node?.sourceUrl || '';
                const brandName = item.workDetails?.brand || 'STARTUP';
                const label = item.workDetails?.thumbnailLabel || (lang === 'JP' ? '自社事業' : 'OWN STARTUP');

                return (
                  <a key={item.id} href={`/works/${item.slug}`} className="group/card relative block">
                    <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/50 shadow-md">
                      <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 via-zinc-300 to-zinc-200 dark:from-zinc-800 dark:via-zinc-900 dark:to-black transition-transform duration-[2000ms] ease-out group-hover/card:scale-105 flex items-center justify-center">
                        <span className="text-5xl font-bold text-zinc-500 dark:text-zinc-800 uppercase tracking-tighter select-none" style={{ fontFamily: titleFont }}>
                          {brandName}
                        </span>
                      </div>

                      {imageUrl && (
                        <img src={imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover/card:scale-105" />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 opacity-90 transition-opacity duration-300 pointer-events-none" />

                      <div className="absolute inset-0 p-8 flex flex-col justify-between z-10 pointer-events-none">
                        <div className="flex justify-start items-center">
                          <span className="text-xs font-bold uppercase tracking-wider text-black bg-[#FFE100] px-3.5 py-1 rounded-full shadow-sm" style={{ fontFamily: titleFont }}>
                            {label.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs uppercase tracking-widest text-[#FFE100] block mb-1 font-medium" style={{ fontFamily: titleFont }}>
                            {brandName.toUpperCase()}
                          </span>
                          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white capitalize group-hover/card:underline" style={{ fontFamily: titleFont }}>
                            {item.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })
            ) : (
              [1, 2].map((i) => (
                <div key={i} className="aspect-[2/3] w-full rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse border border-zinc-200 dark:border-zinc-800" />
              ))
            )}
          </div>
        </section>

        {/* 4. Archive */}
        <section className="px-8 md:px-16 max-w-7xl mx-auto w-full space-y-12">
          <div className="flex flex-col items-center text-center space-y-3">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              // CHRONOLOGY
            </span>
            <h2
              className={`font-medium tracking-tight ${lang === 'JP' ? 'text-2xl md:text-4xl lg:text-[40px] leading-[1.38]' : 'text-3xl md:text-4xl'}`}
              style={{ fontFamily: titleFont }}
            >
              {lang === 'JP' ? 'プロジェクト アーカイブ' : 'Project Archive'}
            </h2>
          </div>

          <div className="w-full border-t border-zinc-200/80 dark:border-zinc-800/80">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="border-b border-zinc-200/60 dark:border-zinc-800/60 text-xs font-semibold text-zinc-400 uppercase tracking-widest" style={{ fontFamily: titleFont }}>
                  <th className="py-5 pr-4 w-full sm:w-[50%] lg:w-[30%]">{lang === 'JP' ? 'ブランド' : 'Brand'}</th>
                  <th className="py-5 px-4 hidden lg:table-cell w-[30%]">{lang === 'JP' ? '役割' : 'Role'}</th>
                  <th className="py-5 px-4 hidden sm:table-cell sm:w-[35%] lg:w-[30%]">{lang === 'JP' ? '提供価値' : 'Deliverables'}</th>
                  <th className="py-5 pl-4 text-right w-[15%] sm:w-[15%] lg:w-[10%]">{lang === 'JP' ? '年' : 'Year'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/40 dark:divide-zinc-800/40">
                {archiveList.map((item, idx) => (
                  <tr key={idx} className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
                    <td className="py-5 pr-4 font-medium text-base truncate" style={{ fontFamily: titleFont }}>
                      {item.url ? (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#FFE100] transition-colors inline-flex items-center gap-1.5 truncate">
                          <span className="truncate">{item.brand}</span>
                          <span className="text-xs text-zinc-400 opacity-60 group-hover:opacity-100 transition-opacity">↗</span>
                        </a>
                      ) : (
                        <span className="truncate">{item.brand}</span>
                      )}
                    </td>
                    <td className="py-5 px-4 hidden lg:table-cell text-base text-zinc-600 dark:text-zinc-400 truncate" style={{ fontFamily: bodyFont }}>
                      {item.role}
                    </td>
                    <td className="py-5 px-4 hidden sm:table-cell text-base text-zinc-600 dark:text-zinc-400 truncate" style={{ fontFamily: bodyFont }}>
                      {item.delivery}
                    </td>
                    <td className="py-5 pl-4 text-right font-mono text-base text-zinc-500">
                      {item.year}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 5. Video Production Work */}
        <section className="px-8 md:px-16 max-w-4xl mx-auto w-full">
          <div className="p-10 md:p-16 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col items-center text-center space-y-6 backdrop-blur-md">
            <div className="flex items-center space-x-3">
              <svg className="w-8 h-8 fill-current text-[#1AB7EA]" viewBox="0 0 24 24">
                <path d="M22.396 7.164c-.093 2.026-1.507 4.8-4.245 8.32-2.82 3.633-5.205 5.449-7.158 5.449-1.21 0-2.238-.112-3.085-1.336-.583-.842-1.166-2.527-1.75-5.053-.668-2.613-1.336-3.921-2.003-3.921-.148 0-.668.31-1.56 1.035L1 10.222c.983-.865 1.954-1.729 2.913-2.593 1.313-1.137 2.302-1.729 2.969-1.777 1.577-.144 2.548.824 2.913 2.912.483 2.613.818 4.237 1.003 4.872.482 1.83 1.035 2.745 1.66 2.745.508 0 1.258-.809 2.25-2.428 1.002-1.619 1.543-2.82 1.623-3.603.148-1.21-.346-1.817-1.483-1.817-.532 0-1.112.12-1.74.363 1.09-3.57 3.143-5.326 6.16-5.267 2.258.04 3.328 1.348 3.21 3.927z" />
              </svg>
              <span className="text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                // MOTION & FILM
              </span>
            </div>

            <h2
              className={`font-medium tracking-tight max-w-2xl ${lang === 'JP' ? 'text-2xl md:text-4xl leading-[1.38]' : 'text-2xl md:text-4xl'}`}
              style={{ fontFamily: titleFont }}
            >
              {lang === 'JP' ? 'Webにとどまらない、映像のディレクションとプロデュース。' : 'Beyond Digital: We Direct & Produce Video Content.'}
            </h2>

            <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-xl" style={{ fontFamily: bodyFont }}>
              {lang === 'JP'
                ? 'ブランドフィルムやコマーシャルインスタレーションからインタラクティブ映像システムまで。Vimeoにて映像作品をご覧いただけます。'
                : 'From brand films and commercial installations to interactive video systems. Explore our motion and direction work on Vimeo.'}
            </p>

            <div className="pt-2">
              <a
                href="https://vimeo.com/genkibros"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-black text-white dark:bg-white dark:text-black font-semibold tracking-wider text-base rounded-[4px] hover:-translate-y-1 hover:bg-[#FFE100] dark:hover:bg-[#FFE100] hover:text-black transition-all duration-500 shadow-md"
                style={{ fontFamily: titleFont }}
              >
                {lang === 'JP' ? 'Vimeoで動画を見る ↗' : 'Watch on Vimeo ↗'}
              </a>
            </div>
          </div>
        </section>

        {/* 6. CTA */}
        <section className="px-8 md:px-16 pt-24 pb-12 space-y-8 max-w-4xl mx-auto w-full flex flex-col lg:items-center">
          <div className="text-left lg:text-center w-full">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              // LET&apos;S BUILD TOGETHER
            </span>
          </div>
          <h2
            className={`font-medium tracking-tight text-left lg:text-center w-full ${lang === 'JP' ? 'text-[26px] md:text-[40px] leading-[1.38]' : 'text-[32px] md:text-[48px] leading-tight'}`}
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