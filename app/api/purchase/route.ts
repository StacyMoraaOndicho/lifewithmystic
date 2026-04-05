import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia',
});

export async function POST(req: Request) {
  try {
    const { productId, productTitle, productPrice, productLink, writerStripeId } = await req.json();

    if (!productId || !writerStripeId) {
      return NextResponse.json({ error: 'Missing required information' }, { status: 400 });
    }

    // Convert price string like "$19" to cents (1900)
    const amount = parseInt(productPrice.replace(/[^0-9]/g, '')) * 100;
    
    // Calculate the 5% platform fee (e.g., 5% of $19.00 is $0.95 or 95 cents)
    const platformFee = Math.round(amount * 0.05);

    // Create a Stripe checkout session with "Destination Charges"
    // This sends the money to the WRITER and takes your 5% fee automatically
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productTitle,
              description: `Digital product from a lifewithmystic creator.`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      payment_intent_data: {
        application_fee_amount: platformFee,
        transfer_data: {
          destination: writerStripeId, // The writer's acct_ID
        },
      },
      success_url: productLink, 
      cancel_url: `${req.headers.get('origin')}/writers`,
      metadata: {
        productId,
        writerStripeId
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Purchase error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
