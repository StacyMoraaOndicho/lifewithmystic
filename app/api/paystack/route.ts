import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId, userEmail } = await req.json();

    // Convert $9 to KES (Standard rate approx 1200 KES)
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
        currency: 'KES', // Switched to KES for Kenya compatibility
        channels: ['card', 'mobile_money', 'bank_transfer'], // Explicitly enable M-Pesa
        callback_url: `${req.headers.get('origin')}/writer/dashboard?status=success`,
        metadata: {
          userId: userId,
          plan: "Writer Subscription"
        }
      })
    });

    const data = await response.json();

    if (data.status) {
      return NextResponse.json({ url: data.data.authorization_url });
    } else {
      // Log the specific error from Paystack for debugging
      console.error('Paystack Error:', data.message);
      return NextResponse.json({ error: data.message }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
