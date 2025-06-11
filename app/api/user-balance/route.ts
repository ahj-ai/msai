import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get user ID from request headers (set by Clerk middleware)
    const headersList = headers();
    const userId = headersList.get('x-clerk-user-id');
    
    if (!userId) {
      // For unauthenticated users, return a standardized response with zero values
      // This avoids 401 errors in the UI when a user isn't logged in yet
      return NextResponse.json({ 
        balance: 0,
        allowance: 0,
        used: 0,
        purchased: 0,
        status: 'unauthenticated',
        subscription: null,
        usagePeriodEndsAt: null,
        isAuthError: true,
        transactions: []
      }, { status: 200 });
    }

    // Query the user's subscription data from Supabase
    const { data: subData, error: subError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Query the user's purchased stacks from user_profiles
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('purchased_stacks')
      .eq('user_id', userId)
      .single();

    // Query the user's last 5 stack transactions
    const { data: transactions, error: txError } = await supabase
      .from('stack_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (subError || profileError) {
      console.error('Error fetching user balance:', subError || profileError);
      return NextResponse.json({ error: "Error fetching balance" }, { status: 500 });
    }

    if (!subData) {
      // If no subscription data exists, user might be new
      return NextResponse.json({ 
        balance: 0,
        allowance: 0,
        used: 0,
        purchased: profileData?.purchased_stacks || 0,
        status: 'unknown',
        subscription: 'free',
        usagePeriodEndsAt: null,
        transactions: transactions || []
      });
    }

    // Return the user's current balance and subscription info
    return NextResponse.json({
      balance: subData.monthly_allowance - subData.monthly_usage + (profileData?.purchased_stacks || 0),
      allowance: subData.monthly_allowance,
      used: subData.monthly_usage,
      purchased: profileData?.purchased_stacks || 0,
      status: subData.status,
      subscription: subData.subscription_type || subData.plan || 'free',
      usagePeriodEndsAt: subData.usage_period_ends_at,
      transactions: transactions || []
    });

  } catch (error) {
    console.error('Error in user-balance API route:', error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
