import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Initialize user progress tracking for a new user
 * This function is called when a new user is created via Clerk webhook
 * 
 * @param userId - The Clerk user ID
 * @returns Promise<boolean> - Whether the initialization was successful
 */
export async function initializeUserProgress(userId: string): Promise<boolean> {
  try {
    if (!userId) {
      console.error('Cannot initialize user progress: No user ID provided');
      return false;
    }

    // Create initial user progress record in Supabase
    const { error } = await supabase
      .from('user_progress')
      .insert({
        user_id: userId,
        completed_problems: 0,
        topics_mastered: 0,
        last_active: new Date().toISOString(),
        streak_days: 0,
        current_level: 1,
        xp_points: 0,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error initializing user progress:', error);
      return false;
    }

    console.log(`User progress initialized for user: ${userId}`);
    return true;
  } catch (error) {
    console.error('Exception initializing user progress:', error);
    return false;
  }
}
