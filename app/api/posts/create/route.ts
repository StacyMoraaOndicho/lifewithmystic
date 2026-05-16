import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { title, slug, excerpt, content, publishedAt, userId } = await request.json();

    // 1. Mandatory Fields Check
    if (!title || !slug || !content) {
      return NextResponse.json({ message: 'Title, Slug, and Content are required' }, { status: 400 });
    }

    // 2. Initialize Supabase with Service Role to bypass security for the Admin action
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 3. Insert the Reflection into the Collective
    const { data, error } = await supabase
      .from('posts')
      .insert({
        title,
        slug,
        excerpt,
        content,
        published_at: publishedAt || new Date().toISOString(),
        author_id: userId,
        status: 'published'
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error.message);
      return NextResponse.json({ message: 'Database failure: ' + error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Reflection successfully published',
      slug: data.slug,
      id: data.id
    }, { status: 201 });

  } catch (err: any) {
    console.error('Internal Error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
