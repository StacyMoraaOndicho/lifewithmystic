import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { postId, name, email, text } = await request.json();

    if (!postId || !name || !email || !text) {
      return NextResponse.json({ message: 'All fields required' }, { status: 400 });
    }

    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
    const token = process.env.SANITY_API_TOKEN;

    if (!projectId || !token) {
      return NextResponse.json({ message: 'Sanity not configured' }, { status: 500 });
    }

    const url = `https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/${dataset}`;

    const comment = {
      _type: 'comment',
      _id: `comment-${Date.now()}`,
      post: { _type: 'reference', _ref: postId },
      name,
      email,
      text,
      approved: false, // Require approval
      _createdAt: new Date().toISOString(),
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mutations: [{ create: comment }],
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create comment');
    }

    return NextResponse.json(
      { message: 'Comment submitted for review' },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Comment error:', err);
    return NextResponse.json({ message: err.message || 'Failed to post comment' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ message: 'Post ID required' }, { status: 400 });
    }

    // Fetch approved comments for a post
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
    const token = process.env.SANITY_API_TOKEN;

    if (!projectId || !token) {
      return NextResponse.json({ message: 'Sanity not configured' }, { status: 500 });
    }

    const query = `*[_type == "comment" && post._ref == "${postId}" && approved == true] | order(_createdAt desc)`;
    const url = `https://${projectId}.api.sanity.io/v2023-04-03/data/query/${dataset}?query=${encodeURIComponent(query)}`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await response.json();
    return NextResponse.json(result.result || [], { status: 200 });
  } catch (err: any) {
    console.error('Fetch comments error:', err);
    return NextResponse.json([], { status: 200 });
  }
}
