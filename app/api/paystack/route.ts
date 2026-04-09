import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId, userEmail, amount } = await req.json();

    // Paystack expects amount in Kobo/Cents (e.g., $9.00 = 900)
    // If you want to charge in KES, you'd change the currency below
    const paystackAmount = amount * 100; 

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: userEmail,
        amount: paystackAmount,
        currency: 'USD', // Paystack supports USD, KES, NGN etc.
        callback_url: `${req.headers.get('origin')}/writer/dashboard?status=success`,
        metadata: {
          userId: userId,
          custom_fields: [
            {
              display_name: "Plan",
              variable_name: "plan",
              value: "Writer Subscription"
            }
          ]
        }
      })
    });

    const data = await response.json();

    if (data.status) {
      return NextResponse.json({ url: data.data.authorization_url });
    } else {
      return NextResponse.json({ error: data.message || 'Paystack initialization failed' }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
