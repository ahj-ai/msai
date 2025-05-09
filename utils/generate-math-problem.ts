type ProblemType = {
  question: string;
  solution: string;
  steps: string[];
}

type Difficulty = 'regular' | 'honors' | 'ap';

function generateNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatPolynomial(coefficients: number[], variable: string = 'x'): string {
  return coefficients
    .map((coef, power) => {
      if (coef === 0) return '';
      const term = power === 0 ? `${coef}` :
                   power === 1 ? `${coef === 1 ? '' : coef === -1 ? '-' : coef}${variable}` :
                   `${coef === 1 ? '' : coef === -1 ? '-' : coef}${variable}^${power}`;
      return term;
    })
    .filter(term => term)
    .join(' + ')
    .replace(/\+ -/g, '- ');
}

export function generateMathProblem(
  subject: string,
  topic: string,
  difficulty: Difficulty
): ProblemType {
  switch (subject) {
    case 'pre-algebra':
      return generatePreAlgebraProblem(topic, difficulty);
    case 'algebra-1':
      return generateAlgebra1Problem(topic, difficulty);
    case 'geometry':
      return generateGeometryProblem(topic, difficulty);
    default:
      throw new Error('Subject not supported for automatic generation');
  }
}

function generatePreAlgebraProblem(topic: string, difficulty: Difficulty): ProblemType {
  switch (topic) {
    case 'basic operations': {
      const num1 = generateNumber(
        difficulty === 'regular' ? 1 : difficulty === 'honors' ? 10 : 20,
        difficulty === 'regular' ? 20 : difficulty === 'honors' ? 50 : 100
      );
      const num2 = generateNumber(
        difficulty === 'regular' ? 1 : difficulty === 'honors' ? 10 : 20,
        difficulty === 'regular' ? 20 : difficulty === 'honors' ? 50 : 100
      );
      const operations = ['+', '-', '×', '÷'];
      const operation = operations[Math.floor(Math.random() * operations.length)];
      
      let answer: number;
      switch (operation) {
        case '+':
          answer = num1 + num2;
          break;
        case '-':
          answer = num1 - num2;
          break;
        case '×':
          answer = num1 * num2;
          break;
        case '÷':
          answer = num1;
          const temp = num1 * num2;
          return {
    steps: [],
            question: `${temp} ÷ ${num2} = ?`,
            solution: `${answer}`,
            steps: [`${temp} ÷ ${num2} = ${answer}`]
          };
        default:
          answer = num1 + num2;
      }
      
      return {
    steps: [],
        question: `${num1} ${operation} ${num2} = ?`,
        solution: `${answer}`,
        steps: [`${num1} ${operation} ${num2} = ${answer}`]
      };
    }

    case 'fractions': {
      const denom1 = generateNumber(2, difficulty === 'regular' ? 6 : 12);
      const denom2 = generateNumber(2, difficulty === 'regular' ? 6 : 12);
      const num1 = generateNumber(1, denom1);
      const num2 = generateNumber(1, denom2);
      
      return {
    steps: [],
        question: `${num1}/${denom1} + ${num2}/${denom2} = ?`,
        solution: `${num1 * denom2 + num2 * denom1}/${denom1 * denom2}`,
        steps: [
          `First, find a common denominator: ${denom1 * denom2}`,
          `Convert first fraction: ${num1}/${denom1} = ${num1 * denom2}/${denom1 * denom2}`,
          `Convert second fraction: ${num2}/${denom2} = ${num2 * denom1}/${denom1 * denom2}`,
          `Add numerators: ${num1 * denom2 + num2 * denom1}/${denom1 * denom2}`
        ]
      };
    }
    case 'integer operations': {
      const num1 = generateNumber(difficulty === 'regular' ? -20 : -50, difficulty === 'regular' ? 20 : 50);
      const num2 = generateNumber(difficulty === 'regular' ? -20 : -50, difficulty === 'regular' ? 20 : 50);
      const operation = ['+', '-', '×'][Math.floor(Math.random() * 3)];
      
      let answer: number;
      switch (operation) {
        case '+': answer = num1 + num2; break;
        case '-': answer = num1 - num2; break;
        case '×': answer = num1 * num2; break;
        default: answer = num1 + num2;
      }
      
      return {
    steps: [],
        question: `${num1} ${operation} ${num2} = ?`,
        solution: `${answer}`,
        steps: [`${num1} ${operation} ${num2} = ${answer}`]
      };
    }
    case 'simple equations': {
      const x = generateNumber(difficulty === 'regular' ? 1 : -10, difficulty === 'regular' ? 10 : 20);
      const a = generateNumber(1, 5);
      const b = generateNumber(-10, 10);
      const c = a * x + b;
      
      return {
    steps: [],
        question: `Solve for x: ${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${c}`,
        solution: `x = ${x}`,
        steps: [
          `${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${c}`,
          `${a}x = ${c - b}`,
          `x = ${x}`
        ]
      };
    }
    default:
      throw new Error('Topic not supported for automatic generation');
  }
}

function generateAlgebra1Problem(topic: string, difficulty: Difficulty): ProblemType {
  switch (topic) {
    case 'linear equations': {
      // Generate ax + b = c
      const a = generateNumber(difficulty === 'regular' ? 1 : -5, difficulty === 'regular' ? 5 : 10);
      const b = generateNumber(difficulty === 'regular' ? -10 : -20, difficulty === 'regular' ? 10 : 20);
      const x = generateNumber(difficulty === 'regular' ? -5 : -10, difficulty === 'regular' ? 5 : 10);
      const c = a * x + b;
      
      return {
    steps: [],
        question: `Solve for x: ${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${c}`,
        solution: `x = ${x}`,
        steps: [
          `Original equation: ${a}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${c}`,
          `Subtract ${b} from both sides: ${a}x = ${c - b}`,
          `Divide both sides by ${a}: x = ${x}`
        ]
      };
    }

    case 'quadratic equations': {
      if (difficulty === 'regular') {
        // Generate (x + p)(x + q) = 0 where p and q are integers
        const p = generateNumber(-5, 5);
        const q = generateNumber(-5, 5);
        return {
    steps: [],
          question: `Solve: x² ${p + q >= 0 ? '+' : ''}${p + q}x ${p * q >= 0 ? '+' : ''}${p * q} = 0`,
          solution: `x = ${-p}, ${-q}`,
          steps: [
            `This is a quadratic equation in the form ax² + bx + c = 0`,
            `It can be factored as (x ${p >= 0 ? '+' : ''}${p})(x ${q >= 0 ? '+' : ''}${q}) = 0`,
            `Using the zero product property:`,
            `x ${p >= 0 ? '+' : ''}${p} = 0 or x ${q >= 0 ? '+' : ''}${q} = 0`,
            `x = ${-p} or x = ${-q}`
          ]
        };
      } else {
        // More complex quadratic for honors/AP
        const a = generateNumber(1, 3);
        const b = generateNumber(-5, 5);
        const c = generateNumber(-5, 5);
        return {
    steps: [],
          question: `Solve: ${a}x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c} = 0`,
          solution: `Use quadratic formula: x = (-${b} ± √(${b}² - 4(${a})(${c}))) / (2(${a}))`,
          steps: [
            `Use the quadratic formula: x = (-b ± √(b² - 4ac)) / (2a)`,
            `Substitute a=${a}, b=${b}, c=${c}`,
            `x = (-${b} ± √(${b}² - 4(${a})(${c}))) / (2(${a}))`
          ]
        };
      }
    }
    case 'basic factoring': {
      const a = generateNumber(difficulty === 'regular' ? 1 : -3, difficulty === 'regular' ? 3 : 5);
      const b = generateNumber(difficulty === 'regular' ? -5 : -10, difficulty === 'regular' ? 5 : 10);
      const c = generateNumber(difficulty === 'regular' ? -5 : -10, difficulty === 'regular' ? 5 : 10);
      
      return {
    steps: [],
        question: `Factor the expression: ${a}x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c}`,
        solution: `${a}(x ${(-b/(2*a)) >= 0 ? '+' : ''}${-b/(2*a)})² ${c - (b*b)/(4*a) >= 0 ? '+' : ''}${c - (b*b)/(4*a)}`,
        steps: [
          `Start with ${a}x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c}`,
          `Find the coefficient of x²: a = ${a}`,
          `Find the coefficient of x: b = ${b}`,
          `Find the constant term: c = ${c}`,
          `Use the formula: a(x + p)² + q`,
          `p = -b / (2a) = ${-b / (2*a)}`,
          `q = c - (b² / 4a) = ${c - (b*b)/(4*a)}`,
          `Result: ${a}(x ${(-b/(2*a)) >= 0 ? '+' : ''}${-b/(2*a)})² ${c - (b*b)/(4*a) >= 0 ? '+' : ''}${c - (b*b)/(4*a)}`
        ]
      };
    }
    case 'systems of equations': {
      const x = generateNumber(difficulty === 'regular' ? -5 : -10, difficulty === 'regular' ? 5 : 10);
      const y = generateNumber(difficulty === 'regular' ? -5 : -10, difficulty === 'regular' ? 5 : 10);
      const a1 = generateNumber(1, 5);
      const b1 = generateNumber(1, 5);
      const c1 = a1 * x + b1 * y;
      const a2 = generateNumber(1, 5);
      const b2 = generateNumber(1, 5);
      const c2 = a2 * x + b2 * y;
      
      return {
    steps: [],
        question: `Solve the system of equations:\n${a1}x + ${b1}y = ${c1}\n${a2}x + ${b2}y = ${c2}`,
        solution: `x = ${x}, y = ${y}`,
        steps: [
          `Start with the system:\n${a1}x + ${b1}y = ${c1}\n${a2}x + ${b2}y = ${c2}`,
          `Multiply the first equation by ${a2} and the second by ${a1}:`,
          `${a1*a2}x + ${b1*a2}y = ${c1*a2}`,
          `${a1*a2}x + ${b2*a1}y = ${c2*a1}`,
          `Subtract the second equation from the first:`,
          `${b1*a2 - b2*a1}y = ${c1*a2 - c2*a1}`,
          `y = ${y}`,
          `Substitute y back into one of the original equations:`,
          `${a1}x + ${b1}(${y}) = ${c1}`,
          `${a1}x = ${c1 - b1*y}`,
          `x = ${x}`
        ]
      };
    }
    default:
      throw new Error('Topic not supported for automatic generation');
  }
}

function generateGeometryProblem(topic: string, difficulty: Difficulty): ProblemType {
  switch (topic) {
    case 'angles': {
      if (difficulty === 'regular') {
        const angle1 = generateNumber(30, 60);
        return {
    steps: [],
          question: `In a triangle, one angle is ${angle1}°, and another angle is ${angle1}°. What is the measure of the third angle?`,
          solution: `${180 - 2 * angle1}°`,
          steps: [
            `Remember: The angles in a triangle sum to 180°`,
            `Given two angles of ${angle1}°`,
            `180° - ${angle1}° - ${angle1}° = ${180 - 2 * angle1}°`
          ]
        };
      } else {
        const baseAngle = generateNumber(30, 60);
        return {
    steps: [],
          question: `In an isosceles triangle, two angles are equal. If one of the base angles is ${baseAngle}°, what is the measure of the vertex angle?`,
          solution: `${180 - 2 * baseAngle}°`,
          steps: [
            `In an isosceles triangle, base angles are equal`,
            `If one base angle is ${baseAngle}°, the other base angle is also ${baseAngle}°`,
            `The sum of angles in a triangle is 180°`,
            `Vertex angle = 180° - ${baseAngle}° - ${baseAngle}° = ${180 - 2 * baseAngle}°`
          ]
        };
      }
    }

    case 'area': {
      const width = generateNumber(
        difficulty === 'regular' ? 3 : 5,
        difficulty === 'regular' ? 10 : 15
      );
      const height = generateNumber(
        difficulty === 'regular' ? 3 : 5,
        difficulty === 'regular' ? 10 : 15
      );
      
      return {
    steps: [],
        question: `Find the area of a rectangle with width ${width} units and height ${height} units.`,
        solution: `${width * height} square units`,
        steps: [
          `Area of a rectangle = width × height`,
          `Area = ${width} × ${height} = ${width * height} square units`
        ]
      };
    }
    case 'pythagorean theorem': {
      const a = generateNumber(difficulty === 'regular' ? 3 : 5, difficulty === 'regular' ? 10 : 20);
      const b = generateNumber(difficulty === 'regular' ? 3 : 5, difficulty === 'regular' ? 10 : 20);
      const c = Math.sqrt(a*a + b*b);
      
      return {
    steps: [],
        question: `In a right triangle, one leg is ${a} units and the other is ${b} units. What is the length of the hypotenuse?`,
        solution: `${c.toFixed(2)} units`,
        steps: [
          `Use the Pythagorean theorem: a² + b² = c²`,
          `Substitute the known values: ${a}² + ${b}² = c²`,
          `Calculate: ${a*a} + ${b*b} = c²`,
          `Simplify: ${a*a + b*b} = c²`,
          `Take the square root of both sides: √${a*a + b*b} = c`,
          `c = ${c.toFixed(2)} units`
        ]
      };
    }
    case 'perimeter': {
      const width = generateNumber(difficulty === 'regular' ? 3 : 5, difficulty === 'regular' ? 10 : 20);
      const height = generateNumber(difficulty === 'regular' ? 3 : 5, difficulty === 'regular' ? 10 : 20);
      
      return {
    steps: [],
        question: `Find the perimeter of a rectangle with width ${width} units and height ${height} units.`,
        solution: `${2 * (width + height)} units`,
        steps: [
          `Perimeter of a rectangle = 2 * (width + height)`,
          `Substitute the values: 2 * (${width} + ${height})`,
          `Calculate: 2 * ${width + height}`,
          `Perimeter = ${2 * (width + height)} units`
        ]
      };
    }
    default:
      throw new Error('Topic not supported for automatic generation');
  }
}

