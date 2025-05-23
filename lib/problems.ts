import { supabase } from '@/lib/supabase';
import { Problem, Difficulty } from '@/types/math';

// Type for the database math_problem record
export type MathProblemRecord = {
  id: string;
  subject: string;
  topic: string;
  difficulty: Difficulty;
  question: string;
  solution_steps: string[];
  answer: string;
  source_type?: string;
  created_at?: string;
  metadata?: {
    hints?: string[];
    solution?: string;
    [key: string]: any;
  };
};

// Convert a database record to the Problem type used in the app
export function mapDbProblemToProblem(dbProblem: MathProblemRecord): Problem {
  return {
    id: dbProblem.id,
    subject: dbProblem.subject,
    topic: dbProblem.topic,
    difficulty: dbProblem.difficulty,
    question: dbProblem.question,
    solutionSteps: dbProblem.solution_steps,
    solution: dbProblem.metadata?.solution || dbProblem.solution_steps.join('\n'),
    answer: dbProblem.answer,
    hints: dbProblem.metadata?.hints || []
  };
}

// Fetch all problems
export async function getAllProblems(): Promise<Problem[]> {
  // Use the existing supabase client
  
  const { data, error } = await supabase
    .from('math_problems')
    .select('*');
    
  if (error) {
    console.error('Error fetching problems:', error);
    return [];
  }
  
  return (data as MathProblemRecord[]).map(mapDbProblemToProblem);
}

// Fetch problems by topic
export async function getProblemsByTopic(topic: string): Promise<Problem[]> {
  // Use the existing supabase client
  
  const { data, error } = await supabase
    .from('math_problems')
    .select('*')
    .eq('topic', topic);
    
  if (error) {
    console.error(`Error fetching problems for topic ${topic}:`, error);
    return [];
  }
  
  return (data as MathProblemRecord[]).map(mapDbProblemToProblem);
}

// Fetch problems with specific filters
export async function getFilteredProblems({
  subject,
  topic,
  difficulty,
  limit = 10
}: {
  subject?: string;
  topic?: string;
  difficulty?: Difficulty;
  limit?: number;
}): Promise<Problem[]> {
  // Build query with filters
  let query = supabase
    .from('math_problems')
    .select('*');
  
  // Apply filters if provided
  if (subject) {
    query = query.eq('subject', subject);
  }
  
  if (topic) {
    query = query.eq('topic', topic);
  }
  
  if (difficulty) {
    query = query.eq('difficulty', difficulty);
  }
  
  // Apply limit
  query = query.limit(limit);
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching filtered problems:', error);
    return [];
  }
  
  return (data as MathProblemRecord[]).map(mapDbProblemToProblem);
}

// Fetch a single problem by ID
export async function getProblemById(id: string): Promise<Problem | null> {
  // Use the existing supabase client
  
  const { data, error } = await supabase
    .from('math_problems')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Error fetching problem ${id}:`, error);
    return null;
  }
  
  return mapDbProblemToProblem(data as MathProblemRecord);
}

// Add a new problem
export async function addProblem(problem: Omit<MathProblemRecord, 'created_at'>): Promise<string | null> {
  // Use the existing supabase client
  
  const { data, error } = await supabase
    .from('math_problems')
    .insert(problem)
    .select('id')
    .single();
    
  if (error) {
    console.error('Error adding problem:', error);
    return null;
  }
  
  return data.id;
}

// Update an existing problem
export async function updateProblem(id: string, problem: Partial<MathProblemRecord>): Promise<boolean> {
  // Use the existing supabase client
  
  const { error } = await supabase
    .from('math_problems')
    .update(problem)
    .eq('id', id);
    
  if (error) {
    console.error(`Error updating problem ${id}:`, error);
    return false;
  }
  
  return true;
}

// Delete a problem
export async function deleteProblem(id: string): Promise<boolean> {
  // Use the existing supabase client
  
  const { error } = await supabase
    .from('math_problems')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error(`Error deleting problem ${id}:`, error);
    return false;
  }
  
  return true;
}

// Get all available topics
export async function getAllTopics(): Promise<string[]> {
  // Use the existing supabase client
  
  const { data, error } = await supabase
    .from('math_problems')
    .select('topic')
    .limit(1000);
    
  if (error) {
    console.error('Error fetching topics:', error);
    return [];
  }
  
  // Extract unique topics using a Set
  const topicsSet = new Set<string>();
  data.forEach((item: { topic: string }) => {
    if (item.topic) {
      topicsSet.add(item.topic);
    }
  });
  
  return Array.from(topicsSet);
}

// Get all available subjects
export async function getAllSubjects(): Promise<string[]> {
  // Use the existing supabase client
  
  const { data, error } = await supabase
    .from('math_problems')
    .select('subject')
    .limit(1000);
    
  if (error) {
    console.error('Error fetching subjects:', error);
    return [];
  }
  
  // Extract unique subjects using a Set
  const subjectsSet = new Set<string>();
  data.forEach((item: { subject: string }) => {
    if (item.subject) {
      subjectsSet.add(item.subject);
    }
  });
  
  return Array.from(subjectsSet);
}
