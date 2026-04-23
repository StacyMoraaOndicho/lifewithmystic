import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // 1. Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data?.user) {
      const user = data.user;
      
      // 2. Fetch the profile to check if they are already active
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status, role')
        .eq('id', user.id)
        .maybeSingle();

      const isActive = profile?.subscription_status === 'active';
      const isWriter = user.user_metadata?.plan === 'writer' || profile?.role === 'writer';

      // 3. MANDATORY GATE: If it's a writer and NOT active, force them to pay
      if (isWriter && !isActive) {
        return NextResponse.redirect(`${origin}/pricing?status=confirmed&plan=writer&force_gateway=true`);
      }
      
      // Otherwise, proceed to the blog
      return NextResponse.redirect(`${origin}/blog`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`);
}
