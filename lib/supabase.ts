import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { GameStats } from '@/types/game';
import { Problem } from '@/types/math';

// Lazy-loaded Supabase client to avoid issues during build time
// This approach prevents Next.js from trying to access env vars during build
let supabaseInstance: SupabaseClient | null = null;

// Initialize the Supabase client only when it's needed (not during build)
function getSupabaseClient() {
  // Return existing instance if already initialized
  if (supabaseInstance) return supabaseInstance;
  
  // Get environment variables at runtime
  // Support both local development (NEXT_PUBLIC_ prefix) and Vercel production (no prefix)
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  
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

// Function to save user's Brainiac game progress
export async function saveUserProgress(userId: string, gameStats: GameStats) {
  console.log('Saving user progress for:', userId);
  
  try {
    // First check if user already has a progress entry
    const { data: existingData, error: fetchError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = not found, which is expected for new users
      console.error('Error fetching user progress:', fetchError);
      return { success: false, error: fetchError };
    }
    
    // Prepare updated data
    const now = new Date().toISOString();
    const {
      score,
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      maxStreak,
      averageResponseTime,
      totalTime,
      gameMode,
      difficulty
    } = gameStats;
    
    // If user has existing data, update it; otherwise create a new entry
    if (existingData) {
      // Update existing progress
      const { data, error } = await supabase
        .from('user_progress')
        .update({
          high_score: Math.max(existingData.high_score || 0, score),
          games_played: (existingData.games_played || 0) + 1,
          problems_solved: (existingData.problems_solved || 0) + correctAnswers,
          last_played_at: now,
          updated_at: now,
          additional_stats: {
            ...existingData.additional_stats,
            last_game: {
              score,
              totalQuestions,
              correctAnswers,
              incorrectAnswers,
              maxStreak,
              averageResponseTime,
              totalTime,
              gameMode,
              difficulty,
              played_at: now
            },
            total_time_played: (existingData.additional_stats?.total_time_played || 0) + totalTime,
            total_correct_answers: (existingData.additional_stats?.total_correct_answers || 0) + correctAnswers,
            total_questions_attempted: (existingData.additional_stats?.total_questions_attempted || 0) + totalQuestions,
            best_streak: Math.max(existingData.additional_stats?.best_streak || 0, maxStreak)
          }
        })
        .eq('user_id', userId)
        .select();
      
      if (error) {
        console.error('Error updating user progress:', error);
        return { success: false, error };
      }
      
      console.log('User progress updated successfully:', data);
      return { success: true, data };
    } else {
      // Create new progress entry
      const { data, error } = await supabase
        .from('user_progress')
        .insert([
          {
            user_id: userId,
            high_score: score,
            games_played: 1,
            problems_solved: correctAnswers,
            last_played_at: now,
            created_at: now,
            updated_at: now,
            additional_stats: {
              last_game: {
                score,
                totalQuestions,
                correctAnswers,
                incorrectAnswers,
                maxStreak,
                averageResponseTime,
                totalTime,
                gameMode,
                difficulty,
                played_at: now
              },
              total_time_played: totalTime,
              total_correct_answers: correctAnswers,
              total_questions_attempted: totalQuestions,
              best_streak: maxStreak
            }
          }
        ])
        .select();
      
      if (error) {
        console.error('Error creating user progress:', error);
        return { success: false, error };
      }
      
      console.log('User progress created successfully:', data);
      return { success: true, data };
    }
  } catch (error) {
    console.error('Failed to save user progress:', error);
    return { success: false, error };
  }
}

/**
 * Save user-generated problems to Supabase
 * @param userId The Clerk user ID
 * @param problems Array of problems to save
 * @param source Source of the problems (e.g., 'problem-lab', 'ask-lab', 'screenshot')
 */
export async function saveUserProblems(userId: string, problems: Problem[], source: string = 'problem-lab') {
  console.log(`Saving ${problems.length} problems for user:`, userId);
  
  try {
    const now = new Date().toISOString();
    
    // Prepare data for insertion
    const problemsToInsert = problems.map(problem => ({
      user_id: userId,
      subject: problem.subject || '',
      topic: problem.topic || '',
      difficulty: problem.difficulty || 'Regular',
      question: problem.question,
      solution: problem.solution,
      answer: problem.answer?.toString() || '',
      hints: problem.hints || [],
      solution_steps: problem.solutionSteps || problem.steps || [],
      source,
      created_at: now,
      metadata: {
        isCorrect: problem.isCorrect,
        userAnswer: problem.userAnswer
      }
    }));
    
    // Insert the problems
    const { data, error } = await supabase
      .from('user_problems')
      .insert(problemsToInsert)
      .select();
    
    if (error) {
      console.error('Error saving user problems:', error);
      return { success: false, error };
    }
    
    console.log(`${data.length} problems saved successfully`);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to save user problems:', error);
    return { success: false, error };
  }
}

/**
 * Get problems saved by a specific user
 * @param userId The Clerk user ID
 * @param limit Maximum number of problems to return
 * @param source Optional filter by source
 */
export async function getUserProblems(userId: string, limit: number = 50, source?: string) {
  console.log(`Getting problems for user: ${userId}`);
  
  try {
    let query = supabase
      .from('user_problems')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    // Apply source filter if provided
    if (source) {
      query = query.eq('source', source);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching user problems:', error);
      return { success: false, error };
    }
    
    console.log(`Retrieved ${data.length} problems for user`);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to fetch user problems:', error);
    return { success: false, error };
  }
}

