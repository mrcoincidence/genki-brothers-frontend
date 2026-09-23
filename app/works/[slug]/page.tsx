// app/works/[slug]/page.tsx
import WorkDetailClient from './WorkDetailClient';
import StartupDetailClient from './StartupDetailClient';
import { notFound } from 'next/navigation';

const WP_GRAPHQL_URL = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL || 'https://api.genkibrothers.co/graphql';

interface WorkDetails {
  brand?: string;
  thumbnailLabel?: string;
  metaClient?: string;
  metaYear?: string;
  metaRole?: string;
  metaDelivery?: string;
  metaImpact?: string;
  whyStarted?: string;
  challenge?: string;
  solution?: string;
  shortPitch?: string;
  longPitch?: string;
}

interface WorkNode {
  id: string;
  title: string;
  slug: string;
  uri?: string;
  link?: string;
  language?: {
    code?: string;
  };
  featuredImage?: {
    node?: {
      sourceUrl: string;
    };
  };
  workDetails?: WorkDetails;
}

async function getWorkData(slug: string) {
  const query = `
    query GetWorkAndOthers($slug: ID!) {
      work(id: $slug, idType: SLUG) {
        id
        title
        slug
        uri
        link
        language {
          code
        }
        featuredImage {
          node {
            sourceUrl
          }
        }
        workDetails {
          brand
          thumbnailLabel
          metaClient
          metaYear
          metaRole
          metaDelivery
          metaImpact
          whyStarted
          challenge
          solution
          shortPitch
          longPitch
        }
      }
      works(first: 50, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          id
          title
          slug
          uri
          link
          language {
            code
          }
          featuredImage {
            node {
              sourceUrl
            }
          }
          workDetails {
            brand
            thumbnailLabel
            metaClient
            metaYear
            whyStarted
            shortPitch
            longPitch
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(`${WP_GRAPHQL_URL}?lang=all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { slug } }),
      next: { revalidate: 60 },
    });

    const json = await res.json();
    const allWorks: WorkNode[] = json.data?.works?.nodes || [];

    // スラッグでのフォールバック検索
    const targetSlug = decodeURIComponent(slug);
    const work =
      json.data?.work ||
      allWorks.find(
        (w) =>
          w.slug === targetSlug ||
          w.slug === `${targetSlug}-2` ||
          w.slug === targetSlug.replace(/-2$/, '')
      );

    if (!work) return null;

    // 現在の言語を取得 (判定不可の場合はスラッグの -2 の有無でフォールバック)
    const currentLang = work.language?.code || (work.slug.endsWith('-2') ? 'JA' : 'EN');

    // 1. 同言語 かつ 通常実績 (whyStarted がない) のみを抽出
    const otherWorks = allWorks.filter((w) => {
      const wLang = w.language?.code || (w.slug.endsWith('-2') ? 'JA' : 'EN');
      const isSameLang = wLang === currentLang;
      const isWorkOnly = !w.workDetails?.whyStarted;
      const isNotCurrent = w.slug !== work.slug && w.id !== work.id;
      return isSameLang && isWorkOnly && isNotCurrent;
    });

    // 2. 同言語 かつ 自社事業 (whyStarted がある) のみを抽出 (StartupDetailClient用)
    const otherStartups = allWorks.filter((w) => {
      const wLang = w.language?.code || (w.slug.endsWith('-2') ? 'JA' : 'EN');
      const isSameLang = wLang === currentLang;
      const isStartupOnly = Boolean(w.workDetails?.whyStarted);
      const isNotCurrent = w.slug !== work.slug && w.id !== work.id;
      return isSameLang && isStartupOnly && isNotCurrent;
    });

    return { work, otherWorks, otherStartup: otherStartups[0] || null };
  } catch (err) {
    console.error('Failed to fetch work detail:', err);
    return null;
  }
}

export async function generateStaticParams() {
  const query = `
    query GetAllWorkSlugs {
      works(first: 50) {
        nodes {
          slug
        }
      }
    }
  `;

  try {
    const res = await fetch(`${WP_GRAPHQL_URL}?lang=all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      next: { revalidate: 60 },
    });
    const json = await res.json();
    const nodes: { slug: string }[] = json.data?.works?.nodes || [];
    return nodes.map((node) => ({ slug: node.slug }));
  } catch (err) {
    return [];
  }
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getWorkData(slug);

  if (!data || !data.work) {
    notFound();
  }

  const { work, otherWorks, otherStartup } = data;
  
  // whyStarted の有無で自社事業（Startup）かどうかの判定
  const isStartup = Boolean(work.workDetails?.whyStarted);

  if (isStartup) {
    return <StartupDetailClient work={work} otherStartup={otherStartup} />;
  }

  return <WorkDetailClient work={work} otherWorks={otherWorks} />;
}