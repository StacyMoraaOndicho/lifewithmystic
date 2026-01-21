import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { postId, action, value } = await request.json();

    if (!postId || !action) {
      return NextResponse.json({ message: 'Post ID and action required' }, { status: 400 });
    }

    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
    const token = process.env.SANITY_API_TOKEN;

    if (!projectId || !token) {
      return NextResponse.json({ message: 'Sanity not configured' }, { status: 500 });
    }

    const url = `https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/${dataset}`;

    // Prepare mutation based on action
    let mutation;

    if (action === 'view') {
      mutation = {
        patch: {
          id: postId,
          inc: { views: value || 1 },
        },
      };
    } else if (action === 'like') {
      mutation = {
        patch: {
          id: postId,
          inc: { likes: value || 1 },
        },
      };
    } else if (action === 'bookmark') {
      mutation = {
        patch: {
          id: postId,
          inc: { bookmarks: value || 1 },
        },
      };
    }

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
      throw new Error(error.message || 'Failed to track analytics');
    }

    return NextResponse.json({ message: 'Analytics recorded' }, { status: 200 });
  } catch (err: any) {
    console.error('Analytics error:', err);
    return NextResponse.json({ message: err.message || 'Failed to track analytics' }, { status: 500 });
  }
}
