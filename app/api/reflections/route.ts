import { NextResponse } from 'next/server';
import { supabaseFetch } from '../../../lib/supabase';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    // expected { postId, paragraphIndex, user, text }
    const res = await supabaseFetch('reflections', 'POST', payload);
    if (!res.ok) {
      const t = await res.text();
      return NextResponse.json({ error: t }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const res = await supabaseFetch('reflections', 'GET');
    const json = await res.json();
    return NextResponse.json(json);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
