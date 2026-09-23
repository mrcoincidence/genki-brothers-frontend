// app/articles/ArticlesClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import HeaderLogo from '../components/HeaderLogo';
import { useTheme } from '../components/ThemeProvider';
import { useLanguage } from '../components/LanguageContext';

const WP_GRAPHQL_URL = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL || 'https://api.genkibrothers.co/graphql';

interface ArticleNode {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt?: string;
  content?: string;
  uri?: string;
  link?: string;
  featuredImage?: {
    node?: {
      sourceUrl: string;
    };
  };
  categories?: {
    nodes?: { name: string }[];
  };
}

function calculateReadingTime(content?: string): number {
  if (!content) return 2;
  const plainText = content.replace(/<[^>]*>/g, '').trim();
  const words = plainText.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function isJapaneseArticle(article: ArticleNode): boolean {
  if (!article) return false;
  const jpRegex = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/;
  const titleHasJp = jpRegex.test(article.title || '');
  const excerptHasJp = jpRegex.test(article.excerpt || '');
  const linkUrl = article.link || article.uri || '';
  const hasJaInUrl = linkUrl.includes('/ja/') || linkUrl.includes('/jp/');
  const slug = article.slug || '';
  const hasJaInSlug =
    slug.endsWith('-2') ||
    slug.endsWith('-ja') ||
    slug.endsWith('-jp') ||
    slug.includes('-ja-') ||
    slug.includes('-jp-');
  return titleHasJp || excerptHasJp || hasJaInUrl || hasJaInSlug;
}

export default function ArticlesClient({
  featuredArticles: initialFeatured,
  remainingArticles: initialRemaining,
}: {
  featuredArticles: ArticleNode[];
  remainingArticles: ArticleNode[];
  allArticles?: ArticleNode[];
}) {
  const [showHeader, setShowHeader] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const { lang, setLang } = useLanguage();
  
  const [featuredArticles, setFeaturedArticles] = useState<ArticleNode[]>(initialFeatured);
  const [remainingArticles, setRemainingArticles] = useState<ArticleNode[]>(initialRemaining);
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
    async function fetchArticlesByLang() {
      setLoading(true);
      const langCode = lang === 'JP' ? 'JA' : 'EN';
      const query = `
        query GetArticlesByLang($language: LanguageCodeFilterEnum!) {
          posts(first: 30, where: { language: $language, orderby: { field: DATE, order: DESC } }) {
            nodes {
              id
              title
              slug
              date
              excerpt
              content
              uri
              link
              featuredImage { node { sourceUrl } }
              categories { nodes { name } }
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
        if (json.data?.posts?.nodes && json.data.posts.nodes.length > 0) {
          const nodes: ArticleNode[] = json.data.posts.nodes;
          setFeaturedArticles(nodes.slice(0, 2));
          setRemainingArticles(nodes.slice(2));
        } else {
          const isJp = lang === 'JP';
          const filteredAll = [...initialFeatured, ...initialRemaining].filter((a) =>
            isJp ? isJapaneseArticle(a) : !isJapaneseArticle(a)
          );
          setFeaturedArticles(filteredAll.slice(0, 2));
          setRemainingArticles(filteredAll.slice(2));
        }
      } catch (err) {
        const isJp = lang === 'JP';
        const filteredAll = [...initialFeatured, ...initialRemaining].filter((a) =>
          isJp ? isJapaneseArticle(a) : !isJapaneseArticle(a)
        );
        setFeaturedArticles(filteredAll.slice(0, 2));
        setRemainingArticles(filteredAll.slice(2));
      } finally {
        setLoading(false);
      }
    }

    fetchArticlesByLang();
  }, [lang, initialFeatured, initialRemaining]);

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
          <a href="/articles" className="text-black dark:text-[#FFE100] font-bold transition-colors">Articles</a>
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
          <a href="/articles" onClick={() => setMenuOpen(false)} className="text-black dark:text-[#FFE100] font-bold">Articles</a>
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

      <article className="pt-36 pb-32 space-y-24 md:space-y-36">
        
        {/* 1. Hero Title */}
        <header className="px-8 md:px-16 max-w-5xl mx-auto space-y-6 w-full pt-8">
          <div className="text-left lg:text-center w-full">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              // ARTICLES
            </span>
          </div>
          <h1
            className={`font-medium tracking-tight text-left lg:text-center ${
              lang === 'JP' ? 'text-3xl md:text-5xl lg:text-[64px] leading-[1.28]' : 'text-4xl md:text-6xl lg:text-7xl leading-[1.12]'
            }`}
            style={{ fontFamily: titleFont }}
          >
            {lang === 'JP'
              ? 'デザイン、テクノロジー、カルチャーに関するオープンな思考。'
              : 'Open Source Thoughts On Design, Tech, And Culture.'}
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-left lg:text-center leading-relaxed" style={{ fontFamily: bodyFont }}>
            {lang === 'JP'
              ? '多様な専門性を持つチームの視点とメソッド。'
              : 'Perspectives and methodologies from our multidisciplinary team.'}
          </p>
        </header>

        {/* 2. Featured Articles */}
        <section className="px-8 md:px-16 max-w-7xl mx-auto w-full space-y-10">
          <div className="flex flex-col items-center text-center space-y-2">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              // FEATURED STORIES
            </span>
            <h2
              className={`font-medium tracking-tight ${lang === 'JP' ? 'text-2xl md:text-4xl lg:text-[40px] leading-[1.38]' : 'text-3xl md:text-4xl'}`}
              style={{ fontFamily: titleFont }}
            >
              {lang === 'JP' ? '注目の記事' : 'Selected Articles'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
            {loading ? (
              [1, 2].map((i) => (
                <div key={i} className="aspect-[16/10] w-full rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse border border-zinc-200 dark:border-zinc-800" />
              ))
            ) : featuredArticles && featuredArticles.length > 0 ? (
              featuredArticles.map((item) => {
                const imageUrl = item.featuredImage?.node?.sourceUrl || '';
                const category = item.categories?.nodes?.[0]?.name || 'ARTICLE';
                const readTime = calculateReadingTime(item.content);
                const excerptText = item.excerpt?.replace(/<[^>]*>/g, '').slice(0, 140) + '...';

                return (
                  <a key={item.id} href={`/articles/${item.slug}`} className="group/card relative block space-y-5">
                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/50 shadow-md">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover/card:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center text-zinc-500 font-bold uppercase text-2xl">
                          ARTICLE
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 px-1">
                      <div className="flex items-center space-x-3 text-xs font-semibold uppercase tracking-wider text-black dark:text-[#FFE100]" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                        <span className="border-b border-[#FFE100] pb-0.5">{category.toUpperCase()}</span>
                        <span className="text-zinc-400">•</span>
                        <span className="text-zinc-500 font-mono text-xs">{lang === 'JP' ? `読了時間 ${readTime}分` : `READ ${readTime} MIN`}</span>
                      </div>

                      <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-black dark:text-white group-hover/card:underline leading-snug" style={{ fontFamily: titleFont }}>
                        {item.title}
                      </h3>

                      {excerptText && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2" style={{ fontFamily: bodyFont }}>
                          {excerptText}
                        </p>
                      )}
                    </div>
                  </a>
                );
              })
            ) : (
              <div className="col-span-2 text-center text-zinc-500 font-mono py-12">No Articles Found.</div>
            )}
          </div>
        </section>

        {/* 3. Other Articles */}
        <section className="px-8 md:px-16 max-w-7xl mx-auto w-full space-y-12 pt-8">
          <div className="pt-16 border-t border-zinc-200/60 dark:border-zinc-800/60 space-y-10">
            
            <div className="flex flex-col items-center text-center space-y-2">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                // ARCHIVE & MORE
              </span>
              <h2
                className={`font-medium tracking-tight ${lang === 'JP' ? 'text-2xl md:text-4xl lg:text-[40px] leading-[1.38]' : 'text-3xl md:text-4xl'}`}
                style={{ fontFamily: titleFont }}
              >
                {lang === 'JP' ? 'すべての記事' : 'All Articles'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {remainingArticles && remainingArticles.length > 0 ? (
                remainingArticles.map((item) => {
                  const itemImgUrl = item.featuredImage?.node?.sourceUrl || '';
                  const itemCategory = item.categories?.nodes?.[0]?.name || 'ARTICLE';

                  return (
                    <a key={item.id} href={`/articles/${item.slug}`} className="group/card relative block">
                      <div className="relative aspect-[3/2] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/50 shadow-md">
                        
                        {itemImgUrl ? (
                          <img
                            src={itemImgUrl}
                            alt={item.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover/card:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center text-zinc-500 font-bold uppercase text-lg">
                            ARTICLE
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 opacity-90 transition-opacity duration-300 pointer-events-none" />

                        <div className="absolute inset-0 p-6 flex flex-col justify-between z-10 pointer-events-none">
                          <div className="flex justify-start items-center">
                            <span
                              className="text-xs font-bold uppercase tracking-wider text-black bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm"
                              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
                            >
                              {itemCategory.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3
                              className="text-xl md:text-2xl font-bold tracking-tight text-white group-hover/card:underline leading-snug"
                              style={{ fontFamily: titleFont }}
                            >
                              {item.title}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </a>
                  );
                })
              ) : (
                [1, 2, 3].map((_, idx) => (
                  <div key={idx} className="aspect-[3/2] w-full rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse border border-zinc-200 dark:border-zinc-800" />
                ))
              )}
            </div>
          </div>
        </section>

        {/* 4. CTA */}
        <section className="px-8 md:px-16 pt-16 pb-12 space-y-8 max-w-4xl mx-auto w-full flex flex-col lg:items-center">
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