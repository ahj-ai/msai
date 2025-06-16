import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';

// This endpoint returns the current user's subscription status
export async function GET() {
  try {
    // Verify authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { isPro: false, plan: 'free', status: null },
        { status: 200 }
      );
    }

    // Fetch the user's subscription from the database
    const { data: subscriptions, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (error) {
      console.error('Error fetching subscription:', error);
      return NextResponse.json(
        { isPro: false, plan: 'free', status: null },
        { status: 200 }
      );
    }
    
    // Check if the user has an active subscription
    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json(
        { isPro: false, plan: 'free', status: null },
        { status: 200 }
      );
    }
    
    const subscription = subscriptions[0];
    const isPro = subscription.status === 'active' || subscription.status === 'trialing';
    
    return NextResponse.json({
      isPro,
      plan: isPro ? subscription.plan : 'free',
      status: subscription.status,
      periodEnd: subscription.usage_period_ends_at
    });
  } catch (error: any) {
    console.error('Error checking subscription status:', error);
    return NextResponse.json(
      { isPro: false, plan: 'free', status: null, error: error.message },
      { status: 200 }
    );
  }
}
