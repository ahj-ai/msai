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

    console.log(`Attempting to initialize progress for user: ${userId}`);

    // Create initial user progress record in Supabase
    const { data, error } = await supabase
      .from('user_progress')
      .insert({
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
      })
      .select();

    if (error) {
      console.error('Error initializing user progress:', error);
      return false;
    }

    console.log(`User progress initialized for user: ${userId}`, data);
    return true;
  } catch (error) {
    console.error('Exception initializing user progress:', error);
    return false;
  }
}
