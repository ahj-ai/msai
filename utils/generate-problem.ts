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

// Choose a random element from an array
function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Round to a specific number of decimal places
function roundTo(num: number, places: number): number {
  const factor = Math.pow(10, places)
  return Math.round(num * factor) / factor
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
    case "mixed":
      return generateMixedOperationProblem(difficulty)
    case "algebra":
      return generateAlgebraProblem(difficulty)
    case "exponents":
      return generateExponentProblem(difficulty)
    case "logarithms":
      return generateLogarithmProblem(difficulty)
    case "fractions":
      return generateFractionProblem(difficulty)
    case "percentages":
      return generatePercentageProblem(difficulty)
    case "sequences":
      return generateSequenceProblem(difficulty)
    case "surprise":
    default:
      // Add all new topics to the random pool
      const topics = [
        "addition", "subtraction", "multiplication", "division", 
        "square", "squareRoot", "unitCircle", "mixed", "algebra", 
        "exponents", "fractions", "percentages", "sequences"
      ]
      // For 🧠 difficulty, exclude more complex topics
      const availableTopics = difficulty === "🧠" 
        ? topics.filter(t => !["logarithms", "sequences", "algebra"].includes(t))
        : topics
      const randomTopic = randomChoice(availableTopics)
      return generateProblem(randomTopic, difficulty)
  }
}

function generateAdditionProblem(difficulty: Difficulty): ProblemType {
  // Level 1: Single digit addition (mentally easy)
  // Level 2: Two-digit + one-digit or friendly two-digit numbers (10s, 5s)
  // Level 3: Two-digit + two-digit with some carrying
  
  let a, b;
  
  if (difficulty === "🧠") {
    // Level 1: Simple single-digit addition
    a = generateNumber(1, 9);
    b = generateNumber(1, 9);
  } else if (difficulty === "🧠🧠") {
    // Level 2: Two-digit + one-digit or friendly numbers
    const pattern = Math.random() < 0.5;
    
    if (pattern) {
      // Two-digit + one-digit
      a = generateNumber(10, 50);
      b = generateNumber(1, 9);
    } else {
      // Friendly two-digit numbers (multiples of 5 or 10)
      a = generateNumber(1, 9) * 10;
      b = generateNumber(1, 9) * 5;
    }
  } else {
    // Level 3: Two-digit addition with carrying
    a = generateNumber(10, 80);
    b = generateNumber(20, 70);
  }
  
  return {
    question: `${a} + ${b} = ?`,
    answer: a + b,
  }
}

function generateSubtractionProblem(difficulty: Difficulty): ProblemType {
  // Level 1: Single digit subtraction (mentally easy)
  // Level 2: Two-digit - one-digit, or friendly two-digit numbers (10s, 5s)
  // Level 3: Two-digit subtraction with borrowing
  
  let a, b;
  
  if (difficulty === "🧠") {
    // Level 1: Simple single-digit subtraction
    b = generateNumber(1, 5);
    a = b + generateNumber(1, 4); // Ensure a > b
  } else if (difficulty === "🧠🧠") {
    const pattern = Math.random() < 0.5;
    
    if (pattern) {
      // Two-digit - one-digit
      a = generateNumber(11, 50);
      b = generateNumber(1, 9);
    } else {
      // Friendly two-digit numbers (multiples of 5 or 10)
      b = generateNumber(1, 5) * 10;
      a = b + generateNumber(1, 5) * 10; // Ensure a > b
    }
  } else {
    // Level 3: Two-digit subtraction with borrowing
    // Ensure ones digit of a is smaller than ones digit of b to force borrowing
    const aOnes = generateNumber(0, 5);
    const bOnes = generateNumber(aOnes + 1, 9);
    const aTens = generateNumber(2, 9);
    const bTens = generateNumber(1, aTens - 1); // Ensure overall a > b
    
    a = aTens * 10 + aOnes;
    b = bTens * 10 + bOnes;
  }
  
  return {
    question: `${a} - ${b} = ?`,
    answer: a - b,
  }
}

function generateMultiplicationProblem(difficulty: Difficulty): ProblemType {
  // Level 1: Single digit multiplication (basic times tables)
  // Level 2: Multiplication by 10s, 5s, or small doubles
  // Level 3: Two-digit by one-digit with some calculation
  
  let a, b;
  
  if (difficulty === "🧠") {
    // Level 1: Basic times tables (2-9)
    a = generateNumber(2, 9);
    b = generateNumber(2, 9);
  } else if (difficulty === "🧠🧠") {
    const pattern = Math.random() < 0.7;
    
    if (pattern) {
      // Multiplication by 10s or 5s
      a = generateNumber(1, 9);
      b = Math.random() < 0.5 ? 10 : 5;
    } else {
      // Small doubles (squaring small numbers)
      a = generateNumber(2, 12);
      b = a;
    }
  } else {
    // Level 3: Two-digit by one-digit
    a = generateNumber(11, 30);
    b = generateNumber(3, 9);
  }
  
  return {
    question: `${a} × ${b} = ?`,
    answer: a * b,
  }
}

function generateDivisionProblem(difficulty: Difficulty): ProblemType {
  // Level 1: Simple division with small answers (1-10)
  // Level 2: Division by 5s and 10s or simple division
  // Level 3: Medium difficulty division with potential remainder
  
  let a, b;
  
  if (difficulty === "🧠") {
    // Level 1: Simple division from times tables
    b = generateNumber(2, 9);
    const quotient = generateNumber(1, 5);
    a = b * quotient; // This ensures a cleanly divisible number
  } else if (difficulty === "🧠🧠") {
    const pattern = Math.random() < 0.6;
    
    if (pattern) {
      // Division by 5s or 10s
      b = Math.random() < 0.5 ? 5 : 10;
      a = b * generateNumber(1, 12);
    } else {
      // Simple division
      b = generateNumber(2, 12);
      a = b * generateNumber(2, 8);
    }
  } else {
    // Level 3: Medium division
    b = generateNumber(3, 15);
    if (Math.random() < 0.7) {
      // Clean division
      a = b * generateNumber(3, 12);
    } else {
      // Division with small remainder
      a = b * generateNumber(3, 12) + generateNumber(1, b - 1);
    }
  }
  
  return {
    question: `${a} ÷ ${b} = ?`,
    answer: a / b,
  }
}

function generateSquareProblem(difficulty: Difficulty): ProblemType {
  // Level 1: Squares of 1-5 (easy to calculate)
  // Level 2: Squares of 6-12
  // Level 3: Squares of teens or special patterns (15, 25, etc.)
  
  let a;
  
  if (difficulty === "🧠") {
    // Level 1: Small squares (1-5)
    a = generateNumber(1, 5);
  } else if (difficulty === "🧠🧠") {
    // Level 2: Medium squares (6-12)
    a = generateNumber(6, 12);
  } else {
    // Level 3: Larger or special numbers
    if (Math.random() < 0.7) {
      // Teens
      a = generateNumber(13, 20);
    } else {
      // Ending in 5 (special pattern)
      a = generateNumber(1, 4) * 10 + 5; // 15, 25, 35, 45
    }
  }
  
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
  // Include common angles from the unit circle at all difficulty levels
  // These correspond to π/6, π/4, π/3, π/2, etc.
  const commonAngles = {
    "🧠": [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360],
    "🧠🧠": [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360],
    "🧠🧠🧠": [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330, 360],
  }

  const angles = commonAngles[difficulty]
  const angle = randomChoice(angles)

  const functions = ["sin", "cos", "tan"]
  // Only use tangent if the angle isn't a multiple of 90° (avoiding undefined tan values)
  const availableFunctions = angle % 90 === 0 ? functions.slice(0, 2) : functions
  const func = randomChoice(availableFunctions)

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

  let answer = 0
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

function generateMixedOperationProblem(difficulty: Difficulty): ProblemType {
  let a, b, c, operation1, operation2, question, answer
  
  const maxValues = {
    "🧠": 10,
    "🧠🧠": 20,
    "🧠🧠🧠": 50
  }
  
  const max = maxValues[difficulty]
  const operations = ['+', '-', '×', '÷']
  
  // Ensure division results in whole numbers
  if (difficulty === "🧠") {
    // Simple 2-operation problem for easier difficulty
    a = generateNumber(2, max)
    b = generateNumber(2, max)
    
    operation1 = randomChoice(operations.slice(0, 2)) // Only + and -
    
    question = `${a} ${operation1} ${b}`
    answer = operation1 === '+' ? a + b : a - b
  } else {
    // More complex problems for medium and hard difficulties
    a = generateNumber(2, max)
    b = generateNumber(2, max)
    c = generateNumber(2, max)
    
    // Choose operations based on difficulty
    if (difficulty === "🧠🧠") {
      operation1 = randomChoice(operations)
      operation2 = randomChoice(operations.slice(0, 2)) // Second operation is + or -
    } else {
      operation1 = randomChoice(operations)
      operation2 = randomChoice(operations)
    }
    
    // Build PEMDAS-aware expression
    if (['×', '÷'].includes(operation1)) {
      // First operation has precedence
      let firstResult
      if (operation1 === '×') {
        firstResult = a * b
      } else {
        // Ensure division results in whole numbers
        b = generateNumber(1, 10)
        a = b * generateNumber(1, 10)
        firstResult = a / b
      }
      
      question = `(${a} ${operation1} ${b}) ${operation2} ${c}`
      
      if (operation2 === '+') answer = firstResult + c
      else if (operation2 === '-') answer = firstResult - c
      else if (operation2 === '×') answer = firstResult * c
      else {
        // Ensure division results in whole numbers
        c = generateNumber(1, 5)
        answer = firstResult / c
        question = `(${a} ${operation1} ${b}) ${operation2} ${c}`
      }
    } else {
      // Second operation has precedence if it's × or ÷
      if (['×', '÷'].includes(operation2)) {
        let secondResult
        if (operation2 === '×') {
          secondResult = b * c
        } else {
          // Ensure division results in whole numbers
          c = generateNumber(1, 10)
          b = c * generateNumber(1, 10)
          secondResult = b / c
        }
        
        question = `${a} ${operation1} (${b} ${operation2} ${c})`
        
        if (operation1 === '+') answer = a + secondResult
        else answer = a - secondResult
      } else {
        // Both operations are + or -
        question = `${a} ${operation1} ${b} ${operation2} ${c}`
        
        if (operation1 === '+' && operation2 === '+') answer = a + b + c
        else if (operation1 === '+' && operation2 === '-') answer = a + b - c
        else if (operation1 === '-' && operation2 === '+') answer = a - b + c
        else answer = a - b - c
      }
    }
  }
  
  return {
    question: `${question} = ?`,
    answer: answer
  }
}

function generateAlgebraProblem(difficulty: Difficulty): ProblemType {
  // Simple equation solving: ax + b = c
  const maxValues = {
    "🧠": 5,
    "🧠🧠": 12,
    "🧠🧠🧠": 25
  }
  
  const max = maxValues[difficulty]
  let a, b, c, x, question, answer
  
  if (difficulty === "🧠") {
    // Simple x + b = c or ax = c
    const problemType = Math.random() > 0.5 ? 'addition' : 'multiplication'
    
    if (problemType === 'addition') {
      x = generateNumber(1, max)
      b = generateNumber(1, max)
      c = x + b
      question = `x + ${b} = ${c}`
      answer = x
    } else {
      x = generateNumber(1, max)
      a = generateNumber(2, 5)
      c = a * x
      question = `${a}x = ${c}`
      answer = x
    }
  } else if (difficulty === "🧠🧠") {
    // ax + b = c
    x = generateNumber(1, max)
    a = generateNumber(2, 6)
    b = generateNumber(1, max)
    c = a * x + b
    question = `${a}x + ${b} = ${c}`
    answer = x
  } else {
    // ax + b = cx + d
    x = generateNumber(1, max)
    a = generateNumber(2, 8)
    b = generateNumber(1, max)
    c = generateNumber(1, a - 1) // Ensure c < a for positive solution
    const d = a * x + b - c * x
    question = `${a}x + ${b} = ${c}x + ${d}`
    answer = x
  }
  
  return {
    question: `Find x: ${question}`,
    answer: answer
  }
}

function generateExponentProblem(difficulty: Difficulty): ProblemType {
  const maxBase = {
    "🧠": 5,
    "🧠🧠": 10,
    "🧠🧠🧠": 20
  }[difficulty]
  
  const maxExponent = {
    "🧠": 2,
    "🧠🧠": 3,
    "🧠🧠🧠": 4
  }[difficulty]
  
  const base = generateNumber(2, maxBase)
  const exponent = generateNumber(2, maxExponent)
  
  return {
    question: `${base}^{${exponent}} = ?`,
    answer: Math.pow(base, exponent)
  }
}

function generateLogarithmProblem(difficulty: Difficulty): ProblemType {
  // Generate log problems where the answers are whole numbers
  // log_a(b) = c means a^c = b
  
  const maxBase = {
    "🧠": 3,
    "🧠🧠": 5,
    "🧠🧠🧠": 10
  }[difficulty]
  
  const maxExponent = {
    "🧠": 3,
    "🧠🧠": 4,
    "🧠🧠🧠": 5
  }[difficulty]
  
  const base = generateNumber(2, maxBase)
  const exponent = generateNumber(2, maxExponent)
  const result = Math.pow(base, exponent)
  
  // Create the problem log_base(result) = ?
  return {
    question: `\\log_{${base}}(${result}) = ?`,
    answer: exponent
  }
}

function generateFractionProblem(difficulty: Difficulty): ProblemType {
  const operations = ['+', '-', '×', '÷']
  let operation
  
  if (difficulty === "🧠") {
    operation = randomChoice(operations.slice(0, 2)) // Only + and - for easy
  } else {
    operation = randomChoice(operations)
  }
  
  // Generate fractions with reasonable denominators
  const maxDenominator = {
    "🧠": 6,
    "🧠🧠": 12,
    "🧠🧠🧠": 20
  }[difficulty]
  
  const num1 = generateNumber(1, maxDenominator - 1)
  const den1 = generateNumber(num1 + 1, maxDenominator) // Ensure proper fraction
  
  const num2 = generateNumber(1, maxDenominator - 1)
  const den2 = generateNumber(num2 + 1, maxDenominator) // Ensure proper fraction
  
  let answer: number
  
  // Calculate the result based on the operation
  switch (operation) {
    case '+':
      answer = (num1 * den2 + num2 * den1) / (den1 * den2)
      break
    case '-':
      answer = (num1 * den2 - num2 * den1) / (den1 * den2)
      break
    case '×':
      answer = (num1 * num2) / (den1 * den2)
      break
    case '÷':
      answer = (num1 * den2) / (den1 * num2)
      break
    default:
      answer = 0
  }
  
  // Round to 2 decimal places for simplicity
  answer = roundTo(answer, 2)
  
  return {
    question: `\\frac{${num1}}{${den1}} ${operation} \\frac{${num2}}{${den2}} = ?`,
    answer: answer
  }
}

function generatePercentageProblem(difficulty: Difficulty): ProblemType {
  const problemTypes = ['find_percentage', 'find_value', 'increase', 'decrease']
  let type
  
  if (difficulty === "🧠") {
    type = randomChoice(problemTypes.slice(0, 2)) // Simpler problems for easy
  } else {
    type = randomChoice(problemTypes)
  }
  
  const maxValue = {
    "🧠": 100,
    "🧠🧠": 500,
    "🧠🧠🧠": 1000
  }[difficulty]
  
  // Generate percentages that make sense
  const percentOptions = {
    "🧠": [5, 10, 20, 25, 50, 75, 100],
    "🧠🧠": [5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 80, 90, 100],
    "🧠🧠🧠": [5, 10, 15, 20, 25, 30, 33.33, 40, 50, 60, 66.67, 75, 80, 90, 100, 120, 150, 200]
  }[difficulty]
  
  const percent = randomChoice(percentOptions)
  let value, question, answer
  
  switch (type) {
    case 'find_percentage':
      value = generateNumber(10, maxValue)
      question = `What is ${percent}% of ${value}?`
      answer = (percent / 100) * value
      break
    case 'find_value':
      answer = generateNumber(10, maxValue)
      value = (answer * 100) / percent
      question = `${percent}% of what number is ${answer}?`
      break
    case 'increase':
      value = generateNumber(10, maxValue)
      question = `${value} increased by ${percent}% is what number?`
      answer = value + (percent / 100) * value
      break
    case 'decrease':
      value = generateNumber(10, maxValue)
      question = `${value} decreased by ${percent}% is what number?`
      answer = value - (percent / 100) * value
      break
    default:
      value = generateNumber(10, maxValue)
      question = `What is ${percent}% of ${value}?`
      answer = (percent / 100) * value
  }
  
  // Round to 2 decimal places
  answer = roundTo(answer, 2)
  
  return { question, answer }
}

function generateSequenceProblem(difficulty: Difficulty): ProblemType {
  const sequenceTypes = [
    'arithmetic', // a, a+d, a+2d, a+3d, ...
    'geometric',  // a, ar, ar², ar³, ...
    'square',     // 1, 4, 9, 16, 25, ...
    'cube',       // 1, 8, 27, 64, 125, ...
    'fibonacci',  // 1, 1, 2, 3, 5, 8, 13, ...
    'triangular'  // 1, 3, 6, 10, 15, ...
  ]
  
  // For easier difficulty, use simpler sequences
  let availableTypes
  if (difficulty === "🧠") {
    availableTypes = sequenceTypes.slice(0, 2) // Only arithmetic and geometric
  } else if (difficulty === "🧠🧠") {
    availableTypes = sequenceTypes.slice(0, 4) // Add square and cube
  } else {
    availableTypes = sequenceTypes // All types
  }
  
  const sequenceType = randomChoice(availableTypes)
  let sequence: number[] = []
  let answer: number
  
  // Generate the sequence based on type
  switch (sequenceType) {
    case 'arithmetic':
      const a = generateNumber(1, 10)
      const d = generateNumber(1, 5) * (Math.random() > 0.5 ? 1 : -1) // Allow negative common difference
      for (let i = 0; i < 5; i++) {
        sequence.push(a + i * d)
      }
      answer = a + 5 * d // 6th term
      break
    
    case 'geometric':
      const firstTerm = generateNumber(1, 5)
      const ratio = generateNumber(2, 3)
      let term = firstTerm
      for (let i = 0; i < 5; i++) {
        sequence.push(term)
        term *= ratio
      }
      answer = sequence[4] * ratio // 6th term
      break
    
    case 'square':
      for (let i = 1; i <= 5; i++) {
        sequence.push(i * i)
      }
      answer = 6 * 6 // 6th term
      break
    
    case 'cube':
      for (let i = 1; i <= 5; i++) {
        sequence.push(i * i * i)
      }
      answer = 6 * 6 * 6 // 6th term
      break
    
    case 'fibonacci':
      sequence = [1, 1]
      for (let i = 2; i < 6; i++) {
        sequence.push(sequence[i-1] + sequence[i-2])
      }
      answer = sequence[4] + sequence[5] // 7th term
      break
    
    case 'triangular':
      for (let i = 1; i <= 5; i++) {
        sequence.push((i * (i + 1)) / 2)
      }
      answer = (6 * 7) / 2 // 6th term
      break
    
    default:
      // Fallback to arithmetic sequence
      const start = generateNumber(1, 10)
      const diff = generateNumber(1, 5)
      for (let i = 0; i < 5; i++) {
        sequence.push(start + i * diff)
      }
      answer = start + 5 * diff // 6th term
  }
  
  // Format the sequence as a string
  const sequenceStr = sequence.join(', ')
  
  return {
    question: `Find the next number in the sequence: ${sequenceStr}, ?`,
    answer: answer
  }
}

