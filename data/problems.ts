// Hard-coded problem definitions for the Problem Lab
import { Problem, Difficulty } from '@/types/math';

export const orderOfOperationsProblems = [
  {
    id: "oo-regular-1",
    subject: "Pre-Algebra",
    topic: "Order of Operations",
    difficulty: "Regular" as Difficulty,
    question: "Evaluate: $3 + 4 \\times 2$",
    solutionSteps: [
      "Multiply: $4 \\times 2 = 8$",
      "Add: $3 + 8 = 11$"
    ],
    solution: "$3 + 4 \\times 2 = 3 + 8 = 11$",
    answer: "11",
    hints: [
      "Remember the order of operations: PEMDAS (Parentheses, Exponents, Multiplication/Division, Addition/Subtraction)",
      "Multiplication comes before addition in the order of operations"
    ]
  },
  {
    id: "oo-challenging-1",
    subject: "Pre-Algebra",
    topic: "Order of Operations",
    difficulty: "Challenging" as Difficulty,
    question: "Evaluate: $(6 + 2) \\times 3$",
    solutionSteps: [
      "Parentheses first: $6 + 2 = 8$",
      "Then multiply: $8 \\times 3 = 24$"
    ],
    solution: "$(6 + 2) \\times 3 = 8 \\times 3 = 24$",
    answer: "24",
    hints: [
      "Always solve what's inside the parentheses first",
      "After handling the parentheses, proceed with the remaining operations following PEMDAS"
    ]
  },
  {
    id: "oo-advanced-1",
    subject: "Pre-Algebra",
    topic: "Order of Operations",
    difficulty: "Advanced" as Difficulty,
    question: "Evaluate: $8 + (3 \\times 2)^2 - 4$",
    solutionSteps: [
      "Parentheses: $3 \\times 2 = 6$",
      "Exponent: $6^2 = 36$",
      "Add: $8 + 36 = 44$",
      "Subtract: $44 - 4 = 40$"
    ],
    solution: "$8 + (3 \\times 2)^2 - 4 = 8 + 6^2 - 4 = 8 + 36 - 4 = 44 - 4 = 40$",
    answer: "40",
    hints: [
      "Follow PEMDAS: First solve inside the parentheses",
      "Next, apply the exponent to the result from the parentheses",
      "Finally, do the addition and subtraction from left to right"
    ]
  }
];

// Map to store problems by topic
export const problemsByTopic: Record<string, Problem[]> = {
  "Order of Operations": orderOfOperationsProblems
};
