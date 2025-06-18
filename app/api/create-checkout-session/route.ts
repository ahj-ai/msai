import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';
import { MATHSTACK_PRO_PRICE_ID } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      priceId, 
      mode = 'payment', 
      successUrl, 
      cancelUrl,
      metadata = {} 
    } = await req.json();

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
    }

    // Base session configuration
    // Use environment variable for production, fallback to localhost for development
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    let successUrlBase = `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    
    // Add purchase type and stacks amount to success URL if it's a one-time payment
    if (mode === 'payment' && metadata?.stacks) {
      successUrlBase += `&type=stacks&stacks=${metadata.stacks}`;
    }
    
    const successUrlFormatted = successUrl || successUrlBase;
    const cancelUrlFormatted = cancelUrl || `${baseUrl}/pricing`;
      
    const sessionConfig: any = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode,
      success_url: successUrlFormatted,
      cancel_url: cancelUrlFormatted,
      // Add user ID to session metadata
      metadata: {
        userId,
        ...metadata,
      },
    };

    // For subscription mode, add subscription-specific metadata
    if (mode === 'subscription') {
      sessionConfig.subscription_data = {
        metadata: {
          userId,
          productType: 'subscription',
          ...metadata,
        },
      };
    }

    // For payment mode, add payment intent metadata
    if (mode === 'payment') {
      sessionConfig.payment_intent_data = {
        metadata: {
          userId,
          productType: 'payment',
          ...metadata,
        },
      };
    }

    // Allow email collection for better customer experience
    sessionConfig.customer_email = undefined; // Let Stripe handle this
    sessionConfig.billing_address_collection = 'auto';

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ 
      url: session.url,
      sessionId: session.id 
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}
