import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { userId, type, planId, packId, amount, sessionId } = await req.json();
    if (!userId || !type || !amount || !sessionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    // Insert into payment_sessions
    const { error } = await supabase
      .from('payment_sessions')
      .insert({
        user_id: userId,
        session_id: sessionId,
        type,
        plan_id: planId || null,
        pack_id: packId || null,
        amount,
        status: 'pending',
        created_at: new Date().toISOString()
      });
    if (error) {
      return NextResponse.json({ error: 'Failed to create payment session' }, { status: 500 });
    }
    return NextResponse.json({ success: true, sessionId });
  } catch (error) {
    console.error('Error in payment-session API:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 