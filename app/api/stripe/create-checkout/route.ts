import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { currentUser } from '@clerk/nextjs/server';
import { stripe, MATHSTACK_PRO_PRICE_ID } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

// This endpoint creates a Stripe checkout session for subscription purchases
export async function POST(req: Request) {
  try {
    // Verify authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized: You must be logged in' },
        { status: 401 }
      );
    }

    // Get the current user to access their email
    const user = await currentUser();
    if (!user || !user.emailAddresses || user.emailAddresses.length === 0) {
      return NextResponse.json(
        { error: 'User email not found' },
        { status: 400 }
      );
    }

    const primaryEmail = user.emailAddresses[0].emailAddress;
    
    // Check if the user already has a subscription
    const { data: subscriptions } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .limit(1);

    if (subscriptions && subscriptions.length > 0) {
      return NextResponse.json(
        { error: 'You already have an active subscription' },
        { status: 400 }
      );
    }

    // Create or retrieve the Stripe customer
    let customerId: string;
    
    // Check if the user already has a customer ID stored
    const { data: profiles } = await supabase
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .limit(1);
    
    if (profiles && profiles.length > 0 && profiles[0].stripe_customer_id) {
      // Use existing Stripe customer
      customerId = profiles[0].stripe_customer_id;
    } else {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: primaryEmail,
        metadata: {
          userId: userId
        }
      });
      
      customerId = customer.id;
      
      // Save the customer ID to the user profile
      await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          stripe_customer_id: customerId,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
    }
    
    // Create the checkout session
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { error: 'Base URL is not set. Please set NEXT_PUBLIC_BASE_URL in your environment.' },
        { status: 500 }
      );
    }
    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: MATHSTACK_PRO_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/canceled`,
      metadata: {
        userId: userId
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      customer_update: {
        address: 'auto'
      },
      automatic_tax: { enabled: true }
    });
    
    if (!session.url) {
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
