import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { userId, packId, credits, price, paymentId } = await req.json();
    if (!userId || !packId || !credits || !price || !paymentId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert into stack_purchases
    const { error: purchaseError } = await supabase
      .from('stack_purchases')
      .insert({
        user_id: userId,
        pack_id: packId,
        credits,
        price,
        payment_id: paymentId,
        status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    if (purchaseError) {
      return NextResponse.json({ error: 'Failed to record purchase' }, { status: 500 });
    }

    // Increment purchased_stacks in user_profiles
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('purchased_stacks')
      .eq('user_id', userId)
      .single();
    let newBalance = credits;
    if (profile) {
      newBalance = (profile.purchased_stacks || 0) + credits;
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ purchased_stacks: newBalance, updated_at: new Date().toISOString() })
        .eq('user_id', userId);
      if (updateError) {
        return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
      }
    } else {
      // Create profile if not exists
      const { error: createError } = await supabase
        .from('user_profiles')
        .insert({ user_id: userId, purchased_stacks: credits, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
      if (createError) {
        return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 });
      }
    }

    // Log the transaction
    await supabase
      .from('stack_transactions')
      .insert({
        user_id: userId,
        amount: credits,
        type: 'purchase',
        description: `Purchased ${credits} credits (pack: ${packId})`,
        created_at: new Date().toISOString()
      });

    return NextResponse.json({ success: true, purchased_stacks: newBalance });
  } catch (error) {
    console.error('Error in stack-purchase API:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 