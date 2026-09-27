// app/articles/[slug]/page.tsx
import { cache } from 'react';
import { notFound } from 'next/navigation';
import ArticleDetailClient from './ArticleDetailClient';

const WP_GRAPHQL_URL = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL || 'https://api.genkibrothers.co/graphql';

interface ArticleNode {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt?: string;
  content: string;
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

// 日本語URL・スラッグの表記揺れ（エンコード/デコード/末尾スラッシュ）を正規化する関数
function normalizeSlug(str: string): string {
  if (!str) return '';
  try {
    return decodeURIComponent(str).toLowerCase().trim().replace(/\/$/, '');
  } catch (e) {
    return str.toLowerCase().trim().replace(/\/$/, '');
  }
}

// React.cache で同一レンダリング内の重複呼び出しをキャッシュ化
const getArticleBySlug = cache(async (rawSlug: string): Promise<ArticleNode | null> => {
  if (!rawSlug) return null;

  const targetSlug = normalizeSlug(rawSlug);

  // 1. Polylang全言語パラメータ(?lang=all)付きで直接SLUG検索
  const queryDirect = `
    query GetArticleDirect($slug: String!) {
      byDecoded: post(id: $slug, idType: SLUG) {
        id title slug date content uri link
        featuredImage { node { sourceUrl } }
        categories { nodes { name } }
      }
    }
  `;

  try {
    const res = await fetch(`${WP_GRAPHQL_URL}?lang=all`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: queryDirect,
        variables: { slug: targetSlug },
      }),
      next: { revalidate: 60 },
    });
    const json = await res.json();
    if (json.data?.byDecoded?.content) {
      return json.data.byDecoded;
    }
  } catch (err) {
    console.warn('Direct slug fetch failed, trying list scan:', err);
  }

  // 2. フォールバック: 全投稿リストから完全一致で照合抽出
  const queryList = `
    query GetAllArticlesForMatch {
      posts(first: 100) {
        nodes {
          id title slug date excerpt content uri link
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
      body: JSON.stringify({ query: queryList }),
      next: { revalidate: 60 },
    });
    const json = await res.json();

    if (json.data?.posts?.nodes) {
      const nodes: ArticleNode[] = json.data.posts.nodes;

      const matched = nodes.find((node) => {
        const nodeSlug = normalizeSlug(node.slug);
        const nodeUri = normalizeSlug(node.uri || '');
        const nodeLink = normalizeSlug(node.link || '');

        // 1. スラッグ完全一致
        if (nodeSlug === targetSlug) return true;

        // 2. URI末尾のパスセグメント完全一致 (部分一致による vol-1 と vol-16 の誤検知を防止)
        const uriParts = nodeUri.split('/').filter(Boolean);
        if (uriParts.length > 0 && uriParts[uriParts.length - 1] === targetSlug) {
          return true;
        }

        const linkParts = nodeLink.split('/').filter(Boolean);
        if (linkParts.length > 0 && linkParts[linkParts.length - 1] === targetSlug) {
          return true;
        }

        return false;
      });

      if (matched) return matched;
    }
  } catch (err) {
    console.error('List fallback fetch failed:', err);
  }

  return null;
});

const getOtherArticles = cache(async (): Promise<ArticleNode[]> => {
  const query = `
    query GetOtherArticlesForDetail {
      posts(first: 50) {
        nodes {
          id title slug date excerpt content uri link
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
      next: { revalidate: 60 },
    });
    const json = await res.json();
    return json.data?.posts?.nodes || [];
  } catch (err) {
    return [];
  }
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found | Genki Brothers',
    };
  }

  return {
    title: `${article.title} | Genki Brothers`,
    description: article.excerpt?.replace(/<[^>]*>/g, '').slice(0, 160) || 'Genki Brothers Article',
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const otherArticles = await getOtherArticles();

  return <ArticleDetailClient article={article} otherArticles={otherArticles} />;
}