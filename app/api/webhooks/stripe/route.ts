import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { supabase } from '@/lib/supabase';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

// Handle various Stripe webhook events
export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Error verifying webhook signature:', err);
    return NextResponse.json(
      { error: 'Invalid webhook signature' },
      { status: 400 }
    );
  }

  console.log(`Webhook event received: ${event.type}`);

  try {
    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        
        if (!userId) {
          console.error('No user ID found in session:', session.id);
          break;
        }
        
        if (session.mode === 'subscription') {
          // Handle subscription purchase
          const subscriptionId = session.subscription as string;
          await handleSubscriptionCreated(userId, subscriptionId);
        } else if (session.mode === 'payment') {
          // For one-time purchases, we need to retrieve the session to get line items
          const expandedSession = await stripe.checkout.sessions.retrieve(
            session.id,
            { expand: ['line_items.data.price'] }
          );
          // Handle one-time purchase (stack packs)
          await handleStackPackPurchase(userId, expandedSession);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        // Type cast needed because TypeScript types don't match Stripe's actual response structure
        const subscriptionId = (invoice as any).subscription as string;
        
        if (subscriptionId) {
          // Get the subscription to find the customer
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const customerId = subscription.customer as string;
          
          // Find the user ID from the customer ID
          const { data: userData } = await supabase
            .from('user_subscriptions')
            .select('user_id')
            .eq('stripe_customer_id', customerId)
            .single();
          
          if (userData) {
            // Add monthly stacks for subscription renewal
            await addMonthlyStacksForSubscription(userData.user_id);

            // Update subscription renewal date
            await updateSubscriptionRenewalDate(
              userData.user_id, 
              subscriptionId,
              ((invoice as any).current_period_end as number) * 1000 // Convert to milliseconds
            );
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        // Handle subscription updates (plan changes, etc.)
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        // Handle subscription cancellations
        await handleSubscriptionCancelled(subscription);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook event:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// Helper function to handle subscription creation
async function handleSubscriptionCreated(userId: string, subscriptionId: string) {
  try {
    // Retrieve subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const customerId = subscription.customer as string;
    const status = subscription.status;
    const priceId = subscription.items.data[0].price.id;
    // Type cast needed because TypeScript types don't match Stripe's actual response structure
    const currentPeriodEnd = new Date(((subscription as any).current_period_end as number) * 1000);

    // Update or create subscription record in Supabase
    const { error } = await supabase.from('user_subscriptions').upsert({
      user_id: userId,
      stripe_subscription_id: subscriptionId,
      stripe_customer_id: customerId,
      status,
      plan_id: priceId,
      current_period_end: currentPeriodEnd.toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end
    });

    if (error) throw error;

    // Add monthly stacks for new subscription
    await addMonthlyStacksForSubscription(userId);
    
  } catch (error) {
    console.error('Error handling subscription creation:', error);
    throw error;
  }
}

// Helper function to handle stack pack purchase
async function handleStackPackPurchase(userId: string, session: Stripe.Checkout.Session) {
  try {
    // Determine how many stacks to add based on the price ID
    const priceId = session.line_items?.data[0]?.price?.id || '';
    console.log('Stack pack purchase with price ID:', priceId);
    
    // Define stack amounts for different price IDs with your actual price IDs
    const stackAmounts: Record<string, number> = {
      'price_1RY9hP04B8TSHNkkEsK9Fx4O': 50,  // Small pack - 50 stacks
      'price_1RY9ht04B8TSHNkkhPf35GdM': 150, // Large pack - 150 stacks
    };
    
    // Default to 10 stacks if price ID not found
    const stacksToAdd = stackAmounts[priceId] || 10;
    console.log(`Adding ${stacksToAdd} stacks for user ${userId}`);
    
    // Get current user stack balance
    let { data: userData, error: userError } = await supabase
      .from('users')
      .select('stacks')
      .eq('clerk_id', userId)
      .single();
    
    if (userError) {
      console.error('Error fetching user data:', userError);
      // Check if user exists, if not create them
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          clerk_id: userId,
          stacks: 0
        });
      
      if (insertError) throw insertError;
      
      // Re-fetch the user
      const { data: newUserData, error: refetchError } = await supabase
        .from('users')
        .select('stacks')
        .eq('clerk_id', userId)
        .single();
      
      if (refetchError) throw refetchError;
      
      userData = newUserData;
    }
    
    const currentStacks = userData?.stacks || 0;
    const newBalance = currentStacks + stacksToAdd;
    
    // Update user stack balance
    const { error: updateError } = await supabase
      .from('users')
      .update({ stacks: newBalance })
      .eq('clerk_id', userId);
    
    if (updateError) throw updateError;
    
    // Record the transaction
    await supabase.from('stack_transactions').insert({
      user_id: userId,
      amount: stacksToAdd,
      description: 'Stack pack purchase',
      stripe_session_id: session.id,
      transaction_type: 'purchase'
    });
    
  } catch (error) {
    console.error('Error handling stack pack purchase:', error);
    throw error;
  }
}

// Helper function to add monthly stacks for subscription
async function addMonthlyStacksForSubscription(userId: string) {
  try {
    // Amount of stacks to add monthly with a subscription
    const monthlyStackAmount = 100;
    
    // Get current user stack balance
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('stacks')
      .eq('clerk_id', userId)
      .single();
    
    if (userError) throw userError;
    
    const currentStacks = userData?.stacks || 0;
    const newBalance = currentStacks + monthlyStackAmount;
    
    // Update user stack balance
    const { error: updateError } = await supabase
      .from('users')
      .update({ stacks: newBalance })
      .eq('clerk_id', userId);
    
    if (updateError) throw updateError;
    
    // Record the transaction
    await supabase.from('stack_transactions').insert({
      user_id: userId,
      amount: monthlyStackAmount,
      description: 'Monthly subscription stacks',
      transaction_type: 'subscription'
    });
    
  } catch (error) {
    console.error('Error adding monthly subscription stacks:', error);
    throw error;
  }
}

// Helper function to update subscription renewal date
async function updateSubscriptionRenewalDate(userId: string, subscriptionId: string, renewalTimestamp: number) {
  try {
    const renewalDate = new Date(renewalTimestamp);
    
    const { error } = await supabase
      .from('user_subscriptions')
      .update({ current_period_end: renewalDate.toISOString() })
      .eq('user_id', userId)
      .eq('stripe_subscription_id', subscriptionId);
    
    if (error) throw error;
    
  } catch (error) {
    console.error('Error updating subscription renewal date:', error);
    throw error;
  }
}

// Helper function to handle subscription updates
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;
    
    // Find the user with this customer ID
    const { data: subData } = await supabase
      .from('user_subscriptions')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .single();
    
    if (!subData) {
      console.error('No subscription found for customer', customerId);
      return;
    }
    
    // Update the subscription record
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        status: subscription.status,
        current_period_end: new Date(((subscription as any).current_period_end as number) * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        plan_id: subscription.items.data[0].price.id
      })
      .eq('user_id', subData.user_id)
      .eq('stripe_subscription_id', subscription.id);
    
    if (error) throw error;
    
  } catch (error) {
    console.error('Error handling subscription update:', error);
    throw error;
  }
}

// Helper function to handle subscription cancellations
async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;
    
    // Find the user with this customer ID
    const { data: subData } = await supabase
      .from('user_subscriptions')
      .select('user_id')
      .eq('stripe_customer_id', customerId)
      .single();
    
    if (!subData) {
      console.error('No subscription found for customer', customerId);
      return;
    }
    
    // Update the subscription status
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        status: 'canceled'
      })
      .eq('user_id', subData.user_id)
      .eq('stripe_subscription_id', subscription.id);
    
    if (error) throw error;
    
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
    throw error;
  }
}
