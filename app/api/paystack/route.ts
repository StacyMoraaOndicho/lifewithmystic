import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId, userEmail } = await req.json();

    if (!process.env.PAYSTACK_SECRET_KEY) {
      return NextResponse.json({ error: 'Paystack Secret Key is missing in environment' }, { status: 500 });
    }

    // Amount: $9.00 -> ~1,200 KES (Paystack KES is in cents: 120000)
    const amount = 1200 * 100; 

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: userEmail,
        amount: amount,
        currency: 'KES',
        callback_url: `${req.headers.get('origin')}/writer/dashboard?status=success`,
        metadata: { userId }
      })
    });

    const data = await response.json();

    if (data.status) {
      return NextResponse.json({ url: data.data.authorization_url });
    } else {
      return NextResponse.json({ error: data.message }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
