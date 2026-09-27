// app/articles/[slug]/ArticleDetailClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ArticleNode {
  id: string;
  title: string;
  slug: string;
  date?: string;
  featuredImage?: {
    node?: {
      sourceUrl: string;
    };
  };
  categories?: {
    nodes?: { name: string }[];
  };
}

interface ArticleDetailProps {
  article: {
    id: string;
    title: string;
    date: string;
    content: string;
    featuredImage?: {
      node?: {
        sourceUrl: string;
      };
    };
    categories?: {
      nodes?: { name: string }[];
    };
  };
  otherArticles?: ArticleNode[];
}

function calculateReadingTime(content: string): number {
  if (!content) return 1;
  const plainText = content.replace(/<[^>]*>/g, '').trim();
  const words = plainText.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return Math.max(1, minutes);
}

function isJapaneseArticle(article: any): boolean {
  if (!article) return false;
  const jpRegex = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/;
  const titleHasJp = jpRegex.test(article.title || '');
  const contentHasJp = jpRegex.test(article.content || '');
  const linkUrl = article.link || article.uri || '';
  const hasJaInUrl = linkUrl.includes('/ja/') || linkUrl.includes('/jp/');
  const slug = article.slug || '';
  const hasJaInSlug =
    slug.endsWith('-ja') ||
    slug.endsWith('-jp') ||
    slug.includes('-ja-') ||
    slug.includes('-jp-');

  return titleHasJp || contentHasJp || hasJaInUrl || hasJaInSlug;
}

/**
 * HTML構造および row-2col / caption-left クラスのみに基づいて
 * 1カラム (768px) と 2カラム (1400px リキッド 5/6 + 1/6) を左右順序含め完全自動構築する関数
 */
function processArticleContent(rawHtml: string): string {
  if (!rawHtml) return '';

  let html = rawHtml;

  // 1. WPBakeryの見出しショートコードをHTML h4へ変換 (フォント30px, Outfit指定)
  html = html.replace(
    /\[vc_custom_heading[^\]]*\]([\s\S]*?)\[\/vc_custom_heading\]/gi,
    '<h4 class="text-[30px] font-medium tracking-tight text-black dark:text-white pt-10 pb-3" style="font-family: var(--font-outfit), sans-serif;">$1</h4>'
  );

  // 2. 不要なショートコードタグを除去
  html = html.replace(/\[\/?vc_[^\]]*\]/gi, '');

  if (typeof window === 'undefined') {
    return html;
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div class="article-parsed-root">${html}</div>`, 'text/html');
    const root = doc.querySelector('.article-parsed-root');

    if (!root) return html;

    // 3. YouTube プレースホルダーを <iframe> に自動置換
    root.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src') || '';
      if (src.includes('youtu.be') || src.includes('youtube.com')) {
        let videoId = '';
        if (src.includes('youtu.be/')) {
          videoId = src.split('youtu.be/')[1].split('?')[0];
        } else if (src.includes('v=')) {
          videoId = src.split('v=')[1].split('&')[0];
        }

        if (videoId) {
          const iframe = doc.createElement('iframe');
          iframe.src = `https://www.youtube.com/embed/${videoId}`;
          iframe.className = 'w-full aspect-video rounded-2xl border-0 block shadow-lg my-4';
          iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
          iframe.setAttribute('allowfullscreen', 'true');
          img.parentNode?.replaceChild(iframe, img);
        }
      }
    });

    const searchRoot = root.querySelector('.post-content, .wpb-content-wrapper') || root;
    let topBlocks = Array.from(searchRoot.children) as HTMLElement[];

    // 外層ラッパー要素の Unwrap
    if (topBlocks.length === 1 && topBlocks[0].children.length > 0) {
      const single = topBlocks[0];
      if (!single.classList.contains('row-2col') && !single.classList.contains('wpb_column')) {
        topBlocks = Array.from(single.children) as HTMLElement[];
      }
    }

    const outputContainer = doc.createElement('div');
    outputContainer.className = 'article-reconstructed-wrapper w-full';

    topBlocks.forEach((node) => {
      const elem = node as HTMLElement;
      const className = elem.className || '';
      const elemHTML = elem.outerHTML || '';

      // 不要な空Pタグ等をスキップ
      if (
        (elem.tagName.toLowerCase() === 'p' && !elem.textContent?.trim() && !elem.querySelector('img, iframe, video')) ||
        className.includes('post-after') ||
        elem.querySelector('.author-profile') !== null
      ) {
        return;
      }

      // row-2col クラスの検出
      const is2Col =
        className.includes('row-2col') ||
        elemHTML.includes('row-2col') ||
        elem.querySelector('.row-2col') !== null;

      if (is2Col) {
        // ==========================================
        // 【2カラム行】: 1400px 全幅リキッド Grid (5/6 + 1/6)
        // ==========================================
        const twoColRow = doc.createElement('div');
        twoColRow.className =
          'w-full max-w-[1400px] mx-auto px-6 md:px-12 my-12 md:my-16 grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-10 items-start clear-both';

        const mediaEl = (elem.querySelector('img, iframe, video') as HTMLElement) || elem;
        const captionEl = (elem.querySelector('figcaption, .uncode_text_column, p') as HTMLElement) || null;

        // caption-left クラスの検出 (左1/6キャプション + 右5/6メディア)
        const isCaptionLeft =
          className.includes('caption-left') ||
          elemHTML.includes('caption-left') ||
          elem.querySelector('.caption-left') !== null;

        const captionStyle =
          'text-[12px] text-zinc-600 dark:text-white font-sans leading-relaxed pt-2 md:pt-4 block [&_p]:text-[12px] [&_p]:text-zinc-600 [&_p]:dark:text-white';
        const mediaStyle =
          'w-full rounded-2xl overflow-hidden shadow-lg bg-zinc-100 dark:bg-zinc-900';

        const mediaBox = doc.createElement('div');
        const captionBox = doc.createElement('div');

        if (mediaEl) {
          const mediaClone = mediaEl.cloneNode(true) as HTMLElement;
          if (mediaClone.tagName.toLowerCase() === 'img') {
            mediaClone.className = 'w-full h-auto object-cover rounded-2xl block';
          } else {
            mediaClone.className = 'w-full aspect-video rounded-2xl overflow-hidden block shadow-lg';
          }
          mediaBox.appendChild(mediaClone);
        }

        if (captionEl) {
          captionBox.innerHTML = captionEl.innerHTML;
        }

        if (isCaptionLeft) {
          captionBox.className = `order-2 md:order-1 md:col-span-1 ${captionStyle}`;
          mediaBox.className = `order-1 md:order-2 md:col-span-5 ${mediaStyle}`;
          twoColRow.appendChild(captionBox);
          twoColRow.appendChild(mediaBox);
        } else {
          mediaBox.className = `order-1 md:order-1 md:col-span-5 ${mediaStyle}`;
          captionBox.className = `order-2 md:order-2 md:col-span-1 ${captionStyle}`;
          twoColRow.appendChild(mediaBox);
          twoColRow.appendChild(captionBox);
        }

        outputContainer.appendChild(twoColRow);
      } else {
        // ==========================================
        // 【1カラム行】: 768px 幅 中央揃え
        // ==========================================
        const oneColRow = doc.createElement('div');
        oneColRow.className = 'w-full max-w-[768px] mx-auto px-6 md:px-0 my-8 clear-both';

        const mediaEl = (elem.querySelector('img, iframe, video') as HTMLElement) || null;
        const captionEl = (elem.querySelector('figcaption, .uncode_text_column, p') as HTMLElement) || null;

        if (mediaEl) {
          const mediaContainer = doc.createElement('div');
          mediaContainer.className = 'w-full rounded-2xl overflow-hidden shadow-lg bg-zinc-100 dark:bg-zinc-900';

          const mediaClone = mediaEl.cloneNode(true) as HTMLElement;
          if (mediaClone.tagName.toLowerCase() === 'img') {
            mediaClone.className = 'w-full h-auto object-cover rounded-2xl block';
          } else {
            mediaClone.className = 'w-full aspect-video rounded-2xl overflow-hidden block shadow-lg';
          }
          mediaContainer.appendChild(mediaClone);
          oneColRow.appendChild(mediaContainer);

          if (captionEl && captionEl.innerHTML.trim() && !captionEl.contains(mediaEl)) {
            const captionContainer = doc.createElement('div');
            captionContainer.className =
              'text-[12px] text-zinc-600 dark:text-white font-sans leading-relaxed mt-3 block [&_p]:text-[12px] [&_p]:text-zinc-600 [&_p]:dark:text-white';
            captionContainer.innerHTML = captionEl.innerHTML;
            oneColRow.appendChild(captionContainer);
          }
        } else {
          oneColRow.innerHTML = elem.outerHTML;
        }

        outputContainer.appendChild(oneColRow);
      }
    });

    return outputContainer.innerHTML;
  } catch (e) {
    console.error('Error processing article content:', e);
    return html;
  }
}

export default function ArticleDetailClient({ article, otherArticles = [] }: ArticleDetailProps) {
  const router = useRouter();

  const isJp = isJapaneseArticle(article);
  const titleFont = isJp ? 'var(--font-biz-udpgothic), sans-serif' : 'var(--font-outfit), sans-serif';
  const bodyFont = isJp ? 'var(--font-zen-kaku), sans-serif' : 'var(--font-inter), sans-serif';

  const category = article.categories?.nodes?.[0]?.name || 'ARTICLE';
  const imageUrl = article.featuredImage?.node?.sourceUrl || '';
  const readTime = calculateReadingTime(article.content);

  const [processedContent, setProcessedContent] = useState<string>(article.content);

  useEffect(() => {
    if (article?.content) {
      setProcessedContent(processArticleContent(article.content));
    }
  }, [article.content]);

  const filteredOtherArticles = (otherArticles || []).filter(
    (item) => item.id !== article.id && isJapaneseArticle(item) === isJp
  );

  return (
    <main className="min-h-screen bg-white text-black dark:bg-[#0a0a0c] dark:text-white transition-colors duration-500 relative overflow-x-hidden selection:bg-[#FFE100] selection:text-black">
      
      {/* Header Nav */}
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-12 py-4 md:py-6 bg-white/80 dark:bg-[#0a0a0c]/80 backdrop-blur-md">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center space-x-2 text-sm md:text-base font-semibold tracking-wider hover:text-[#FFE100] transition-colors"
          style={{ fontFamily: titleFont }}
        >
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

      <article className="pt-36 pb-32 space-y-12 md:space-y-16">
        
        {/* Title & Meta Header */}
        <header className="px-6 md:px-0 max-w-[768px] mx-auto space-y-3 w-full">
          <div className="text-left lg:text-center w-full">
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1 mb-2"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              // {category.toUpperCase()}
            </span>
          </div>

          <h1
            className={`font-medium tracking-tight text-left lg:text-center text-black dark:text-white ${
              isJp ? 'text-3xl md:text-5xl lg:text-[56px] leading-[1.28]' : 'text-4xl md:text-6xl leading-tight'
            }`}
            style={{ fontFamily: titleFont }}
          >
            {article.title}
          </h1>

          <div className="text-left lg:text-center pt-2">
            <span
              className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              {isJp ? `読了時間 ${readTime}分` : `READ ${readTime} MIN`}
            </span>
          </div>
        </header>

        {/* Featured Main Hero Image */}
        {imageUrl && (
          <section className="px-6 md:px-12 max-w-[1400px] mx-auto w-full">
            <div className="rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 aspect-[16/9] relative shadow-lg">
              <img src={imageUrl} alt={article.title} className="w-full h-full object-cover" />
            </div>
          </section>
        )}

        {/* Article Body */}
        <section className="w-full">
          <div
            className="article-body w-full text-base text-zinc-600 dark:text-zinc-400 leading-relaxed [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-medium [&_h2]:tracking-tight [&_h2]:text-black [&_h2]:dark:text-white [&_h2]:pt-10 [&_h2]:pb-3 [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-medium [&_h3]:tracking-tight [&_h3]:text-black [&_h3]:dark:text-white [&_h3]:pt-8 [&_h3]:pb-2 [&_h4]:text-[30px] [&_h4]:font-medium [&_h4]:tracking-tight [&_h4]:text-black [&_h4]:dark:text-white [&_h4]:pt-10 [&_h4]:pb-3 [&_h4]:font-['var(--font-outfit)',sans-serif] [&_h4_a]:text-[30px] [&_h4_a]:text-black [&_h4_a]:dark:text-white [&_h4_a]:font-['var(--font-outfit)',sans-serif] [&_h4_a]:no-underline [&_p]:text-base [&_p]:text-zinc-600 [&_p]:dark:text-zinc-400 [&_p]:leading-relaxed [&_p]:mb-6 [&_a]:text-black [&_a]:dark:text-[#FFE100] [&_a]:underline [&_a]:decoration-[#FFE100] [&_a]:decoration-2 [&_a]:underline-offset-4 [&_a]:hover:opacity-70 [&_a]:transition-opacity [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-2 [&_blockquote]:border-[#FFE100] [&_blockquote]:pl-4 [&_blockquote]:italic"
            style={{ fontFamily: bodyFont }}
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />
        </section>

        {/* Other Articles 回遊セクション */}
        <section className="px-6 md:px-16 max-w-7xl mx-auto w-full pt-16">
          <div className="pt-20 border-t border-zinc-200/60 dark:border-zinc-800/60 space-y-12">
            
            <div className="flex flex-col items-center text-center space-y-3">
              <span
                className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1"
                style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
              >
                // OTHER ARTICLES
              </span>
              <h2
                className={`font-medium tracking-tight ${isJp ? 'text-2xl md:text-4xl lg:text-[40px] leading-[1.38]' : 'text-3xl md:text-4xl'}`}
                style={{ fontFamily: titleFont }}
              >
                {isJp ? 'その他の思考と記事' : 'Explore More Thoughts'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {filteredOtherArticles && filteredOtherArticles.length > 0 ? (
                filteredOtherArticles.map((item) => {
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

        {/* CTA */}
        <section className="px-6 md:px-0 max-w-[768px] mx-auto w-full flex flex-col lg:items-center pt-8">
          <div className="text-left lg:text-center w-full">
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest text-black dark:text-[#FFE100] border-b-2 border-[#FFE100] dark:border-transparent pb-1"
              style={{ fontFamily: 'var(--font-outfit), sans-serif' }}
            >
              // LET&apos;S BUILD TOGETHER
            </span>
          </div>
          <h2
            className={`font-medium tracking-tight text-left lg:text-center w-full text-black dark:text-white mt-3 ${
              isJp ? 'text-[26px] md:text-[40px] leading-[1.38]' : 'text-[32px] md:text-[48px] leading-tight'
            }`}
            style={{ fontFamily: titleFont }}
          >
            {isJp ? '素晴らしいプロダクトを共に作りませんか？' : 'Ready to Build Something Great?'}
          </h2>
          <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-xl lg:mx-auto text-left lg:text-center w-full mt-3" style={{ fontFamily: bodyFont }}>
            {isJp
              ? '野心的なブランドや企業とパートナーシップを組み、インパクトのあるデジタル体験を設計・構築・拡張します。まずはお気軽にご相談ください。'
              : 'We partner with ambitious brands to design, build, and scale high-impact digital experiences. Reach out and let\'s start a conversation.'}
          </p>
          <div className="pt-6 w-full flex justify-start lg:justify-center">
            <a
              href="https://calendar.app.google/kEdQJyu5r68NhBjt9"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full lg:w-auto text-center px-10 py-4 bg-black text-white dark:bg-white dark:text-black font-semibold tracking-wider text-base rounded-[4px] hover:-translate-y-1 hover:bg-[#FFE100] dark:hover:bg-[#FFE100] hover:text-black transition-all duration-500"
              style={{ fontFamily: titleFont }}
            >
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