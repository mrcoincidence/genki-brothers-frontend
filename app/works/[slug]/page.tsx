// app/works/[slug]/page.tsx
import { notFound } from 'next/navigation';
import WorkDetailClient from './WorkDetailClient';
import StartupDetailClient from './StartupDetailClient';

const WP_GRAPHQL_URL = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL || 'https://api.genkibrothers.co/graphql';

async function fetchWorkData(slug: string) {
  const query = `
    query GetWorkAndLatestWorks($slug: ID!) {
      work(id: $slug, idType: SLUG) {
        id
        title
        slug
        featuredImage {
          node {
            sourceUrl
          }
        }
        workDetails {
          brand
          shortPitch
          thumbnailLabel
          metaClient
          metaRole
          metaDelivery
          metaImpact
          
          # Startup専用追加フィールド
          metaYear
          whyStarted
          howLaunched
          
          secondaryImg {
            node {
              sourceUrl
            }
          }
          
          longPitch
          challenge
          solution
          learnings
          
          del1title
          del1desc
          del2title
          del2desc
          del3title
          del3desc
          del4title
          del4desc
          
          g1MediaType
          g1VideoUrl
          g1Layout
          g1gridcolumns
          g1Img1 { node { sourceUrl } }
          g1Img2 { node { sourceUrl } }
          g1Img3 { node { sourceUrl } }
          g1Img4 { node { sourceUrl } }
          g1Img5 { node { sourceUrl } }
          g1Img6 { node { sourceUrl } }
          
          g2MediaType
          g2VideoUrl
          g2Layout
          g2gridcolumns
          g2Img1 { node { sourceUrl } }
          g2Img2 { node { sourceUrl } }
          g2Img3 { node { sourceUrl } }
          g2Img4 { node { sourceUrl } }
          g2Img5 { node { sourceUrl } }
          g2Img6 { node { sourceUrl } }
          
          g3MediaType
          g3Layout
          g3gridcolumns
          g3Img1 { node { sourceUrl } }
          g3Img2 { node { sourceUrl } }
          g3Img3 { node { sourceUrl } }
          g3Img4 { node { sourceUrl } }
          g3Img5 { node { sourceUrl } }
          g3Img6 { node { sourceUrl } }
        }
      }

      # Startupを含め幅広く取得
      works(first: 10, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          id
          title
          slug
          featuredImage {
            node {
              sourceUrl
            }
          }
          workDetails {
            brand
            thumbnailLabel
            metaClient
            # 判定用
            metaYear
            whyStarted
          }
        }
      }
    }
  `;

  const res = await fetch(WP_GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { slug } }),
    cache: 'no-store', 
  });

  const json = await res.json();
  
  if (json.errors) {
    console.error('GraphQL Query Errors:', JSON.stringify(json.errors, null, 2));
  }

  const currentWork = json.data?.work;
  const allWorks = json.data?.works?.nodes || [];

  return { currentWork, allWorks, slug };
}

export default async function WorkDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { currentWork, allWorks, slug } = await fetchWorkData(resolvedParams.slug);

  if (!currentWork || !currentWork.workDetails) {
    notFound();
  }

  // ACFの「metaYear」または「whyStarted」に入力があれば Startup と自動判定
  const isStartup = !!currentWork.workDetails.metaYear || !!currentWork.workDetails.whyStarted;
  const otherWorksAll = allWorks.filter((w: any) => w.slug !== slug);

  if (isStartup) {
    // 他のStartupを1件探す（metaYear か whyStarted がある別記事）
    const otherStartup = otherWorksAll.find((w: any) => !!w.workDetails?.metaYear || !!w.workDetails?.whyStarted);
    return <StartupDetailClient work={currentWork} otherStartup={otherStartup} />;
  } else {
    // Startupを除外した通常のWorks最新3件
    const normalOtherWorks = otherWorksAll.filter((w: any) => !w.workDetails?.metaYear && !w.workDetails?.whyStarted).slice(0, 3);
    return <WorkDetailClient work={currentWork} otherWorks={normalOtherWorks} />;
  }
}