import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId, userEmail } = await req.json();

    // Paystack KES amounts are in cents (1200.00 = 120000)
    const kesAmount = 1200 * 100; 

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: userEmail,
        amount: kesAmount,
        currency: 'KES',
        channels: ['card', 'mobile_money', 'bank_transfer'],
        callback_url: `${req.headers.get('origin')}/writer/dashboard?status=success`,
        // CRITICAL: Ensure metadata matches what the webhook expects
        metadata: {
          userId: userId
        }
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
