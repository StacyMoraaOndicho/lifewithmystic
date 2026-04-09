import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  // Default path if no specific instruction is found
  let next = searchParams.get('next') ?? '/blog';

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Exchange the temporary code for a real user session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data?.user) {
      const user = data.user;
      const userMetadata = user.user_metadata;

      // PRO LOGIC: If they are a writer, trigger the checkout session immediately
      if (next.includes('/pricing') || userMetadata?.plan === 'writer') {
        try {
          // We call our own API to generate a Stripe session for this confirmed user
          const checkoutResponse = await fetch(`${origin}/api/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              userEmail: user.email,
            }),
          });

          const checkoutData = await checkoutResponse.json();
          
          if (checkoutData.url) {
            // DIRECT TO STRIPE: Send them straight to the payment gateway
            return NextResponse.redirect(checkoutData.url);
          }
        } catch (checkoutErr) {
          console.error('Auto-checkout failed:', checkoutErr);
          // Fallback to pricing page if auto-checkout fails
          return NextResponse.redirect(`${origin}/pricing`);
        }
      }
      
      // If seeker or already paid, send to the original destination
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Handle failure
  return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`);
}
