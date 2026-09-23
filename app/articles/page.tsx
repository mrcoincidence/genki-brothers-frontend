// app/articles/page.tsx
import ArticlesClient from './ArticlesClient';

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

async function getArticles(): Promise<{ featured: ArticleNode[]; remaining: ArticleNode[]; all: ArticleNode[] }> {
  const query = `
    query GetArticlesList {
      posts(first: 30, where: { orderby: { field: DATE, order: DESC } }) {
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
    const res = await fetch(`${WP_GRAPHQL_URL}?lang=all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      next: { revalidate: 60 }, // 60秒間キャッシュを保持して爆速化
    });
    const json = await res.json();
    const nodes: ArticleNode[] = json.data?.posts?.nodes || [];

    return {
      featured: nodes.slice(0, 2),
      remaining: nodes.slice(2),
      all: nodes,
    };
  } catch (err) {
    console.error('Failed to fetch articles:', err);
    return { featured: [], remaining: [], all: [] };
  }
}

export const metadata = {
  title: 'Articles | Genki Brothers',
  description: 'Open Source Thoughts On Design, Tech, And Culture.',
};

export default async function ArticlesPage() {
  const { featured, remaining, all } = await getArticles();

  return (
    <ArticlesClient
      featuredArticles={featured}
      remainingArticles={remaining}
      allArticles={all}
    />
  );
}