import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getStripe, PLAN_PRO } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Create Supabase client with service role key for webhook operations (bypasses RLS)
const supabaseServiceRole = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Safely converts a Unix timestamp to an ISO string date
 * This prevents RangeError: Invalid time value errors
 */
function safelyGetISOString(unixTimestamp: number | null | undefined): string {
  try {
    if (!unixTimestamp) {
      return new Date().toISOString();
    }
    
    // Convert from seconds to milliseconds if needed
    const timestamp = unixTimestamp < 10000000000 ? unixTimestamp * 1000 : unixTimestamp;
    const date = new Date(timestamp);
    
    // Validate the date is valid before converting to ISO string
    if (isNaN(date.getTime())) {
      console.error('Invalid timestamp received:', unixTimestamp);
      return new Date().toISOString();
    }
    
    return date.toISOString();
  } catch (error) {
    console.error('Error processing timestamp:', error);
    return new Date().toISOString();
  }
}

// Webhook handler for Stripe events
export async function POST(req: Request) {
  console.log('🔔 Webhook received at:', new Date().toISOString());
  const body = await req.text();
  const signature = headers().get('stripe-signature') as string;
  
  if (!signature) {
    console.error('❌ Missing stripe-signature header');
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }
  
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('❌ Missing STRIPE_WEBHOOK_SECRET');
    return NextResponse.json({ error: 'Webhook secret is not configured' }, { status: 500 });
  }
  
  let event: Stripe.Event;
  
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
    console.log('✅ Webhook signature verified. Event type:', event.type);
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }
  
  console.log('📦 Processing event:', event.type, 'with ID:', event.id);
  
  try {
    switch (event.type) {
      // When a checkout session is completed successfully
      case 'checkout.session.completed':
        console.log('🛒 Processing checkout.session.completed');
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      // When a subscription is updated (e.g. plan change, renewal, etc.)
      case 'customer.subscription.updated':
        console.log('🔄 Processing customer.subscription.updated');
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      
      // When a subscription is cancelled
      case 'customer.subscription.deleted':
        console.log('❌ Processing customer.subscription.deleted');
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      // Payment failures
      case 'invoice.payment_failed':
        console.log('🚫 Processing invoice.payment_failed');
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      // When a one-time payment is successful (for credits/stacks)
      case 'payment_intent.succeeded':
        console.log('💳 Processing payment_intent.succeeded');
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('🔍 Processing checkout session:', session.id);
  console.log('🔍 Session mode:', session.mode);
  console.log('🔍 Session metadata:', session.metadata);
  
  const userId = session.metadata?.userId;
  if (!userId) {
    console.error('❌ No userId in session metadata');
    return;
  }

  console.log('✅ Found userId in metadata:', userId);

  if (session.mode === 'subscription') {
    return handleSubscriptionCheckout(session, userId);
  } else if (session.mode === 'payment') {
    return handleOneTimePaymentCheckout(session, userId);
  } else {
    console.log('⚠️ Skipping unsupported checkout mode:', session.mode);
    return;
  }
}

async function handleSubscriptionCheckout(session: Stripe.Checkout.Session, userId: string) {
  // Get subscription details
  if (!session.subscription) {
    console.error('No subscription in session');
    return;
  }

  const subscription = await getStripe().subscriptions.retrieve(
    session.subscription as string
  );

  // Get customer details
  const customer = await getStripe().customers.retrieve(
    subscription.customer as string
  );
  
  if (!customer || customer.deleted) {
    console.error('Customer not found or deleted');
    return;
  }

  // Determine plan type from product/price ID
  const priceId = subscription.items.data[0]?.price.id;
  const planType = PLAN_PRO; // Assuming all subscriptions via checkout are Pro plans

  // Store subscription in database
  console.log('Attempting to store subscription in Supabase for user:', userId);
  try {
    // First, check if a subscription record exists for this user
    const { data: existingSubscription, error: fetchError } = await supabaseServiceRole
      .from('user_subscriptions')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (fetchError) {
      console.error('Error checking for existing subscription:', fetchError);
      return;
    }
    
    // Prepare subscription data
    const subscriptionData = {
      user_id: userId,
      stripe_customer_id: subscription.customer as string,
      stripe_subscription_id: subscription.id,
      subscription_id: subscription.id, // Keep both for compatibility
      status: subscription.status,
      plan: planType,
      price_id: priceId,
      usage_period_ends_at: safelyGetISOString((subscription as any).current_period_end),
      updated_at: new Date().toISOString()
    };
    
    let error;
    
    if (existingSubscription?.id) {
      // Update existing subscription
      console.log('Updating existing subscription for user:', userId);
      const { error: updateError } = await supabaseServiceRole
        .from('user_subscriptions')
        .update(subscriptionData)
        .eq('id', existingSubscription.id);
      
      error = updateError;
    } else {
      // Insert new subscription
      console.log('Creating new subscription for user:', userId);
      const { error: insertError } = await supabaseServiceRole
        .from('user_subscriptions')
        .insert(subscriptionData);
      
      error = insertError;
    }

    if (error) {
      console.error('Error storing subscription in Supabase:', error);
    } else {
      console.log('Successfully stored subscription in Supabase');
      
      // Credit the initial 300 stacks for Pro subscription
      console.log('🎁 Crediting 300 stacks for Pro subscription');
      
      try {
        // First, get existing credits
        console.log('📊 Fetching existing stacks for user:', userId);
        const { data: existingProfile, error: fetchError } = await supabaseServiceRole
          .from('user_profiles')
          .select('stacks')
          .eq('user_id', userId)
          .single();
        
        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('❌ Error fetching existing stacks:', fetchError);
        }
        
        const currentStacks = existingProfile?.stacks || 0;
        const bonusStacks = 300; // Pro subscription bonus
        const newStackTotal = currentStacks + bonusStacks;
        
        console.log('📊 Current stacks:', currentStacks);
        console.log('📊 Bonus stacks:', bonusStacks);
        console.log('📊 New stack total:', newStackTotal);
        
        // Update user's stack balance - IMPORTANT: user_profiles table has a primary key on user_id
        const { data: updateData, error: updateError } = await supabaseServiceRole
          .from('user_profiles')
          .upsert({
            user_id: userId,
            stacks: newStackTotal,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });
        
        if (updateError) {
          console.error('❌ Error updating stacks for Pro subscription:', updateError);
        } else {
          console.log('✅ Successfully credited 300 stacks for Pro subscription. New total:', newStackTotal);
          console.log('✅ Update result:', updateData);
          
          // Log the stack credit transaction
          const { error: txError } = await supabaseServiceRole
            .from('user_transactions')
            .insert({
              user_id: userId,
              amount: 0, // Subscription price already logged separately
              currency: 'usd',
              payment_id: subscription.id,
              product_id: subscription.items.data[0]?.price.product as string,
              transaction_type: 'subscription_bonus_stacks',
            });
          
          if (txError) {
            console.error('❌ Error logging bonus stacks transaction:', txError);
          } else {
            console.log('✅ Successfully logged bonus stacks transaction');
          }
        }
      } catch (err) {
        console.error('💥 Exception when crediting Pro subscription bonus stacks:', err);
      }
    }
  } catch (err) {
    console.error('Exception when storing subscription:', err);
  }

  // Log transaction
  try {
    const price = subscription.items.data[0]?.price;
    if (price) {
      const { error } = await supabaseServiceRole
        .from('user_transactions')
        .insert({
          user_id: userId,
          amount: price.unit_amount || 0,
          currency: price.currency || 'usd',
          payment_id: (session as any).payment_intent as string,
          product_id: price.product as string,
          transaction_type: 'subscription_created',
        });
        
      if (error) {
        console.error('Error logging transaction in Supabase:', error);
      } else {
        console.log('Successfully logged transaction in Supabase');  
      }
    }
  } catch (err) {
    console.error('Exception when logging transaction:', err);
  }

  console.log(`Subscription created for user ${userId}`);
}

async function handleOneTimePaymentCheckout(session: Stripe.Checkout.Session, userId: string) {
  console.log('🛒 Processing one-time payment checkout for user:', userId);
  console.log('🛒 Session ID:', session.id);
  console.log('🛒 Payment Intent:', session.payment_intent);
  
  if (!session.payment_intent) {
    console.error('❌ No payment_intent in one-time payment session');
    return;
  }

  // Get the line items to determine what was purchased
  console.log('📋 Fetching line items for session:', session.id);
  const lineItems = await getStripe().checkout.sessions.listLineItems(session.id, {
    expand: ['data.price.product']
  });

  console.log('📋 Found', lineItems.data.length, 'line items');

  for (const item of lineItems.data) {
    const price = item.price;
    if (!price) {
      console.log('⚠️ Skipping item with no price');
      continue;
    }

    console.log('💰 Processing price:', price.id);
    
    // Get price metadata to determine stack amount
    const priceDetails = await getStripe().prices.retrieve(price.id);
    console.log('💰 Price metadata:', priceDetails.metadata);
    const stacksToCredit = priceDetails.metadata?.stacks ? parseInt(priceDetails.metadata.stacks) : 0;
    
    console.log('🎯 Stacks to credit:', stacksToCredit);
    
    if (stacksToCredit > 0) {
      console.log(`🚀 Crediting ${stacksToCredit} stacks to user ${userId}`);
      
      // Update user credits
      try {
        // First, get existing credits
        console.log('📊 Fetching existing credits for user:', userId);
        const { data: existingCredits, error: fetchError } = await supabaseServiceRole
          .from('user_profiles')
          .select('stacks')
          .eq('user_id', userId)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('❌ Error fetching existing credits:', fetchError);
        }

        const currentStacks = existingCredits?.stacks || 0;
        const newStackTotal = currentStacks + stacksToCredit;
        
        console.log('📊 Current stacks:', currentStacks);
        console.log('📊 New stack total:', newStackTotal);

        const { data: updateData, error } = await supabaseServiceRole
          .from('user_profiles')
          .upsert({
            user_id: userId,
            stacks: newStackTotal,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });

        if (error) {
          console.error('❌ Error updating user credits:', error);
        } else {
          console.log(`✅ Successfully credited ${stacksToCredit} stacks. New total: ${newStackTotal}`);
          console.log('✅ Update result:', updateData);
        }
      } catch (err) {
        console.error('💥 Exception when updating user credits:', err);
      }
    } else {
      console.log('⚠️ No stacks to credit for this price');
    }

    // Log transaction
    try {
      const { error } = await supabaseServiceRole
        .from('user_transactions')
        .insert({
          user_id: userId,
          amount: price.unit_amount || 0,
          currency: price.currency || 'usd',
          payment_id: session.payment_intent as string,
          product_id: typeof price.product === 'string' ? price.product : price.product?.id || null,
          transaction_type: 'credit_purchase',
        });
        
      if (error) {
        console.error('❌ Error logging credit purchase transaction:', error);
      } else {
        console.log('✅ Successfully logged credit purchase transaction');  
      }
    } catch (err) {
      console.error('💥 Exception when logging transaction:', err);
    }
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  // Get the customer ID
  const customerId = subscription.customer as string;
  
  // First try to find the user from existing subscriptions
  const { data: subscriptionData } = await supabaseServiceRole
    .from('user_subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .limit(1);
  
  if (!subscriptionData || subscriptionData.length === 0) {
    console.error(`No subscription found for customer ${customerId}`);
    return;
  }

  const userId = subscriptionData[0].user_id;
  const priceId = subscription.items.data[0]?.price.id;
  
  // Update subscription in database
  await supabaseServiceRole
    .from('user_subscriptions')
    .upsert({
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscription.id,
      subscription_id: subscription.id, // Keep both for compatibility
      status: subscription.status,
      plan: PLAN_PRO, // Using 'plan' column from database schema
      price_id: priceId,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' });

  console.log(`Subscription updated for user ${userId}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // Get the customer ID
  const customerId = subscription.customer as string;
  
  // Find the user from existing subscriptions
  const { data: subscriptionData } = await supabaseServiceRole
    .from('user_subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .limit(1);
  
  if (!subscriptionData || subscriptionData.length === 0) {
    console.error(`No subscription found for customer ${customerId}`);
    return;
  }

  const userId = subscriptionData[0].user_id;
  
  // Update subscription in database to mark as canceled
  await supabaseServiceRole
    .from('user_subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);

  // Log transaction
  await supabaseServiceRole
    .from('user_transactions')
    .insert({
      user_id: userId,
      amount: 0,
      currency: 'usd',
      payment_id: null,
      product_id: null,
      transaction_type: 'subscription_canceled',
    });

  console.log(`Subscription canceled for user ${userId}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  // Get the customer ID
  const customerId = invoice.customer as string;
  
  // Find the user from existing subscriptions
  const { data: subscriptionData } = await supabaseServiceRole
    .from('user_subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .limit(1);
  
  if (!subscriptionData || subscriptionData.length === 0) {
    console.error(`No subscription found for customer ${customerId}`);
    return;
  }

  const userId = subscriptionData[0].user_id;
  
  // Update subscription in database
  await supabaseServiceRole
    .from('user_subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId);

  // Log transaction
  await supabaseServiceRole
    .from('user_transactions')
    .insert({
      user_id: userId,
      amount: invoice.amount_due || 0,
      currency: invoice.currency || 'usd',
      payment_id: (invoice as any).payment_intent as string,
      product_id: null,
      transaction_type: 'payment_failed',
    });

  console.log(`Payment failed for user ${userId}`);
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Processing payment intent succeeded:', paymentIntent.id);
  
  // Check if this payment intent has metadata with userId
  const userId = paymentIntent.metadata?.userId;
  if (!userId) {
    console.log('No userId in payment intent metadata, skipping');
    return;
  }

  // This handles cases where payment_intent.succeeded fires before checkout.session.completed
  // or for direct payment intent usage (not through checkout)
  console.log(`Payment intent succeeded for user ${userId}, amount: ${paymentIntent.amount}`);
  
  // Log the successful payment
  try {
    const { error } = await supabaseServiceRole
      .from('user_transactions')
      .insert({
        user_id: userId,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        payment_id: paymentIntent.id,
        product_id: paymentIntent.metadata?.product_id || null,
        transaction_type: 'payment_succeeded',
      });
      
    if (error) {
      console.error('Error logging payment intent success:', error);
    } else {
      console.log('Successfully logged payment intent success');  
    }
  } catch (err) {
    console.error('Exception when logging payment intent success:', err);
  }
}
