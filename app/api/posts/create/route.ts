import { NextRequest, NextResponse } from 'next/server';
import { addFallbackPost } from '@/lib/sanity';

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { title, slug, excerpt, body, publishedAt } = requestBody;

    // Validate required fields
    if (!title || !slug || !excerpt || !body || !publishedAt) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
    const token = process.env.SANITY_API_TOKEN;

    // Post structure for Sanity
    const doc = {
      _type: 'post',
      title,
      slug: { 
        _type: 'slug',
        current: slug 
      },
      excerpt,
      body,
      publishedAt,
      status: 'published', // Ensure it shows up in filtered queries
    };

    // If token is missing, use local fallback
    if (!token || !projectId) {
      const localId = `local-${Date.now()}`;
      addFallbackPost({ ...doc, _id: localId });
      return NextResponse.json({ message: 'Saved to local memory (Token missing)', slug }, { status: 201 });
    }

    // Send to Sanity
    const response = await fetch(
      `https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/${dataset}?returnIds=true`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mutations: [{ create: doc }],
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('Sanity Error:', result);
      return NextResponse.json({ message: 'Sanity rejected the post', error: result }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Reflection successfully published to the Sanctuary',
      slug,
      id: result.results?.[0]?.id,
    }, { status: 201 });

  } catch (err: any) {
    console.error('Create Post Error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
