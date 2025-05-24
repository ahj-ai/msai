import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy-loaded Supabase client to avoid issues during build time
// This approach prevents Next.js from trying to access env vars during build
let supabaseInstance: SupabaseClient | null = null;

// Initialize the Supabase client only when it's needed (not during build)
function getSupabaseClient() {
  // Return existing instance if already initialized
  if (supabaseInstance) return supabaseInstance;
  
  // Get environment variables at runtime
  // Support both local development (NEXT_PUBLIC_ prefix) and Vercel production (no prefix)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  
  // Validate environment variables
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Please check your environment configuration.');
  }
  
  // Create and store the client instance
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  return supabaseInstance;
}

// Export the lazy-loaded client
export const supabase = new Proxy({} as SupabaseClient, {
  get: (target, prop) => {
    // Initialize the client when any property is accessed
    const client = getSupabaseClient();
    // Return the requested property from the actual client
    return client[prop as keyof SupabaseClient];
  }
});

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

