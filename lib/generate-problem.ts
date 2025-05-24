"use server"

import { supabase } from "@/lib/supabase"
import { Difficulty, Problem, ProblemGenerationParams } from "@/types/math"
import { getFilteredProblems, MathProblemRecord, mapDbProblemToProblem } from "@/lib/problems"

type GenerateProblemResult = Problem | { comingSoon: boolean }

export async function generateProblem({
  subject,
  topic,
  difficulty,
  wordProblems,
}: ProblemGenerationParams): Promise<GenerateProblemResult> {
  try {
    // First try to find a matching problem in the database
    const problems = await getFilteredProblems({
      subject,
      topic,
      difficulty,
      limit: 1
    });

    if (problems.length > 0) {
      // Return a random problem from the filtered results
      const randomIndex = Math.floor(Math.random() * problems.length);
      return problems[randomIndex];
    }

    // If no problems found, check if we have any problems for this subject/topic without difficulty filter
    const fallbackProblems = await getFilteredProblems({
      subject,
      topic,
      limit: 1
    });

    if (fallbackProblems.length > 0) {
      // Return a random problem from the fallback results
      const randomIndex = Math.floor(Math.random() * fallbackProblems.length);
      return fallbackProblems[randomIndex];
    }

    // If still no problems found, return coming soon
    return { comingSoon: true };
  } catch (error) {
    console.error('Error generating problem:', error);
    return { comingSoon: true };
  }
}

