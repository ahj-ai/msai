import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

// Mark this endpoint as a dynamic route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    // Get the session id from the URL
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { valid: false, error: 'Missing session ID' },
        { status: 400 }
      );
    }

    // Verify authentication (optional - you might want to make this publicly accessible)
    const { userId } = await auth();

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { valid: false, error: 'Invalid session' },
        { status: 400 }
      );
    }

    // If we get here, the session is valid
    // You could also check if the subscription is properly recorded in your database
    if (userId && session.metadata?.userId === userId) {
      // Extra validation if the user is authenticated - make sure this session belongs to them
      return NextResponse.json({ valid: true, session: {
        customer: session.customer,
        subscription: session.subscription,
        status: session.status,
        payment_status: session.payment_status
      }});
    } else {
      // Public validation - just confirm the session exists and is complete
      return NextResponse.json({ valid: session.status === 'complete', session: {
        status: session.status,
        payment_status: session.payment_status
      }});
    }
  } catch (error: any) {
    console.error('Error verifying session:', error);
    return NextResponse.json(
      { valid: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
