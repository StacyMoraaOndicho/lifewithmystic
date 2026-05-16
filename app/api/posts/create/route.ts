import { NextRequest, NextResponse } from 'next/server';
import { addFallbackPost } from '@/lib/sanity';

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { title, slug, excerpt, content, publishedAt } = requestBody;

    // 1. Validate inputs
    if (!title || !slug || !excerpt || !content || !publishedAt) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
    const token = process.env.SANITY_API_TOKEN;

    // 2. Prepare standardized Sanity document
    const doc = {
      _type: 'post',
      title,
      slug: { 
        _type: 'slug',
        current: slug 
      },
      excerpt,
      // Convert simple date (YYYY-MM-DD) to full ISO DateTime for Sanity compatibility
      publishedAt: new Date(publishedAt).toISOString(),
      body: [
        {
          _type: 'block',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              text: content,
            },
          ],
        },
      ],
      status: 'published', // Marker for your analytics and filters
    };

    // 3. Handle missing configuration
    if (!token || !projectId || projectId === 'none') {
      const localId = `local-${Date.now()}`;
      addFallbackPost({ ...doc, _id: localId });
      console.warn('Sanity token missing. Post saved to temporary local memory.');
      return NextResponse.json({ message: 'Saved locally (Check Vercel Env Vars)', slug }, { status: 201 });
    }

    // 4. Send mutation to Sanity
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
      console.error('Sanity Mutation Error:', result);
      return NextResponse.json({ message: 'Sanity rejected the post', details: result.error?.message }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Reflection successfully published',
      slug,
      id: result.results?.[0]?.id,
    }, { status: 201 });

  } catch (err: any) {
    console.error('Create Post Logic Error:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
