import { createClient } from '@supabase/supabase-js';

// Client-side Supabase client (safe for browser)
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-side Supabase client (for API routes, webhooks, etc.)
export const supabaseServer = (() => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error('SUPABASE_URL is not defined');
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined');
  return createClient(url, key);
})();


// Function to record user login (always use server client)
export async function recordUserLogin(userId: string, userEmail?: string, metadata: any = {}) {
  console.log('Recording user login for:', { userId, userEmail });
  try {
    const { data, error } = await supabaseServer
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

