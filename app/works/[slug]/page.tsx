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
  metaDeliverables?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  whyStarted?: string;
  challengeText?: string;
  solutionText?: string;
  impactMetrics?: string;
}

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
          metaDeliverables
          heroHeadline
          heroSubheadline
          whyStarted
          challengeText
          solutionText
          impactMetrics
        }
      }
      works(first: 50, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          id
          title
          slug
          uri
          link
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
    const work = json.data?.work;
    const allWorks: WorkNode[] = json.data?.works?.nodes || [];

    if (!work) return null;

    // 現在表示中の事例を除外した「他の事例」を取得
    const otherWorks = allWorks.filter((w) => w.slug !== slug);

    return { work, otherWorks };
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

  const { work, otherWorks } = data;
  const isStartup = Boolean(work.workDetails?.metaYear || work.workDetails?.whyStarted);

  if (isStartup) {
    return <StartupDetailClient work={work} otherWorks={otherWorks} />;
  }

  return <WorkDetailClient work={work} otherWorks={otherWorks} />;
}