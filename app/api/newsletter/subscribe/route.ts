import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for demo (replace with database in production)
const subscribers = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ message: 'Valid email required' }, { status: 400 });
    }

    // Check if already subscribed
    if (subscribers.has(email)) {
      return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
    }

    // Add to subscribers (in production, save to database/email service)
    subscribers.add(email);

    // TODO: Integrate with Mailchimp, ConvertKit, or email service
    // Example: Save to Supabase, call Mailchimp API, etc.

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter!' },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Newsletter error:', err);
    return NextResponse.json({ message: err.message || 'Subscription failed' }, { status: 500 });
  }
}

export async function GET() {
  // For admin to see subscriber count
  return NextResponse.json(
    { subscriberCount: subscribers.size },
    { status: 200 }
  );
}
