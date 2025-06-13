import { NextResponse, NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

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
