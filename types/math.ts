export interface MathProblem {
  question: string
  answer: number
}

export interface Problem {
  id?: string
  subject?: string
  topic?: string
  difficulty?: Difficulty
  question: string
  solution: string
  steps?: string[]
  solutionSteps?: string[] // Alternative to steps
  answer?: number | string // For backward compatibility
  hints?: string[]
  userAnswer?: string
  isCorrect?: boolean
  showHint?: boolean
  currentHintIndex?: number
}

// Difficulty levels for the UI
const DIFFICULTY_LEVELS = ['Regular', 'Challenging', 'Advanced'] as const
export type Difficulty = typeof DIFFICULTY_LEVELS[number]

// Internal difficulty levels for the math problem generator
type MathProblemDifficulty = 'regular' | 'honors' | 'ap'

export interface ProblemGenerationParams {
  subject: string
  topic: string
  difficulty: Difficulty
  wordProblems: boolean
}

export interface GeminiJsonResponse {
  problem: {
    title: string;
    statement: string;
    keyConcepts: string[];
  };
  solution: Array<{
    step: string;
    explanation: string;
    work: string;
  }>;
  answer: {
    finalResult: string;
    verification: string;
  };
}
