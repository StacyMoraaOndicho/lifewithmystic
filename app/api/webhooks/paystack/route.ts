import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('x-paystack-signature');
  const secret = process.env.PAYSTACK_SECRET_KEY!;

  const hash = crypto.createHmac('sha512', secret).update(body).digest('hex');
  if (hash !== signature) return NextResponse.json({ error: 'Invalid' }, { status: 401 });

  const event = JSON.parse(body);

  if (event.event === 'charge.success') {
    const userId = event.data.metadata?.userId;
    if (userId) {
      // Use Service Role to bypass RLS and force the update
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
      
      await supabase.from('profiles').upsert({ 
        id: userId, 
        subscription_status: 'active',
        role: 'writer',
        updated_at: new Date().toISOString()
      });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
