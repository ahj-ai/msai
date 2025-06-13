import { NextResponse, NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';
import { OPERATION_COSTS } from '@/lib/constants';

// Create a service role client that bypasses RLS
const serviceSupabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function GET(request: NextRequest) {
  try {
    // Use Clerk's getAuth helper to extract the user from the request
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log(`Fetching stacks for user: ${userId}`);

    // ALWAYS use service role client to ensure we can see all profiles regardless of RLS
    const { data: existingProfile, error: fetchError } = await serviceSupabase
      .from('user_profiles')
      .select('stacks')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (fetchError) {
      console.error('Error fetching user profile:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: 500 }
      );
    }
    
    // If profile exists, return its stacks
    if (existingProfile) {
      console.log(`Found existing profile with stacks: ${existingProfile.stacks}`);
      return NextResponse.json({ stacks: existingProfile.stacks });
    }
    
    console.log('No profile found, creating new profile');
    
    // If no profile exists, create one
    try {
      const { data, error } = await serviceSupabase
        .from('user_profiles')
        .insert([{ user_id: userId, stacks: 20 }])
        .select('stacks')
        .single();
      
      if (error) {
        // Check if this is a duplicate key error (profile was created by another request)
        if (error.code === '23505') {
          console.log('Profile already exists (race condition), fetching existing profile');
          
          // Profile already exists (race condition), get the existing profile
          const { data: profile } = await serviceSupabase
            .from('user_profiles')
            .select('stacks')
            .eq('user_id', userId)
            .single();
            
          return NextResponse.json({ stacks: profile?.stacks || 20 });
        }
        
        console.error('Error creating user profile:', error);
        return NextResponse.json(
          { error: `Failed to create user profile: ${error.message}` },
          { status: 500 }
        );
      }
      
      console.log(`Successfully created profile with stacks: ${data.stacks}`);
      return NextResponse.json({ stacks: data.stacks });
      
    } catch (insertError) {
      console.error('Exception during profile creation:', insertError);
      return NextResponse.json(
        { error: 'Exception during profile creation' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error in stacks API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Use Clerk's getAuth helper to extract the user from the request
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request body
    const { amount, operation } = await request.json();

    // Validate input
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount. Must be a positive number.' },
        { status: 400 }
      );
    }

    console.log(`Attempting to spend ${amount} stacks for user: ${userId} for operation: ${operation || 'unknown'}`);

    // Use the atomic spend_stacks function to handle the transaction
    const { data, error } = await serviceSupabase
      .rpc('spend_stacks', { 
        p_user_id: userId, 
        p_amount: amount,
        p_operation: operation || 'api_request'
      });

    if (error) {
      console.error('Error spending stacks:', error);
      return NextResponse.json(
        { error: `Failed to spend stacks: ${error.message}` },
        { status: 500 }
      );
    }

    // Check if the operation was successful based on the function's return value
    if (data && !data.success) {
      console.log('Stack operation failed:', data);
      
      // Handle insufficient stacks
      if (data.code === 'INSUFFICIENT_STACKS') {
        return NextResponse.json({
          error: data.error,
          code: data.code,
          available: data.available,
          required: data.required
        }, { status: 402 }); // Payment Required status code
      }
      
      // Handle user not found
      return NextResponse.json({ error: data.error }, { status: 404 });
    }

    console.log(`Successfully spent ${amount} stacks, new balance:`, data.remainingStacks);
    
    return NextResponse.json({ 
      success: true,
      remainingStacks: data.remainingStacks,
      spent: amount
    });

  } catch (error) {
    console.error('Error in spend stacks API:', error);
    let message = 'Internal server error';
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

/**
 * PUT endpoint to add stacks to a user
 * This endpoint is for admin use to add stacks to a user
 */
export async function PUT(request: NextRequest) {
  try {
    // Use Clerk's getAuth helper to extract the user from the request
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // For now, we'll use simple role check
    // In a production app, you'd implement proper role-based access control
    // TODO: Add proper role check when admin roles are implemented
    
    // Parse the request body
    const { amount, targetUserId, operation, metadata } = await request.json();

    // Validate input
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount. Must be a positive number.' },
        { status: 400 }
      );
    }

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'Missing target user ID' },
        { status: 400 }
      );
    }

    console.log(`Attempting to add ${amount} stacks to user: ${targetUserId} by: ${userId}`);

    // Use the atomic add_stacks function
    const { data, error } = await serviceSupabase
      .rpc('add_stacks', { 
        p_user_id: targetUserId, 
        p_amount: amount,
        p_operation: operation || 'admin_add',
        p_metadata: metadata || { added_by: userId }
      });

    if (error) {
      console.error('Error adding stacks:', error);
      return NextResponse.json(
        { error: `Failed to add stacks: ${error.message}` },
        { status: 500 }
      );
    }

    // Check if the operation was successful based on the function's return value
    if (data && !data.success) {
      console.log('Stack operation failed:', data);      
      // Handle user not found
      return NextResponse.json({ error: data.error }, { status: 404 });
    }

    console.log(`Successfully added ${amount} stacks, new balance:`, data.newBalance);
    
    return NextResponse.json({ 
      success: true,
      newBalance: data.newBalance,
      added: amount,
      userId: targetUserId
    });

  } catch (error) {
    console.error('Error in add stacks API:', error);
    let message = 'Internal server error';
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

/**
 * PATCH endpoint to handle stack history
 * This endpoint is for retrieving a user's stack transaction history
 */
export async function PATCH(request: NextRequest) {
  try {
    // Use Clerk's getAuth helper to extract the user from the request
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request body
    const { limit } = await request.json();
    
    // Use the get_user_stack_history function
    const { data, error } = await serviceSupabase
      .rpc('get_user_stack_history', { 
        p_user_id: userId, 
        p_limit: limit || 50 
      });

    if (error) {
      console.error('Error getting stack history:', error);
      return NextResponse.json(
        { error: `Failed to get stack history: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      history: data
    });

  } catch (error) {
    console.error('Error in stack history API:', error);
    let message = 'Internal server error';
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
