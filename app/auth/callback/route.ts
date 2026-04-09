import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Exchange code for session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // After confirmation, always send them to the dashboard.
      // The dashboard itself will handle the "Must Pay" logic.
      return NextResponse.redirect(`${origin}/writer/dashboard`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`);
}
