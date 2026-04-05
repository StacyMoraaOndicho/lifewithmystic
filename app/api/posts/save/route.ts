import { NextRequest, NextResponse } from 'next/server';
import { updateFallbackPost } from '@/lib/sanity';

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { postId, title, slug, excerpt, body, publishedAt, status, scheduledFor, categories, tags, image } = requestBody;

    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
    const token = process.env.SANITY_API_TOKEN;

    // If Sanity isn't configured, update the in-memory fallback store
    if (!projectId || !token) {
      if (!postId) {
        return NextResponse.json({ message: 'Post ID required when saving locally' }, { status: 400 });
      }

      const updated = updateFallbackPost(postId, {
        title,
        slug: { current: slug },
        excerpt,
        body,
        publishedAt,
      });

      if (!updated) {
        return NextResponse.json({ message: 'Post not found' }, { status: 404 });
      }

      return NextResponse.json(
        {
          message: 'Post updated locally (Sanity not configured)',
          slug,
          id: postId,
        },
        { status: 200 }
      );
    }

    const url = `https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/${dataset}`;

    // Calculate read time (average 200 words per minute)
    const wordCount = body?.text?.split(/\s+/)?.length || 0;
    const readTime = Math.ceil(wordCount / 200);

    const mutation = postId
      ? // Update existing post
        {
          patch: {
            id: postId,
            set: {
              title,
              slug: { current: slug },
              excerpt,
              body,
              publishedAt,
              status: status || 'published',
              scheduledFor: scheduledFor || null,
              categories: categories || [],
              tags: tags || [],
              image: image || null,
              readTime,
              _updatedAt: new Date().toISOString(),
            },
          },
        }
      : // Create new post
        {
          create: {
            _type: 'post',
            title,
            slug: { current: slug },
            excerpt,
            body,
            publishedAt,
            status: status || 'published',
            scheduledFor: scheduledFor || null,
            categories: categories || [],
            tags: tags || [],
            image: image || null,
            readTime,
            views: 0,
            likes: 0,
            bookmarks: 0,
            allowComments: true,
            _createdAt: new Date().toISOString(),
          },
        };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mutations: [mutation] }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save post');
    }

    const result = await response.json();
    const savedPost = result.results?.[0]?.document || result.results?.[0];

    return NextResponse.json(
      {
        message: postId ? 'Post updated successfully' : 'Post created successfully',
        slug: savedPost?.slug?.current || slug,
        id: savedPost?._id || postId,
      },
      { status: postId ? 200 : 201 }
    );
  } catch (err: any) {
    console.error('Post save error:', err);
    return NextResponse.json({ message: err.message || 'Failed to save post' }, { status: 500 });
  }
}
