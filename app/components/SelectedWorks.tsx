// app/components/SelectedWorks.tsx
'use client';

import { useState, useEffect, useRef } from 'react';

const WP_GRAPHQL_URL = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL || 'https://api.genkibrothers.co/graphql';

interface WorkItem {
  id: string;
  slug: string;
  title: string;
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

export default function SelectedWorks({ lang = 'EN' }: { lang?: 'EN' | 'JP' }) {
  const [works, setWorks] = useState<WorkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const titleFont = lang === 'JP' ? 'var(--font-biz-udpgothic), sans-serif' : 'var(--font-outfit), sans-serif';

  useEffect(() => {
    async function fetchWorks() {
      setLoading(true);

      const langCode = lang === 'JP' ? 'JA' : 'EN';

      const query = `
        query GetSelectedWorks($language: LanguageCodeFilterEnum!) {
          works(first: 20, where: { language: $language, orderby: { field: DATE, order: DESC } }) {
            nodes {
              id
              title
              slug
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
          body: JSON.stringify({
            query,
            variables: { language: langCode },
          }),
        });
        const json = await res.json();

        if (json.data?.works?.nodes) {
          const clientWorks = json.data.works.nodes
            .filter((w: WorkItem) => !w.workDetails?.metaYear && !w.workDetails?.whyStarted)
            .slice(0, 4);

          setWorks(clientWorks);
        }
      } catch (err) {
        console.error('Failed to fetch selected works:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchWorks();
  }, [lang]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const maxScroll = target.scrollWidth - target.clientWidth;
    if (maxScroll > 0) {
      setScrollProgress(target.scrollLeft / maxScroll);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) carouselRef.current.scrollBy({ left: -400, behavior: 'smooth' });
  };
  const scrollRight = () => {
    if (carouselRef.current) carouselRef.current.scrollBy({ left: 400, behavior: 'smooth' });
  };

  return (
    <section id="works" className="relative z-10 py-32 md:py-44 bg-transparent overflow-hidden">
      {/* セクションヘッダー */}
      <div className="px-8 md:px-16 mb-16 text-left lg:text-center max-w-4xl mx-auto w-full space-y-4">
        <span
          className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1"
          style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
        >
          // SELECTED WORKS
        </span>

        {/* 追加されたリードタイトル (日本語Line Height拡張) */}
        <h2
          className={`font-medium tracking-tight text-black dark:text-white ${
            lang === 'JP'
              ? 'text-2xl md:text-4xl lg:text-[40px] leading-[1.38]'
              : 'text-3xl md:text-5xl leading-tight'
          }`}
          style={{ fontFamily: titleFont }}
        >
          {lang === 'JP'
            ? 'グローバルブランドのケーススタディ。'
            : 'Case Studies from Global Brands.'}
        </h2>
      </div>

      <div className="relative group">
        <div
          ref={carouselRef}
          onScroll={handleScroll}
          className="flex space-x-6 md:space-x-8 px-8 md:px-16 overflow-x-auto scrollbar-none scroll-smooth py-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-none w-[75vw] md:w-[calc(45vw-3rem)] lg:w-[420px] aspect-[2/3] rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
            ))
          ) : (
            works.map((work) => {
              const imageUrl = work.featuredImage?.node?.sourceUrl || '';
              const brandName = work.workDetails?.brand || 'WORK';
              const label = work.workDetails?.thumbnailLabel || work.workDetails?.metaClient || 'PROJECT';

              return (
                <a
                  key={work.id}
                  href={`/works/${work.slug}`}
                  className="flex-none w-[75vw] md:w-[calc(45vw-3rem)] lg:w-[420px] group/card relative block"
                >
                  <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/50 shadow-md">
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 via-zinc-300 to-zinc-200 dark:from-zinc-800 dark:via-zinc-900 dark:to-black transition-transform duration-[2000ms] ease-out group-hover/card:scale-105 flex items-center justify-center">
                      <span
                        className="text-4xl font-bold text-zinc-500 dark:text-zinc-800 uppercase tracking-tighter select-none"
                        style={{ fontFamily: titleFont }}
                      >
                        {brandName}
                      </span>
                    </div>

                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={work.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover/card:scale-105"
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 opacity-90 transition-opacity duration-300 pointer-events-none" />

                    <div className="absolute inset-0 p-7 flex flex-col justify-between z-10 pointer-events-none">
                      <div className="flex justify-start items-center">
                        <span
                          className="text-xs font-bold uppercase tracking-wider text-black bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm"
                          style={{ fontFamily: titleFont }}
                        >
                          {label.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span
                          className="text-xs uppercase tracking-widest text-[#FFE100] block mb-1 font-medium"
                          style={{ fontFamily: titleFont }}
                        >
                          {brandName.toUpperCase()}
                        </span>
                        <h3
                          className="text-2xl md:text-3xl font-bold tracking-tight text-white capitalize group-hover/card:underline"
                          style={{ fontFamily: titleFont }}
                        >
                          {work.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })
          )}
        </div>

        {/* ナビゲーションボタン */}
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-6 z-20">
          <button
            onClick={scrollLeft}
            className={`pointer-events-auto w-12 h-12 rounded-full bg-black/60 dark:bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-300 hover:bg-[#FFE100] hover:text-black hover:border-[#FFE100] ${
              scrollProgress > 0.05 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
            }`}
          >
            <span className="text-base font-bold" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>&lt;</span>
          </button>
          <button
            onClick={scrollRight}
            className={`pointer-events-auto w-12 h-12 rounded-full bg-black/60 dark:bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-300 hover:bg-[#FFE100] hover:text-black hover:border-[#FFE100] ${
              scrollProgress < 0.95 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
            }`}
          >
            <span className="text-base font-bold" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>&gt;</span>
          </button>
        </div>
      </div>
    </section>
  );
}