import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { q } = await request.json();
    
    if (!q) {
      return NextResponse.json([], { status: 200 });
    }

    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const token = process.env.SANITY_API_TOKEN;

    if (!projectId || !token) {
      return NextResponse.json([], { status: 200 });
    }

    const query = `*[_type == "post" && (title match $term || excerpt match $term)] | order(publishedAt desc)[0..9] { title, slug, excerpt, publishedAt }`;
    
    const url = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/production?query=${encodeURIComponent(query)}&$term=${encodeURIComponent(`*${q}*`)}`;
    
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      return NextResponse.json([], { status: 200 });
    }

    const data = await response.json();
    return NextResponse.json(data.result || [], { status: 200 });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json([], { status: 200 });
  }
}
