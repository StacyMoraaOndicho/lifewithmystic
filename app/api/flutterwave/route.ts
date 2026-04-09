import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userId, userEmail, amount, currency, planName } = await req.json();

    // Flutterwave standard checkout payload
    const payload = {
      tx_ref: `lwm-${userId}-${Date.now()}`,
      amount: amount || 9,
      currency: currency || 'USD',
      redirect_url: `${req.headers.get('origin')}/writer/dashboard?status=success`,
      meta: {
        consumer_id: userId,
        plan: planName
      },
      customer: {
        email: userEmail,
        name: userEmail.split('@')[0]
      },
      customizations: {
        title: "lifewithmystic Sanctuary",
        description: `Subscription for ${planName} Plan`,
        logo: "https://lifewithmystic.vercel.app/favicon.ico"
      }
    };

    // We call Flutterwave's API
    const response = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.status === 'success') {
      return NextResponse.json({ url: data.data.link });
    } else {
      return NextResponse.json({ error: data.message || 'Gateway error' }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
