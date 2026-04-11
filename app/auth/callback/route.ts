import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data?.user) {
      const user = data.user;
      const plan = user.user_metadata?.plan;

      // MANDATORY: All writers MUST be sent to the force-payment trigger
      if (plan === 'writer') {
        return NextResponse.redirect(`${origin}/pricing?status=confirmed&plan=writer&force=true&t=${Date.now()}`);
      }
      
      return NextResponse.redirect(`${origin}/blog`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`);
}
