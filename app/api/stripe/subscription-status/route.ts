import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

// Mark this endpoint as a dynamic route that shouldn't be statically optimized
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Create Supabase client with service role key to bypass RLS
const supabaseServiceRole = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// This endpoint returns the current user's subscription status
export async function GET() {
  // Add cache headers to prevent caching
  const headers = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  };
  try {
    // Verify authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { isPro: false, plan: 'free', status: null },
        { status: 200, headers }
      );
    }

    // Fetch the user's subscription from the database
    const { data: subscriptions, error } = await supabaseServiceRole
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) {
      console.error('Error fetching subscription:', error);
      return NextResponse.json(
        { isPro: false, plan: 'free', status: null },
        { status: 200, headers }
      );
    }
    
    // Check if the user has an active subscription
    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json(
        { isPro: false, plan: 'free', status: null },
        { status: 200, headers }
      );
    }
    
    const subscription = subscriptions[0];
    const isPro = subscription.status === 'active' || subscription.status === 'trialing';
    
    return NextResponse.json({
      isPro,
      plan: isPro ? subscription.plan : 'free',
      status: subscription.status,
      periodEnd: subscription.usage_period_ends_at
    }, { headers });
  } catch (error: any) {
    console.error('Error checking subscription status:', error);
    return NextResponse.json(
      { isPro: false, plan: 'free', status: null, error: error.message },
      { status: 200, headers }
    );
  }
}
