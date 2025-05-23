"use server"

import { generateMathProblem } from "@/utils/generate-math-problem"
import { Difficulty, Problem, ProblemGenerationParams } from "@/types/math"

type GenerateProblemResult = Problem | { comingSoon: boolean }

export async function generateProblem({
  subject,
  topic,
  difficulty,
  wordProblems,
}: ProblemGenerationParams): Promise<GenerateProblemResult> {
  // Supported topics for native generation
  const nativeMap: Record<string, string[]> = {
    "algebra-1": [
      "Linear Equations",
      "Systems of Equations",
      "Factoring Quadratics",
      "Inequalities",
      "Functions"
    ],
    "geometry": [
      "Angles",
      "Triangles",
      "Circles",
      "Area/Volume"
    ],
    "trigonometry": [
      "Unit Circle",
      "Trig Identities",
      "Solving Triangles"
    ],
    "pre-calculus": [
      "Limits",
      "Sequences and Series"
    ],
    "calculus": [
      "Derivatives (basic)",
      "Integrals (basic)",
      "Limits"
    ]
  };

  // If topic is supported natively and not a word problem, generate natively
  if (
    nativeMap[subject]?.includes(topic) &&
    !wordProblems
  ) {
    try {
      // Map our UI difficulty levels to the math problem generator's difficulty levels
      const difficultyMap: Record<Difficulty, 'regular' | 'honors' | 'ap'> = {
        'Regular': 'regular',
        'Challenging': 'honors',
        'Advanced': 'ap'
      };
      
      const mathProblemDifficulty = difficultyMap[difficulty];
      
      return generateMathProblem(subject, topic, mathProblemDifficulty);
    } catch (error) {
      console.error('Error generating math problem:', error);
      return { comingSoon: true };
    }
  }

  // All other topics (including word problems) require AI (coming soon)
  return { comingSoon: true };
}

