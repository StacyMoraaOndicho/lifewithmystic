import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// We need a service role client to bypass RLS and update user roles
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) {
      console.error('Missing stripe-signature or webhook secret');
      return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
    }
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const userId = session.client_reference_id;
    const stripeCustomerId = session.customer as string;

    if (userId) {
      // Update the user's profile in Supabase
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({ 
          role: 'writer',
          is_subscribed: true,
          stripe_customer_id: stripeCustomerId
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }

      console.log(`User ${userId} successfully upgraded to Writer role.`);
    }
  }

  return NextResponse.json({ received: true });
}
