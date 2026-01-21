import { NextResponse } from 'next/server';
import sanityFetch from '@/lib/sanity';

type Post = {
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt?: string;
  body?: any[];
};

export async function GET() {
  try {
    const posts = await sanityFetch<Post[]>(
      `*[_type == "post"] | order(publishedAt desc) { title, slug, excerpt, publishedAt }`,
      {}
    );

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lifewithmystic.com';
    
    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>lifewithmystic | Sacred Philosophical Writings</title>
    <link>${baseUrl}</link>
    <description>Deep, contemplative essays on philosophy, spirituality, and mysticism.</description>
    <language>en-us</language>
    <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml" />
    <image>
      <title>lifewithmystic</title>
      <url>${baseUrl}/favicon.ico</url>
      <link>${baseUrl}</link>
    </image>
    ${posts
      .map(
        (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/blog/${post.slug.current}</link>
      <guid isPermaLink="false">${baseUrl}/blog/${post.slug.current}</guid>
      <description>${escapeXml(post.excerpt || '')}</description>
      <pubDate>${new Date(post.publishedAt || '').toUTCString()}</pubDate>
      <content:encoded><![CDATA[
        <p>${escapeXml(post.excerpt || '')}</p>
        <p><a href="${baseUrl}/blog/${post.slug.current}">Read full post</a></p>
      ]]></content:encoded>
    </item>
    `
      )
      .join('')}
  </channel>
</rss>`;

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (err) {
    console.error('RSS generation error:', err);
    return NextResponse.json({ error: 'Failed to generate RSS' }, { status: 500 });
  }
}

function escapeXml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
