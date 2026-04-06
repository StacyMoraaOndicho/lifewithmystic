import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-03-25.dahlia' as any,
});

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // 1. Create a Stripe Express account for the writer
    const account = await stripe.accounts.create({
      type: 'express',
      metadata: { userId },
    });

    // 2. Create an account link for the onboarding flow
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${req.headers.get('origin')}/writer/dashboard`,
      return_url: `${req.headers.get('origin')}/writer/dashboard?status=connected&account_id=${account.id}`,
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (err: any) {
    console.error('Stripe Connect error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
