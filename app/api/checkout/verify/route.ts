import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@clerk/nextjs/server';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'You must be logged in to verify a purchase' }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.client_reference_id !== userId && session.metadata?.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ success: false, message: 'Payment not completed' }, { status: 400 });
    }
    return NextResponse.json({ 
      success: true, 
      mode: session.mode, 
      customerId: session.customer, 
      subscriptionId: session.subscription 
    });
  } catch (error) {
    console.error('Error verifying checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to verify checkout session' },
      { status: 500 }
    );
  }
}
