import { NextResponse } from 'next/server';
import sanityFetch from '@/lib/sanity';

type Post = {
  slug: { current: string };
  publishedAt?: string;
};

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lifewithmystic.com';
    
    // Fetch all blog posts
    const posts = await sanityFetch<Post[]>(
      `*[_type == "post"] { slug, publishedAt }`,
      {}
    );

    // Static pages
    const staticPages = [
      { path: '', priority: '1.0', changefreq: 'weekly' },
      { path: 'blog', priority: '0.9', changefreq: 'weekly' },
      { path: 'about', priority: '0.8', changefreq: 'monthly' },
      { path: 'manifesto', priority: '0.8', changefreq: 'monthly' },
      { path: 'archive', priority: '0.8', changefreq: 'weekly' },
      { path: 'reflections', priority: '0.7', changefreq: 'daily' },
      { path: 'audio', priority: '0.7', changefreq: 'monthly' },
      { path: 'contact', priority: '0.6', changefreq: 'yearly' },
      { path: 'knowledge-graph', priority: '0.7', changefreq: 'monthly' },
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page.path ? '/' + page.path : ''}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('')}
  ${posts
    .map(
      (post) => `
  <url>
    <loc>${baseUrl}/blog/${post.slug.current}</loc>
    <lastmod>${new Date(post.publishedAt || '').toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>`
    )
    .join('')}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (err) {
    console.error('Sitemap generation error:', err);
    return NextResponse.json({ error: 'Failed to generate sitemap' }, { status: 500 });
  }
}
