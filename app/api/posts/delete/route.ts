import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
  try {
    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json({ message: 'Post ID required' }, { status: 400 });
    }

    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
    const token = process.env.SANITY_API_TOKEN;

    if (!projectId || !token) {
      return NextResponse.json({ message: 'Sanity not configured' }, { status: 500 });
    }

    const url = `https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/${dataset}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mutations: [{ delete: { id: postId } }],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete post');
    }

    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
  } catch (err: any) {
    console.error('Delete error:', err);
    return NextResponse.json({ message: err.message || 'Failed to delete post' }, { status: 500 });
  }
}
