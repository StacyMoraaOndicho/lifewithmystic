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

    // Get Sanity credentials from environment
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
    const token = process.env.SANITY_API_TOKEN;

    // If Sanity isn't configured, fall back to the in-memory store.
    if (!projectId || !token) {
      const localId = `local-${Date.now()}`;

      addFallbackPost({
        _id: localId,
        title,
        slug: { current: slug },
        excerpt,
        body,
        publishedAt,
      });

      return NextResponse.json(
        {
          message: 'Post created locally (Sanity not configured)',
          slug,
          id: localId,
        },
        { status: 201 }
      );
    }

    // Create document in Sanity
    const doc = {
      _type: 'post',
      title,
      slug: { current: slug },
      excerpt,
      body,
      publishedAt,
    };

    const response = await fetch(
      `https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/${dataset}`,
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

    if (!response.ok) {
      const error = await response.json();
      console.error('Sanity error:', error);
      return NextResponse.json(
        { message: 'Failed to create post in Sanity', error },
        { status: 500 }
      );
    }

    const result = await response.json();
    const createdDoc = result.results?.[0]?.document;

    return NextResponse.json(
      {
        message: 'Post created successfully',
        slug,
        id: createdDoc?._id,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Error creating post:', err);
    return NextResponse.json(
      { message: 'Internal server error', error: err.message },
      { status: 500 }
    );
  }
}
