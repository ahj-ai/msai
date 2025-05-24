import { Difficulty, MathProblem } from '@/types/math'

export function generateProblem(difficulty: Difficulty): MathProblem {
  const operators = ['+', '-', '*']
  const operator = operators[Math.floor(Math.random() * operators.length)]
  
  // Initialize with default values
  let num1 = 1
  let num2 = 1
  
  // Update based on difficulty
  switch (difficulty) {
    case 'Regular':
      num1 = Math.floor(Math.random() * 10) + 1
      num2 = Math.floor(Math.random() * 10) + 1
      break
    case 'Challenging':
      num1 = Math.floor(Math.random() * 50) + 1
      num2 = Math.floor(Math.random() * 50) + 1
      break
    case 'Advanced':
      num1 = Math.floor(Math.random() * 100) + 1
      num2 = Math.floor(Math.random() * 100) + 1
      break
    default:
      // This should never happen if the Difficulty type is used correctly
      const _exhaustiveCheck: never = difficulty
      throw new Error(`Unhandled difficulty: ${difficulty}`)
  }

  let answer: number
  switch (operator) {
    case '+':
      answer = num1 + num2
      break
    case '-':
      answer = num1 - num2
      break
    case '*':
      answer = num1 * num2
      break
    default:
      answer = 0
  }

  return {
    question: `${num1} ${operator} ${num2} = ?`,
    answer,
  }
} 