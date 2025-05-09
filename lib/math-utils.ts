import type { Difficulty } from '@/components/math-game'

interface Problem {
  question: string
  answer: number
}

export function generateProblem(difficulty: Difficulty): Problem {
  const operators = ['+', '-', '*']
  const operator = operators[Math.floor(Math.random() * operators.length)]
  
  let num1: number, num2: number
  
  switch (difficulty) {
    case 'easy':
      num1 = Math.floor(Math.random() * 10) + 1
      num2 = Math.floor(Math.random() * 10) + 1
      break
    case 'medium':
      num1 = Math.floor(Math.random() * 50) + 1
      num2 = Math.floor(Math.random() * 50) + 1
      break
    case 'hard':
      num1 = Math.floor(Math.random() * 100) + 1
      num2 = Math.floor(Math.random() * 100) + 1
      break
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