// app/works/[slug]/WorkDetailClient.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const getEmbedUrl = (url: string) => {
  if (!url) return '';
  if (url.includes('youtube.com/watch?v=')) return url.replace('watch?v=', 'embed/');
  if (url.includes('youtu.be/')) return url.replace('youtu.be/', 'www.youtube.com/embed/');
  if (url.includes('vimeo.com/')) return url.replace('vimeo.com/', 'player.vimeo.com/video/');
  return url;
};

const getImageUrl = (data: any): string => {
  if (!data) return '';
  if (typeof data === 'string') return data;
  if (data.node?.sourceUrl) return data.node.sourceUrl;
  if (data.sourceUrl) return data.sourceUrl;
  return '';
};

const getGridClass = (cols: string) => {
  switch (cols) {
    case '3': return 'grid-cols-1 md:grid-cols-3';
    case '4': return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4';
    case '6': return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-6';
    case '2': 
    default:
      return 'grid-cols-1 md:grid-cols-2';
  }
};

function isJapaneseWork(work: any): boolean {
  if (!work) return false;
  if (work.language?.code === 'JA' || work.language?.code === 'JP') return true;
  const jpRegex = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/;
  const titleHasJp = jpRegex.test(work.title || '');
  const brandHasJp = jpRegex.test(work.workDetails?.brand || '');
  const labelHasJp = jpRegex.test(work.workDetails?.thumbnailLabel || '');
  const clientHasJp = jpRegex.test(work.workDetails?.metaClient || '');
  const pitchHasJp = jpRegex.test(work.workDetails?.shortPitch || '') || jpRegex.test(work.workDetails?.longPitch || '');
  const linkUrl = work.link || work.uri || '';
  const hasJaInUrl = linkUrl.includes('/ja/') || linkUrl.includes('/jp/');
  const slug = work.slug || '';
  const hasJaInSlug =
    slug.endsWith('-2') ||
    slug.endsWith('-ja') ||
    slug.endsWith('-jp') ||
    slug.includes('-ja-') ||
    slug.includes('-jp-');
  return titleHasJp || brandHasJp || labelHasJp || clientHasJp || pitchHasJp || hasJaInUrl || hasJaInSlug;
}

function CarouselGallery({ images, startIndex, openLightbox }: { images: string[], startIndex: number, openLightbox: (idx: number) => void }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const maxScroll = target.scrollWidth - target.clientWidth;
    if (maxScroll > 0) setScrollProgress(target.scrollLeft / maxScroll);
  };

  const scrollLeft = () => carouselRef.current?.scrollBy({ left: -500, behavior: 'smooth' });
  const scrollRight = () => carouselRef.current?.scrollBy({ left: 500, behavior: 'smooth' });

  return (
    <div className="relative group/carousel">
      <div
        ref={carouselRef}
        onScroll={handleScroll}
        className="flex space-x-6 md:space-x-8 overflow-x-auto scrollbar-none scroll-smooth pb-8 pt-4 -mx-8 px-8 md:-mx-16 md:px-16"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => openLightbox(startIndex + idx)}
            className="flex-none w-[85vw] md:w-[45vw] lg:w-[calc(50%-1rem)] max-w-[800px] aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-md relative cursor-pointer group"
          >
            <img src={img} alt="Gallery item" className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105" />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 md:px-6 z-20">
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
  );
}

export default function WorkDetailClient({ work, otherWorks }: { work: any, otherWorks: any[] }) {
  const router = useRouter();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const acf = work.workDetails || {};
  const isJp = isJapaneseWork(work);

  const titleFont = isJp ? 'var(--font-biz-udpgothic), sans-serif' : 'var(--font-outfit), sans-serif';
  const bodyFont = isJp ? 'var(--font-zen-kaku), sans-serif' : 'var(--font-inter), sans-serif';

  const filteredOtherWorks = (otherWorks || []).filter(
    (item) => item.id !== work.id && isJapaneseWork(item) === isJp
  );

  const extractImages = (prefix: string) => {
    const images: string[] = [];
    for (let i = 1; i <= 6; i++) {
      const url = getImageUrl(acf[`${prefix}Img${i}`]);
      if (url) images.push(url);
    }
    return images;
  };

  const g1Images = extractImages('g1');
  const g2Images = extractImages('g2');
  const g3Images = extractImages('g3');
  
  const secondaryImage = getImageUrl(acf?.secondaryImg) || getImageUrl(work?.featuredImage);
  const allImages = [secondaryImage, ...g1Images, ...g2Images, ...g3Images].filter(Boolean);

  const g1StartIndex = secondaryImage ? 1 : 0;
  const g2StartIndex = g1StartIndex + g1Images.length;
  const g3StartIndex = g2StartIndex + g2Images.length;

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight' && lightboxOpen) setLightboxIndex((prev) => (prev + 1) % allImages.length);
      if (e.key === 'ArrowLeft' && lightboxOpen) setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, allImages.length]);

  const deliverables = [];
  for (let i = 1; i <= 4; i++) {
    const title = acf[`del${i}title`];
    const desc = acf[`del${i}desc`];
    if (title && desc) {
      deliverables.push({ title, desc });
    }
  }

  const renderGallery = (mediaType: string, videoUrl: string, layout: string, gridCols: string, images: string[], startIndex: number) => {
    if (mediaType === 'video' && videoUrl) {
      const embedUrl = getEmbedUrl(videoUrl);
      return (
        <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-black shadow-lg">
          <iframe src={embedUrl} className="w-full h-full" frameBorder="0" allowFullScreen allow="autoplay; fullscreen; picture-in-picture" />
        </div>
      );
    }

    if (mediaType === 'images' && images.length > 0) {
      if (images.length === 1) {
        return (
          <div onClick={() => openLightbox(startIndex)} className="w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-lg cursor-pointer group relative">
            <img src={images[0]} alt="Gallery item" className="w-full h-auto max-h-[85vh] object-contain mx-auto transition-transform duration-[2000ms] ease-out group-hover:scale-105" />
          </div>
        );
      }

      if (layout === 'grid') {
        const gridClass = getGridClass(gridCols || '2');
        return (
          <div className={`grid gap-6 md:gap-8 items-start ${gridClass}`}>
            {images.map((img, idx) => (
              <div key={idx} onClick={() => openLightbox(startIndex + idx)} className="rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 relative shadow-md cursor-pointer group">
                <img src={img} alt="Gallery item" className="w-full h-auto object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105" />
              </div>
            ))}
          </div>
        );
      } else {
        return <CarouselGallery images={images} startIndex={startIndex} openLightbox={openLightbox} />;
      }
    }
    return null;
  };

  return (
    <main className="min-h-screen bg-white text-black dark:bg-[#0a0a0c] dark:text-white transition-colors duration-500 relative overflow-x-hidden selection:bg-[#FFE100] selection:text-black">
      
      {/* Lightbox Overlay */}
      {lightboxOpen && allImages.length > 0 && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-md" onClick={() => setLightboxOpen(false)}>
          <button className="absolute top-6 right-8 text-white/50 hover:text-[#FFE100] text-4xl p-2 z-50">&times;</button>
          <button onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev - 1 + allImages.length) % allImages.length); }} className="absolute left-4 md:left-8 w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-[#FFE100] hover:text-black hover:border-[#FFE100] transition-all text-xl font-bold z-50">&lt;</button>
          <button onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => (prev + 1) % allImages.length); }} className="absolute right-4 md:right-8 w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-[#FFE100] hover:text-black hover:border-[#FFE100] transition-all text-xl font-bold z-50">&gt;</button>
          <img src={allImages[lightboxIndex]} alt="Expanded view" className="max-w-[90vw] max-h-[85vh] object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-500 font-mono text-xs tracking-widest">{lightboxIndex + 1} / {allImages.length}</div>
        </div>
      )}

      {/* Header Nav (モバイルでも常に表示・最適化) */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-12 py-4 md:py-6 bg-white/80 dark:bg-[#0a0a0c]/80 backdrop-blur-md">
        <button onClick={() => router.back()} className="inline-flex items-center space-x-2 text-sm md:text-base font-semibold tracking-wider hover:text-[#FFE100] transition-colors" style={{ fontFamily: titleFont }}>
          <span>{isJp ? '← 戻る' : '← Back'}</span>
        </button>
        <a
          href="https://calendar.app.google/kEdQJyu5r68NhBjt9"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-3.5 py-2 md:px-5 md:py-2.5 bg-black text-white dark:bg-white dark:text-black font-semibold tracking-wider text-xs md:text-base rounded-[4px] hover:-translate-y-1 hover:bg-[#FFE100] dark:hover:bg-[#FFE100] hover:text-black transition-all duration-500"
          style={{ fontFamily: titleFont }}
        >
          {isJp ? 'ミーティングの予約 →' : 'Book a Call →'}
        </a>
      </nav>

      <article className="pt-36 pb-32 space-y-32 md:space-y-40">
        
        {/* 1. Title & Short Pitch */}
        <header className="px-8 md:px-16 max-w-4xl mx-auto space-y-3 w-full">
          <div className="text-left lg:text-center w-full">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1 mb-3" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              // {acf.brand?.toUpperCase() || 'WORK'}
            </span>
          </div>
          <h1
            className={`font-medium tracking-tight leading-tight text-left lg:text-center ${
              isJp ? 'text-3xl md:text-5xl lg:text-[64px]' : 'text-4xl md:text-6xl'
            }`}
            style={{ fontFamily: titleFont }}
          >
            {work.title}
          </h1>
          {acf.shortPitch && (
            <p className="text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed text-left lg:text-center pt-2" style={{ fontFamily: bodyFont }}>
              {acf.shortPitch}
            </p>
          )}
        </header>

        {/* 2. Secondary Hero Image */}
        {secondaryImage && (
          <section className="px-8 md:px-16 max-w-7xl mx-auto">
            <div onClick={() => openLightbox(0)} className="rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 aspect-[16/9] relative shadow-lg cursor-pointer group">
              <img src={secondaryImage} alt={work.title} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" />
            </div>
          </section>
        )}

        {/* 3. Meta Data */}
        <section className="px-8 md:px-16 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 md:py-20 border-y border-zinc-200/60 dark:border-zinc-800/60">
            {[
              { label: isJp ? 'クライアント' : 'CLIENT', val: acf.metaClient },
              { label: isJp ? '役割' : 'ROLE', val: acf.metaRole },
              { label: isJp ? '提供価値' : 'DELIVERY', val: acf.metaDelivery },
              { label: isJp ? 'インパクト' : 'IMPACT', val: acf.metaImpact }
            ].map((meta, i) => meta.val && (
              <div key={i}>
                <span className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1 mb-3" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>{meta.label}</span>
                <p className="text-base font-medium capitalize" style={{ fontFamily: bodyFont }}>{meta.val}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Overview */}
        {acf.longPitch && (
          <section className="px-8 md:px-16 max-w-4xl mx-auto space-y-6 w-full">
            <h2 className={`font-medium tracking-tight text-left ${isJp ? 'text-2xl md:text-4xl lg:text-[40px]' : 'text-2xl md:text-3xl'}`} style={{ fontFamily: titleFont }}>
              {isJp ? '概要' : 'Overview'}
            </h2>
            <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed text-left whitespace-pre-wrap" style={{ fontFamily: bodyFont }}>
              {acf.longPitch}
            </p>
          </section>
        )}

        {/* 5. Gallery 1 */}
        <section className="px-8 md:px-16 max-w-7xl mx-auto">
          {renderGallery(acf.g1MediaType, acf.g1VideoUrl, acf.g1Layout, acf.g1gridcolumns, g1Images, g1StartIndex)}
        </section>

        {/* 6. Challenge & Solution */}
        <section className="px-8 md:px-16 max-w-4xl mx-auto w-full">
          {acf.challenge && (
            <div className="space-y-6 pb-20 border-b border-zinc-200/60 dark:border-zinc-800/60">
              <h2 className={`font-medium tracking-tight ${isJp ? 'text-2xl md:text-4xl lg:text-[40px]' : 'text-2xl md:text-3xl'}`} style={{ fontFamily: titleFont }}>
                {isJp ? '課題' : 'The Challenge'}
              </h2>
              <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap" style={{ fontFamily: bodyFont }}>{acf.challenge}</p>
            </div>
          )}
          {acf.solution && (
            <div className="space-y-6 pt-20">
              <h2 className={`font-medium tracking-tight ${isJp ? 'text-2xl md:text-4xl lg:text-[40px]' : 'text-2xl md:text-3xl'}`} style={{ fontFamily: titleFont }}>
                {isJp ? 'ソリューション' : 'The Solution'}
              </h2>
              <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap" style={{ fontFamily: bodyFont }}>{acf.solution}</p>
            </div>
          )}
        </section>

        {/* 7. Gallery 2 */}
        <section className="px-8 md:px-16 max-w-7xl mx-auto">
          {renderGallery(acf.g2MediaType, acf.g2VideoUrl, acf.g2Layout, acf.g2gridcolumns, g2Images, g2StartIndex)}
        </section>

        {/* 8. Deliverables */}
        {deliverables.length > 0 && (
          <section className="px-8 md:px-16 max-w-7xl mx-auto space-y-12 py-12 md:py-16">
            <h2 className={`font-medium tracking-tight ${isJp ? 'text-2xl md:text-4xl lg:text-[40px]' : 'text-2xl md:text-3xl'}`} style={{ fontFamily: titleFont }}>
              {isJp ? '納品成果物' : 'What We Delivered'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
              {deliverables.map((item, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="text-xl font-semibold tracking-tight" style={{ fontFamily: titleFont }}>{item.title}</h3>
                  <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap" style={{ fontFamily: bodyFont }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 9. Gallery 3 */}
        <section className="px-8 md:px-16 max-w-7xl mx-auto">
          {renderGallery(acf.g3MediaType, '', acf.g3Layout, acf.g3gridcolumns, g3Images, g3StartIndex)}
        </section>

        {/* 10. Learnings */}
        {acf.learnings && (
          <section className="px-8 md:px-16 max-w-4xl mx-auto space-y-4 pb-8">
            <h2 className={`font-medium tracking-tight ${isJp ? 'text-2xl md:text-4xl lg:text-[40px]' : 'text-2xl md:text-3xl'}`} style={{ fontFamily: titleFont }}>
              {isJp ? '主な学び' : 'Key Learnings'}
            </h2>
            <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap" style={{ fontFamily: bodyFont }}>{acf.learnings}</p>
          </section>
        )}

        {/* 11. See Other Works */}
        <section className="px-8 md:px-16 max-w-7xl mx-auto w-full">
          <div className="pt-20 border-t border-zinc-200/60 dark:border-zinc-800/60 space-y-12">
            
            <div className="flex flex-col items-center text-center space-y-4">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
                // OTHER WORKS
              </span>
              <h2
                className={`font-medium tracking-tight ${isJp ? 'text-2xl md:text-4xl lg:text-[40px]' : 'text-3xl md:text-4xl'}`}
                style={{ fontFamily: titleFont }}
              >
                {isJp ? 'その他の制作実績' : 'See Other Works'}
              </h2>
              <a href="/works" className="inline-flex items-center space-x-2 text-base font-semibold tracking-wider hover:text-[#FFE100] transition-colors mt-2" style={{ fontFamily: titleFont }}>
                <span>{isJp ? 'すべて見る →' : 'See All →'}</span>
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredOtherWorks && filteredOtherWorks.length > 0 ? (
                filteredOtherWorks.slice(0, 3).map((item, idx) => (
                  <a key={idx} href={`/works/${item.slug}`} className="group/card relative block">
                    <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/50 shadow-md">
                      
                      <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 via-zinc-300 to-zinc-200 dark:from-zinc-800 dark:via-zinc-900 dark:to-black transition-transform duration-[2000ms] ease-out group-hover/card:scale-105 flex items-center justify-center">
                        <span className="text-3xl font-bold text-zinc-500 dark:text-zinc-800 uppercase tracking-tighter select-none" style={{ fontFamily: titleFont }}>
                          {item.workDetails?.brand || 'WORK'}
                        </span>
                      </div>

                      {item.featuredImage?.node?.sourceUrl && (
                        <img
                          src={item.featuredImage.node.sourceUrl}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover/card:scale-105"
                        />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 opacity-90 transition-opacity duration-300 pointer-events-none" />

                      <div className="absolute inset-0 p-6 flex flex-col justify-between z-10 pointer-events-none">
                        <div className="flex justify-start items-center">
                          <span className="text-xs font-bold uppercase tracking-wider text-black bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm" style={{ fontFamily: titleFont }}>
                            {item.workDetails?.thumbnailLabel?.toUpperCase() || item.workDetails?.metaClient?.toUpperCase() || 'PROJECT'}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs uppercase tracking-widest text-[#FFE100] block mb-1 font-medium" style={{ fontFamily: titleFont }}>
                            {item.workDetails?.brand?.toUpperCase() || ''}
                          </span>
                          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white capitalize group-hover/card:underline" style={{ fontFamily: titleFont }}>
                            {item.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </a>
                ))
              ) : (
                [1, 2, 3].map((_, idx) => (
                  <div key={idx} className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-500 font-mono text-xs p-4 text-center">
                    Coming Soon
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* 12. CTA */}
        <section className="px-8 md:px-16 pt-24 pb-12 space-y-8 max-w-4xl mx-auto w-full flex flex-col lg:items-center">
          <div className="text-left lg:text-center w-full">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1" style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
              // LET&apos;S BUILD TOGETHER
            </span>
          </div>
          <h2
            className={`font-medium tracking-tight text-left lg:text-center w-full ${isJp ? 'text-[26px] md:text-[40px] leading-[1.38]' : 'text-[32px] md:text-[48px] leading-tight'}`}
            style={{ fontFamily: titleFont }}
          >
            {isJp ? '素晴らしいプロダクトを共に作りませんか？' : 'Ready to Build Something Great?'}
          </h2>
          <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-xl lg:mx-auto text-left lg:text-center w-full" style={{ fontFamily: bodyFont }}>
            {isJp
              ? '野心的なブランドや企業とパートナーシップを組み、インパクトのあるデジタル体験を設計・構築・拡張します。まずはお気軽にご相談ください。'
              : 'We partner with ambitious brands to design, build, and scale high-impact digital experiences. Reach out and let\'s start a conversation.'}
          </p>
          <div className="pt-4 w-full flex justify-start lg:justify-center">
            <a href="https://calendar.app.google/kEdQJyu5r68NhBjt9" target="_blank" rel="noopener noreferrer" className="block w-full lg:w-auto text-center px-10 py-4 bg-black text-white dark:bg-white dark:text-black font-semibold tracking-wider text-base rounded-[4px] hover:-translate-y-1 hover:bg-[#FFE100] dark:hover:bg-[#FFE100] hover:text-black transition-all duration-500" style={{ fontFamily: titleFont }}>
              {isJp ? 'ミーティングを予約する →' : 'Book an Intro Call →'}
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