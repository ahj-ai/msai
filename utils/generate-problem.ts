import { degreesToRadians } from "./angle-conversions"

type ProblemType = {
  question: string
  answer: number
  solution?: string
  steps?: string[]
}

type Difficulty = "🧠" | "🧠🧠" | "🧠🧠🧠"

function generateNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function generateProblem(topic: string, difficulty: Difficulty): ProblemType {
  switch (topic) {
    case "addition":
      return generateAdditionProblem(difficulty)
    case "subtraction":
      return generateSubtractionProblem(difficulty)
    case "multiplication":
      return generateMultiplicationProblem(difficulty)
    case "division":
      return generateDivisionProblem(difficulty)
    case "square":
      return generateSquareProblem(difficulty)
    case "squareRoot":
      return generateSquareRootProblem(difficulty)
    case "unitCircle":
      return generateUnitCircleProblem(difficulty)
    case "surprise":
    default:
      const topics = ["addition", "subtraction", "multiplication", "division", "square", "squareRoot", "unitCircle"]
      const randomTopic = topics[Math.floor(Math.random() * topics.length)]
      return generateProblem(randomTopic, difficulty)
  }
}

function generateAdditionProblem(difficulty: Difficulty): ProblemType {
  const max = difficulty === "🧠" ? 10 : difficulty === "🧠🧠" ? 100 : 1000
  const a = generateNumber(1, max)
  const b = generateNumber(1, max)
  return {
    question: `${a} + ${b} = ?`,
    answer: a + b,
  }
}

function generateSubtractionProblem(difficulty: Difficulty): ProblemType {
  const max = difficulty === "🧠" ? 10 : difficulty === "🧠🧠" ? 100 : 1000
  const a = generateNumber(1, max)
  const b = generateNumber(1, a)
  return {
    question: `${a} - ${b} = ?`,
    answer: a - b,
  }
}

function generateMultiplicationProblem(difficulty: Difficulty): ProblemType {
  const max = difficulty === "🧠" ? 10 : difficulty === "🧠🧠" ? 20 : 50
  const a = generateNumber(2, max)
  const b = generateNumber(2, max)
  return {
    question: `${a} × ${b} = ?`,
    answer: a * b,
  }
}

function generateDivisionProblem(difficulty: Difficulty): ProblemType {
  const max = difficulty === "🧠" ? 10 : difficulty === "🧠🧠" ? 20 : 50
  const b = generateNumber(2, max)
  const a = b * generateNumber(2, max)
  return {
    question: `${a} ÷ ${b} = ?`,
    answer: a / b,
  }
}

function generateSquareProblem(difficulty: Difficulty): ProblemType {
  const max = difficulty === "🧠" ? 10 : difficulty === "🧠🧠" ? 20 : 30
  const a = generateNumber(2, max)
  return {
    question: `${a}² = ?`,
    answer: a * a,
  }
}

function generateSquareRootProblem(difficulty: Difficulty): ProblemType {
  const max = difficulty === "🧠" ? 10 : difficulty === "🧠🧠" ? 20 : 30
  const a = generateNumber(2, max)
  return {
    question: `√${a * a} = ?`,
    answer: a,
  }
}

function generateUnitCircleProblem(difficulty: Difficulty): ProblemType {
  const commonAngles = {
    "🧠": [0, 90, 180, 270, 360],
    "🧠🧠": [0, 30, 45, 60, 90, 120, 135, 150, 180],
    "🧠🧠🧠": [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360],
  }

  const angles = commonAngles[difficulty]
  const angle = angles[Math.floor(Math.random() * angles.length)]

  const functions = ["sin", "cos", "tan"]
  const func = functions[Math.floor(Math.random() * (angle % 90 === 0 ? functions.length : 2))]

  function angleToLatex(degrees: number): string {
    if (degrees === 0) return "0"
    if (degrees === 360) return "2\\pi"

    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
    let numerator = degrees
    let denominator = 180

    const divisor = gcd(numerator, denominator)
    numerator /= divisor
    denominator /= divisor

    if (denominator === 1) return `${numerator}\\pi`
    return `\\frac{${numerator}\\pi}{${denominator}}`
  }

  let answer: number
  const radians = degreesToRadians(angle)

  switch (func) {
    case "sin":
      answer = Math.round(Math.sin(radians))
      break
    case "cos":
      answer = Math.round(Math.cos(radians))
      break
    case "tan":
      answer = Math.round(Math.tan(radians))
      break
  }

  return {
    question: `\\${func}(${angleToLatex(angle)})`,
    answer: answer,
  }
}

