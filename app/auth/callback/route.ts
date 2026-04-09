import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  // The 'next' parameter allows us to capture where the user should go after confirming
  // We will force Writers to go to /pricing to pay their subscription
  let next = searchParams.get('next') ?? '/blog';

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Exchange the temporary code for a real user session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data?.user) {
      // Logic: If they just signed up via the 'plan=writer' flow, send them to pay
      const userMetadata = data.user.user_metadata;
      if (next.includes('/pricing') || userMetadata?.plan === 'writer') {
        return NextResponse.redirect(`${origin}/pricing`);
      }
      
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Fallback to login with an error message if something went wrong
  return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`);
}
