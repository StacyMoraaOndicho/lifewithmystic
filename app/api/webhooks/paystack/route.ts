import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('x-paystack-signature');

  // 1. Verify Paystack Signature
  const secret = process.env.PAYSTACK_SECRET_KEY!;
  const hash = crypto.createHmac('sha512', secret).update(body).digest('hex');

  if (hash !== signature) {
    console.error('Invalid Paystack signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(body);

  // 2. Handle successful charge
  if (event.event === 'charge.success') {
    const userId = event.data.metadata?.userId;

    if (userId) {
      // Initialize Supabase with Service Role Key to bypass RLS
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      console.log(`Unlocking sanctuary for user: ${userId}`);

      const { error } = await supabase
        .from('profiles')
        .update({ subscription_status: 'active' })
        .eq('id', userId);

      if (error) {
        console.error('Webhook DB Error:', error.message);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
