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
    
    let result;
    
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
      result = { success: true, data };
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
      result = { success: true, data };
    }
    
    // Update weekly goals after saving progress
    try {
      // Get active weekly goals
      const { data: weeklyGoals, success: goalsSuccess } = await getUserWeeklyGoals(userId);
      
      if (goalsSuccess && weeklyGoals && weeklyGoals.length > 0) {
        console.log('Updating weekly goals after game completion');
        
        // Process each goal type
        for (const goal of weeklyGoals) {
          let updatedProgress = goal.current;
          
          // Update based on goal type
          switch(goal.goal_type) {
            case 'games_played':
              updatedProgress += 1; // Increment games played
              break;
            case 'problems_solved':
              updatedProgress += correctAnswers; // Add correct answers from this game
              break;
            case 'practice_time':
              updatedProgress += Math.ceil(totalTime / 60); // Add practice time in minutes
              break;
          }
          
          // Update goal if progress has changed
          if (updatedProgress > goal.current) {
            await updateGoalProgress(userId, goal.id, updatedProgress);
          }
        }
      } else {
        // If no weekly goals found, consider generating them
        console.log('No active weekly goals found after game completion');
      }
    } catch (goalError) {
      // Don't fail the whole function if goal update fails
      console.error('Error updating weekly goals:', goalError);
    }
    
    return result;
  } catch (error) {
    console.error('Failed to save user progress:', error);
    return { success: false, error };
  }
}

/**
 * Interface for user goals
 */
export interface UserGoal {
  id?: string;
  user_id: string;
  goal_type: string;
  target: number;
  current: number;
  start_date: string;
  end_date: string;
  completed: boolean;
  message?: string;
  unit?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Get active weekly goals for a user
 * @param userId The Clerk user ID
 * @returns Object containing success status and data/error
 */
export async function getUserWeeklyGoals(userId: string) {
  console.log('Fetching weekly goals for user:', userId);
  
  try {
    // Get the current date
    const now = new Date();
    
    // Query for active goals (where current date is between start_date and end_date)
    const { data, error } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', userId)
      .lte('start_date', now.toISOString())
      .gte('end_date', now.toISOString())
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching user goals:', error);
      return { success: false, error };
    }
    
    console.log('User goals fetched successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to fetch user goals:', error);
    return { success: false, error };
  }
}

/**
 * Create a new weekly goal for a user
 * @param userId The Clerk user ID
 * @param goal Goal data
 * @returns Object containing success status and data/error
 */
export async function createUserGoal(userId: string, goal: Omit<UserGoal, 'user_id' | 'id'>) {
  console.log('Creating new goal for user:', userId);
  
  try {
    // Set start and end dates if not provided
    if (!goal.start_date || !goal.end_date) {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday of current week
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday of current week
      endOfWeek.setHours(23, 59, 59, 999);
      
      goal.start_date = goal.start_date || startOfWeek.toISOString();
      goal.end_date = goal.end_date || endOfWeek.toISOString();
    }
    
    const { data, error } = await supabase
      .from('user_goals')
      .insert([
        {
          user_id: userId,
          ...goal,
          current: goal.current || 0,
          completed: goal.completed || false
        }
      ])
      .select();
      
    if (error) {
      console.error('Error creating user goal:', error);
      return { success: false, error };
    }
    
    console.log('User goal created successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to create user goal:', error);
    return { success: false, error };
  }
}

/**
 * Update a user's progress towards a goal
 * @param userId The Clerk user ID
 * @param goalId The goal ID
 * @param progress The new progress value
 * @returns Object containing success status and data/error
 */
export async function updateGoalProgress(userId: string, goalId: string, progress: number) {
  console.log('Updating goal progress for user:', userId, 'goal:', goalId);
  
  try {
    // First get the goal to check if it's completed
    const { data: goalData, error: fetchError } = await supabase
      .from('user_goals')
      .select('*')
      .eq('id', goalId)
      .eq('user_id', userId)
      .single();
      
    if (fetchError) {
      console.error('Error fetching goal for update:', fetchError);
      return { success: false, error: fetchError };
    }
    
    // Check if goal is completed
    const completed = progress >= goalData.target;
    
    // Update the goal
    const { data, error } = await supabase
      .from('user_goals')
      .update({
        current: progress,
        completed,
        updated_at: new Date().toISOString()
      })
      .eq('id', goalId)
      .eq('user_id', userId)
      .select();
      
    if (error) {
      console.error('Error updating goal progress:', error);
      return { success: false, error };
    }
    
    console.log('Goal progress updated successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to update goal progress:', error);
    return { success: false, error };
  }
}

/**
 * Delete a user goal
 * @param userId The Clerk user ID
 * @param goalId The goal ID
 * @returns Object containing success status and data/error
 */
export async function deleteUserGoal(userId: string, goalId: string) {
  console.log('Deleting goal for user:', userId, 'goal:', goalId);
  
  try {
    const { data, error } = await supabase
      .from('user_goals')
      .delete()
      .eq('id', goalId)
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error deleting user goal:', error);
      return { success: false, error };
    }
    
    console.log('User goal deleted successfully');
    return { success: true, data };
  } catch (error) {
    console.error('Failed to delete user goal:', error);
    return { success: false, error };
  }
}

/**
 * Generate default weekly goals for a user based on their activity level
 * @param userId The Clerk user ID
 * @returns Object containing success status and data/error
 */
export async function generateDefaultWeeklyGoals(userId: string) {
  console.log('Generating default weekly goals for user:', userId);
  
  try {
    // Get user's activity level from progress data
    const { data: progressData, error: progressError } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .single();
      
    if (progressError && progressError.code !== 'PGRST116') {
      console.error('Error fetching user progress:', progressError);
      return { success: false, error: progressError };
    }
    
    // Set default goals based on activity level
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday of current week
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday of current week
    endOfWeek.setHours(23, 59, 59, 999);
    
    // Determine activity level and set appropriate goals
    const gamesPlayed = progressData?.games_played || 0;
    const problemsSolved = progressData?.problems_solved || 0;
    
    // Create goals based on user's history
    const goals = [
      {
        goal_type: 'problems_solved',
        target: Math.max(5, Math.ceil(problemsSolved * 0.2)), // At least 5, or 20% of total problems solved
        current: 0,
        start_date: startOfWeek.toISOString(),
        end_date: endOfWeek.toISOString(),
        message: 'Solve math problems this week',
        unit: 'problems',
        completed: false
      },
      {
        goal_type: 'games_played',
        target: Math.max(3, Math.ceil(gamesPlayed * 0.15)), // At least 3, or 15% of total games played
        current: 0,
        start_date: startOfWeek.toISOString(),
        end_date: endOfWeek.toISOString(),
        message: 'Play Brainiac games this week',
        unit: 'games',
        completed: false
      },
      {
        goal_type: 'practice_time',
        target: 30, // 30 minutes of practice time
        current: 0,
        start_date: startOfWeek.toISOString(),
        end_date: endOfWeek.toISOString(),
        message: 'Practice math this week',
        unit: 'minutes',
        completed: false
      }
    ];
    
    // First, delete any existing goals for this week
    await supabase
      .from('user_goals')
      .delete()
      .eq('user_id', userId)
      .gte('start_date', startOfWeek.toISOString())
      .lte('end_date', endOfWeek.toISOString());
    
    // Insert all goals
    const { data, error } = await supabase
      .from('user_goals')
      .insert(goals.map(goal => ({
        user_id: userId,
        ...goal
      })))
      .select();
      
    if (error) {
      console.error('Error creating default goals:', error);
      return { success: false, error };
    }
    
    console.log('Default goals created successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to generate default goals:', error);
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

/**
 * Get topic progress statistics for a user
 * @param userId The Clerk user ID
 * @returns Object with topic stats and recent activity
 */
export async function getUserTopicProgress(userId: string) {
  console.log(`Getting topic progress for user: ${userId}`);
  
  try {
    // Get all user problems to analyze
    const { data: userProblems, error } = await supabase
      .from('user_problems')
      .select('subject, topic, difficulty, created_at, metadata')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching user topic data:', error);
      return { success: false, error };
    }
    
    if (!userProblems || userProblems.length === 0) {
      return { 
        success: true, 
        data: { 
          topicStats: [],
          recentTopics: [],
          subjectDistribution: {},
          totalProblems: 0
        } 
      };
    }
    
    // Process the data to extract topic statistics
    const topicCounts: Record<string, { count: number, correct: number, lastAttempted: string }> = {};
    const subjectCounts: Record<string, number> = {};
    
    userProblems.forEach(problem => {
      const topic = problem.topic;
      const subject = problem.subject;
      const isCorrect = problem.metadata?.isCorrect || false;
      const createdAt = problem.created_at || new Date().toISOString();
      
      // Update topic stats
      if (!topicCounts[topic]) {
        topicCounts[topic] = { count: 0, correct: 0, lastAttempted: createdAt };
      }
      topicCounts[topic].count += 1;
      if (isCorrect) topicCounts[topic].correct += 1;
      if (new Date(createdAt) > new Date(topicCounts[topic].lastAttempted)) {
        topicCounts[topic].lastAttempted = createdAt;
      }
      
      // Update subject counts
      if (!subjectCounts[subject]) subjectCounts[subject] = 0;
      subjectCounts[subject] += 1;
    });
    
    // Convert to array and sort by count
    const topicStats = Object.entries(topicCounts).map(([topic, stats]) => ({
      topic,
      count: stats.count,
      correct: stats.correct,
      accuracy: stats.count > 0 ? Math.round((stats.correct / stats.count) * 100) : 0,
      lastAttempted: stats.lastAttempted
    })).sort((a, b) => b.count - a.count);
    
    // Get recently worked on topics (by last attempt date)
    const recentTopics = [...topicStats]
      .sort((a, b) => new Date(b.lastAttempted).getTime() - new Date(a.lastAttempted).getTime())
      .slice(0, 5);
    
    return { 
      success: true, 
      data: {
        topicStats,
        recentTopics,
        subjectDistribution: subjectCounts,
        totalProblems: userProblems.length
      }
    };
  } catch (error) {
    console.error('Failed to process user topic progress:', error);
    return { success: false, error };
  }
}

