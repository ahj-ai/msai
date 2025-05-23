import { createClient } from '@supabase/supabase-js';

// Supabase client configuration - explicitly use MathStackAI2 project
// Hardcoding the URL and key to ensure we're using the correct project
const supabaseUrl = 'https://uhyamvvoehtbtbqikujd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoeWFtdnZvZWh0YnRicWlrdWpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0OTk1NDYsImV4cCI6MjA2MzA3NTU0Nn0.oxdvNEUft5QTu4unGP4va-UsCNqDx4yR14myJRxJ-qY';

// Create a singleton Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to record user login
export async function recordUserLogin(userId: string, userEmail?: string, metadata: any = {}) {
  console.log('Recording user login for:', { userId, userEmail });
  
  try {
    const { data, error } = await supabase
      .from('user_logins')
      .insert([
        {
          user_id: userId,
          user_email: userEmail,
          login_timestamp: new Date().toISOString(),
          metadata
        }
      ])
      .select();
      
    if (error) {
      console.error('Error recording user login:', error);
      return { success: false, error };
    }
    
    console.log('User login recorded successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to record user login:', error);
    return { success: false, error };
  }
}
