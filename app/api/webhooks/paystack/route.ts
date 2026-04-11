import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('x-paystack-signature');

  // Verify the signature
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
    .update(body)
    .digest('hex');

  if (hash !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.event === 'charge.success') {
    const userId = event.data.metadata?.userId;

    if (userId) {
      // UPSERT: This creates the profile if it doesn't exist, OR updates it if it does.
      // This ensures the user is ALWAYS marked as active after paying.
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: userId, 
          subscription_status: 'active',
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (error) {
        console.error('Database sync failed:', error.message);
        return NextResponse.json({ error: 'DB sync failed' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
