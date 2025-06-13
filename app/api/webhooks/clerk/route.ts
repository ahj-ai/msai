import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { recordUserLogin, createUserProfile } from '@/lib/supabase';
import { initializeUserProgress } from '../../../../lib/user-progress';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  // Clone the request so we can read the body twice
  const clonedReq = req.clone();
  const rawBody = await clonedReq.text();
  
  // Log all incoming webhooks for debugging
  try {
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const logFile = path.join(logsDir, `clerk-webhook-${timestamp}.json`);
    
    fs.writeFileSync(logFile, JSON.stringify({
      timestamp: new Date().toISOString(),
      headers: Object.fromEntries(headers()),
      body: rawBody
    }, null, 2));
  } catch (logError) {
    console.error('Error logging webhook:', logError);
  }

  // Get the webhook signature from the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Error: Missing webhook headers', { svix_id, svix_timestamp });
    return new Response('Error: Missing webhook headers', {
      status: 400,
    });
  }

  // Get the webhook secret from environment variable
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    console.error('Error: Missing CLERK_WEBHOOK_SECRET');
    return new Response('Error: Missing CLERK_WEBHOOK_SECRET', {
      status: 500,
    });
  }

  // Create a Svix instance with your secret
  const webhook = new Webhook(secret);
  let event: WebhookEvent;

  // Verify the payload with the headers
  try {
    event = webhook.verify(rawBody, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (error) {
    console.error('Error verifying webhook:', error);
    return new Response('Error: Invalid webhook signature', {
      status: 400,
    });
  }

  // Handle the webhook event
  const eventType = event.type;
  console.log('Event type:', eventType);
  
  // For session.created events, fetch the user details and record login
  if (eventType === 'session.created') {
    // Extract user ID from the session event
    const userId = event.data.user_id;
    
    console.log('Session created for user ID:', userId);
    
    if (userId) {
      try {
        // First, check if there's additional user info in the payload
        // This is a workaround since we can't directly use the Clerk client here
        const userDetails = await getUserDetailsFromWebhook(userId, event.data);
        
        // Record the login in Supabase
        const result = await recordUserLogin(
          userId, 
          userDetails.email,
          { 
            eventType,
            username: userDetails.username,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            sessionId: event.data.id,
            timestamp: new Date().toISOString()
          }
        );
        console.log('Login recorded result:', result);
      } catch (error) {
        console.error('Error recording login in Supabase:', error);
      }
    }
  } else if (eventType === 'session.ended' || eventType === 'session.removed') {
    // Extract user ID from the session event
    const userId = event.data.user_id;
    
    console.log(`Session ${eventType} for user ID:`, userId);
    
    if (userId) {
      try {
        // Record the logout in Supabase
        const result = await recordUserLogin(
          userId, 
          undefined,  // We may not have the email in this context
          { 
            eventType,
            sessionId: event.data.id,
            timestamp: new Date().toISOString(),
            action: 'logout'
          }
        );
        console.log('Logout recorded result:', result);
      } catch (error) {
        console.error(`Error recording ${eventType} in Supabase:`, error);
      }
    }
  } else if (eventType === 'user.created') {
    // Extract user information
    const userId = event.data.id;
    const userEmail = event.data.email_addresses?.[0]?.email_address;
    let hasError = false;

    console.log('User created webhook received:', { userId, userEmail, eventData: JSON.stringify(event.data) });

    // Create a direct Supabase client with service role to ensure we bypass any issues
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase credentials in environment variables');
      return new Response('Server configuration error', { status: 500 });
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    if (userId) {
      // 1. Record the user creation in Supabase
      try {
        const result = await recordUserLogin(
          userId,
          userEmail,
          {
            eventType,
            timestamp: new Date().toISOString(),
            rawEvent: JSON.stringify(event.data)
          }
        );
        if (!result.success) {
          console.error('Failed to record user login:', result.error);
          hasError = true;
        } else {
          console.log('User creation recorded result:', result);
        }
      } catch (error) {
        console.error('Exception recording user login:', error);
        hasError = true;
      }

      // 2. Check if user profile already exists
      try {
        const { data: existingProfile } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('user_id', userId)
          .single();
          
        if (existingProfile) {
          console.log(`User profile already exists for user ${userId}`, existingProfile);
        } else {
          // 3. Create user profile directly with service role client
          console.log(`Creating profile for user ${userId} with 20 stacks`);
          
          const { data: profileData, error: profileError } = await supabase
            .from('user_profiles')
            .insert([{
              user_id: userId,
              purchased_stacks: 20,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }])
            .select();
            
          if (profileError) {
            console.error('Failed to create user profile:', profileError);
            hasError = true;
          } else {
            console.log('User profile created successfully:', profileData);
          }
        }
      } catch (profileError) {
        console.error('Exception checking/creating user profile:', profileError);
        hasError = true;
      }

      // 4. Initialize user progress tracking
      try {
        // Check if progress already exists
        const { data: existingProgress } = await supabase
          .from('user_progress')
          .select('id')
          .eq('user_id', userId)
          .single();
          
        if (existingProgress) {
          console.log(`User progress already exists for user ${userId}`, existingProgress);
        } else {
          // Create progress record directly
          console.log(`Creating progress for user ${userId}`);
          
          const { data: progressData, error: progressError } = await supabase
            .from('user_progress')
            .insert([{
              user_id: userId,
              high_score: 0,
              games_played: 0,
              problems_solved: 0,
              last_played_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              additional_stats: {
                total_time_played: 0,
                total_correct_answers: 0,
                total_questions_attempted: 0,
                best_streak: 0
              }
            }])
            .select();
            
          if (progressError) {
            console.error('Failed to initialize user progress:', progressError);
            hasError = true;
          } else {
            console.log('User progress created successfully:', progressData);
          }
        }
      } catch (progressError) {
        console.error('Exception checking/creating user progress:', progressError);
        hasError = true;
      }
    } else {
      console.error('No userId found in user.created event');
      hasError = true;
    }

    if (hasError) {
      // Return a 500 error so Clerk will retry the webhook
      return new Response('Error processing user.created event', { status: 500 });
    }
  }

  return new Response('Webhook processed successfully', { status: 200 });
}

/**
 * Helper function to extract user details from webhook data
 * or fetch them if necessary
 */
async function getUserDetailsFromWebhook(userId: string, sessionData: any) {
  // Start with empty defaults
  const userDetails = {
    email: undefined as string | undefined,
    username: undefined as string | undefined,
    firstName: undefined as string | undefined,
    lastName: undefined as string | undefined,
  };
  
  try {
    // Attempt to fetch user details via a separate API call
    // This approach ensures we get the most complete user info
    const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const userData = await response.json();
      
      // Extract email from primary email address
      if (userData.email_addresses && userData.email_addresses.length > 0) {
        const primaryEmail = userData.email_addresses.find((email: any) => email.id === userData.primary_email_address_id);
        userDetails.email = primaryEmail?.email_address || userData.email_addresses[0].email_address;
      }
      
      // Extract username, falling back to different possibilities
      userDetails.username = userData.username || 
                            (userData.first_name && userData.last_name ? `${userData.first_name}${userData.last_name}` : undefined);
      
      // Extract first and last name
      userDetails.firstName = userData.first_name;
      userDetails.lastName = userData.last_name;
      
      console.log('Successfully retrieved user details from Clerk API');
    } else {
      console.warn('Failed to fetch user details from Clerk API:', await response.text());
    }
  } catch (error) {
    console.error('Error fetching user details from Clerk API:', error);
  }
  
  return userDetails;
}
