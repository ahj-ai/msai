import Stripe from 'stripe';

// This is your Stripe secret key. It should be stored in environment variables for security
// Only initialize Stripe on the server side
let stripeInstance: Stripe | null = null;

// Check if code is running on server side
if (typeof window === 'undefined') {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY is not defined in environment variables');
  } else {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-05-28.basil' as any, // Use the latest API version
      typescript: true,
    });
  }
}

// Export a function that provides access to the Stripe instance
export const getStripe = () => {
  if (!stripeInstance) {
    throw new Error('Stripe instance not initialized - this method should only be called from server components or API routes');
  }
  return stripeInstance;
};

// Checkout Session consts
export const MATHSTACK_PRO_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRO_SUBSCRIPTION_PRICE_ID;
export const STACK_PACK_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_STACK_PACK_PRICE_ID;

// Ensure the environment variables are set, especially in production.
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
  if (!MATHSTACK_PRO_PRICE_ID) {
    console.error(
      'CRITICAL: STRIPE_PRO_SUBSCRIPTION_PRICE_ID environment variable is not set. ' +
      'This is required for Stripe Pro subscription checkout. Please set this in your deployment environment.'
    );
    // throw new Error('CRITICAL: STRIPE_PRO_SUBSCRIPTION_PRICE_ID is not set.');
  }
  if (!STACK_PACK_PRICE_ID) {
    console.error(
      'CRITICAL: STRIPE_STACK_PACK_PRICE_ID environment variable is not set. ' +
      'This is required for Stack Pack purchase checkout. Please set this in your deployment environment.'
    );
    // throw new Error('CRITICAL: STRIPE_STACK_PACK_PRICE_ID is not set.');
  }
}

// Plan types
export type PlanType = 'free' | 'pro';
export const PLAN_FREE: PlanType = 'free';
export const PLAN_PRO: PlanType = 'pro';

// Check if a user has an active subscription
export async function hasActiveSubscription(stripeCustomerId: string): Promise<boolean> {
  try {
    const subscriptions = await getStripe().subscriptions.list({
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
    const subscriptions = await getStripe().subscriptions.list({
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
