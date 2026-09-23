// app/works/page.tsx
import WorksClient from './WorksClient';

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

async function getWorks(): Promise<{ selected: WorkNode[]; startups: WorkNode[] }> {
  const query = `
    query GetWorksList {
      works(first: 50, where: { orderby: { field: DATE, order: DESC } }) {
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
    const res = await fetch(`${WP_GRAPHQL_URL}?lang=all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      next: { revalidate: 60 },
    });
    const json = await res.json();
    const nodes: WorkNode[] = json.data?.works?.nodes || [];

    const selected = nodes.filter((w) => !w.workDetails?.metaYear && !w.workDetails?.whyStarted);
    const startups = nodes.filter((w) => w.workDetails?.metaYear || w.workDetails?.whyStarted);

    return { selected, startups };
  } catch (err) {
    console.error('Failed to fetch works for Works Page:', err);
    return { selected: [], startups: [] };
  }
}

export const metadata = {
  title: 'Works | Genki Brothers',
  description: 'Building High-Impact Digital Experiences & Scalable Web Products.',
};

export default async function WorksPage() {
  const { selected, startups } = await getWorks();

  return (
    <WorksClient
      selectedWorks={selected}
      startupWorks={startups}
    />
  );
}