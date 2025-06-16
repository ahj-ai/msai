import Stripe from 'stripe';

// This is your Stripe secret key. It should be stored in environment variables for security
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-05-28.basil' as any, // Use the latest API version
  typescript: true,
});

// Checkout Session consts
// MathStack AI Pro: price_1RYy6O04B8TSHNkkSKszmPJS
// Stack Pack: price_1RY9hP04B8TSHNkkEsK9Fx4O
export const MATHSTACK_PRO_PRICE_ID = process.env.STRIPE_PRO_SUBSCRIPTION_PRICE_ID || 'price_1RYy6O04B8TSHNkkSKszmPJS';
export const STACK_PACK_PRICE_ID = process.env.STRIPE_STACK_PACK_PRICE_ID || 'price_1RY9hP04B8TSHNkkEsK9Fx4O';

// Plan types
export type PlanType = 'free' | 'pro';
export const PLAN_FREE: PlanType = 'free';
export const PLAN_PRO: PlanType = 'pro';

// Check if a user has an active subscription
export async function hasActiveSubscription(stripeCustomerId: string): Promise<boolean> {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'active',
      limit: 1,
    });
    
    return subscriptions.data.length > 0;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
}

// Get subscription details
export async function getSubscriptionDetails(stripeCustomerId: string) {
  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'active',
      expand: ['data.default_payment_method'],
      limit: 1,
    });
    
    if (subscriptions.data.length === 0) {
      return null;
    }
    
    return subscriptions.data[0];
  } catch (error) {
    console.error('Error getting subscription details:', error);
    return null;
  }
}
