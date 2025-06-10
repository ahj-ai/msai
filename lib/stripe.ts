import { loadStripe, Stripe } from '@stripe/stripe-js';

// Singleton pattern to ensure we only create one Stripe instance
let stripePromise: Promise<Stripe | null>;

// Client-side Stripe initialization
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

// Server-side Stripe initialization
export const initializeStripe = async () => {
  const stripe = require('stripe');
  return stripe(process.env.STRIPE_SECRET_KEY);
};
