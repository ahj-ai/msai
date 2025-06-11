// Script to add stacks to a specific user account
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const EMAIL = 'ajnichani@gmail.com';
const STACKS_TO_ADD = 300;

async function addStacksToUser() {
  try {
    console.log(`Looking up user with email: ${EMAIL}`);
    
    // Step 1: Find the user's Clerk ID using their email
    // First, try to find in user_logins table
    let { data: userData, error: userError } = await supabase
      .from('user_logins')
      .select('user_id')
      .eq('user_email', EMAIL)
      .order('login_timestamp', { ascending: false })
      .limit(1);
    
    if (userError) {
      throw new Error(`Error finding user: ${userError.message}`);
    }
    
    if (!userData || userData.length === 0) {
      throw new Error(`No user found with email ${EMAIL}`);
    }
    
    const userId = userData[0].user_id;
    console.log(`Found user with ID: ${userId}`);
    
    // Step 2: Get current subscription data
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (subscriptionError) {
      throw new Error(`Error fetching subscription: ${subscriptionError.message}`);
    }
    
    if (!subscriptionData) {
      throw new Error(`No subscription found for user ${userId}`);
    }
    
    console.log('Current subscription data:', subscriptionData);
    
    // Step 3: Calculate the new monthly_allowance by adding the stack credits
    const newAllowance = (subscriptionData.monthly_allowance || 0) + STACKS_TO_ADD;
    
    // Step 4: Update the subscription record
    const { data: updateData, error: updateError } = await supabase
      .from('user_subscriptions')
      .update({
        monthly_allowance: newAllowance,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select();
    
    if (updateError) {
      throw new Error(`Error updating subscription: ${updateError.message}`);
    }
    
    console.log(`Successfully added ${STACKS_TO_ADD} stacks to user ${userId}`);
    console.log('New subscription data:', updateData);
    
    return { success: true, message: `Added ${STACKS_TO_ADD} stacks to ${EMAIL}` };
  } catch (error) {
    console.error('Error adding stacks:', error);
    return { success: false, error: error.message };
  }
}

// Execute the function
addStacksToUser()
  .then(result => {
    console.log('Operation result:', result);
    process.exit(result.success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
