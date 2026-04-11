import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  // Respect the 'next' parameter from the signup link (usually /pricing for writers)
  const next = searchParams.get('next') ?? '/writer/dashboard';

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Send them to the intended destination (e.g., /pricing?status=confirmed)
      return NextResponse.redirect(`${origin}${next}${next.includes('?') ? '&' : '?'}status=confirmed`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`);
}
