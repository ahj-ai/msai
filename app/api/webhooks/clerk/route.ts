import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { recordUserLogin } from '@/lib/supabase';
import { initializeUserProgress } from '../../../../lib/user-progress';

export async function POST(req: Request) {
  // Get the webhook signature from the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing webhook headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Get the webhook secret from environment variable
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return new Response('Error: Missing CLERK_WEBHOOK_SECRET', {
      status: 500,
    });
  }

  // Create a Svix instance with your secret
  const webhook = new Webhook(secret);
  let event: WebhookEvent;

  // Verify the payload with the headers
  try {
    event = webhook.verify(body, {
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
  } else if (eventType === 'user.created') {
    // Extract user information
    const userId = event.data.id;
    const userEmail = event.data.email_addresses?.[0]?.email_address;
    
    console.log('User created:', { userId, userEmail });
    
    if (userId) {
      try {
        // Record the user creation in Supabase
        const result = await recordUserLogin(
          userId, 
          userEmail,
          { 
            eventType, 
            timestamp: new Date().toISOString(),
            rawEvent: JSON.stringify(event.data)
          }
        );
        console.log('User creation recorded result:', result);
        
        // Initialize user progress tracking for the new user
        const progressResult = await initializeUserProgress(userId);
        console.log('User progress initialized:', progressResult ? 'Success' : 'Failed');
      } catch (error) {
        console.error('Error recording user creation in Supabase:', error);
      }
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
