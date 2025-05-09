"use server"

import { generateMathProblem } from "@/utils/generate-math-problem"

interface GenerateProblemParams {
  subject: string
  topic: string
  difficulty: string
  wordProblems: boolean
}

export async function generateProblem({
  subject,
  topic,
  difficulty,
  wordProblems,
}: GenerateProblemParams) {
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
      return generateMathProblem(subject, topic, difficulty.toLowerCase() as 'easy' | 'regular' | 'hard');
    } catch (error) {
      return { comingSoon: true };
    }
  }

  // All other topics (including word problems) require AI (coming soon)
  return { comingSoon: true };
}

