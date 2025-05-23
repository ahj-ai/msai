import { supabase } from '@/lib/supabase';

// Additional "Order of Operations" problems to add to the database
const additionalProblems = [
  {
    id: "oo-regular-2",
    subject: "Pre-Algebra",
    topic: "Order of Operations",
    difficulty: "Regular",
    question: "Evaluate: $5 + 2 \\times 3 - 1$",
    solution_steps: [
      "Multiply: $2 \\times 3 = 6$",
      "Add and subtract from left to right: $5 + 6 - 1 = 11 - 1 = 10$"
    ],
    answer: "10",
    source_type: "static",
    metadata: {
      hints: [
        "Remember to follow PEMDAS: Parentheses, Exponents, Multiplication/Division, Addition/Subtraction",
        "Multiplication comes before addition and subtraction"
      ],
      solution: "$5 + 2 \\times 3 - 1 = 5 + 6 - 1 = 11 - 1 = 10$"
    }
  },
  {
    id: "oo-regular-3",
    subject: "Pre-Algebra",
    topic: "Order of Operations",
    difficulty: "Regular",
    question: "Evaluate: $12 ÷ 4 + 3 \\times 2$",
    solution_steps: [
      "Divide: $12 ÷ 4 = 3$",
      "Multiply: $3 \\times 2 = 6$",
      "Add: $3 + 6 = 9$"
    ],
    answer: "9",
    source_type: "static",
    metadata: {
      hints: [
        "Remember that multiplication and division have the same precedence",
        "Evaluate from left to right when operations have the same precedence"
      ],
      solution: "$12 ÷ 4 + 3 \\times 2 = 3 + 3 \\times 2 = 3 + 6 = 9$"
    }
  },
  {
    id: "oo-challenging-2",
    subject: "Pre-Algebra",
    topic: "Order of Operations",
    difficulty: "Challenging",
    question: "Evaluate: $2^3 + 4 \\times (6 - 2)$",
    solution_steps: [
      "Calculate inside parentheses: $6 - 2 = 4$",
      "Calculate the exponent: $2^3 = 8$",
      "Multiply: $4 \\times 4 = 16$",
      "Add: $8 + 16 = 24$"
    ],
    answer: "24",
    source_type: "static",
    metadata: {
      hints: [
        "Remember PEMDAS: Parentheses first, then Exponents, then Multiplication",
        "Calculate operations inside parentheses before applying exponents"
      ],
      solution: "$2^3 + 4 \\times (6 - 2) = 2^3 + 4 \\times 4 = 8 + 16 = 24$"
    }
  },
  {
    id: "oo-challenging-3",
    subject: "Pre-Algebra",
    topic: "Order of Operations",
    difficulty: "Challenging",
    question: "Evaluate: $18 ÷ (2 + 4) \\times 3$",
    solution_steps: [
      "Calculate inside parentheses: $2 + 4 = 6$",
      "Divide: $18 ÷ 6 = 3$",
      "Multiply: $3 \\times 3 = 9$"
    ],
    answer: "9",
    source_type: "static",
    metadata: {
      hints: [
        "First evaluate the expression inside the parentheses",
        "Then perform division and multiplication from left to right"
      ],
      solution: "$18 ÷ (2 + 4) \\times 3 = 18 ÷ 6 \\times 3 = 3 \\times 3 = 9$"
    }
  },
  {
    id: "oo-advanced-2",
    subject: "Pre-Algebra",
    topic: "Order of Operations",
    difficulty: "Advanced",
    question: "Evaluate: $3 \\times [4 + 2 \\times (7 - 5)]$",
    solution_steps: [
      "Calculate innermost parentheses: $7 - 5 = 2$",
      "Multiply inside brackets: $2 \\times 2 = 4$",
      "Add inside brackets: $4 + 4 = 8$",
      "Multiply: $3 \\times 8 = 24$"
    ],
    answer: "24",
    source_type: "static",
    metadata: {
      hints: [
        "Work from the innermost parentheses outward",
        "Square brackets and parentheses both indicate grouping, so follow the same rules"
      ],
      solution: "$3 \\times [4 + 2 \\times (7 - 5)] = 3 \\times [4 + 2 \\times 2] = 3 \\times [4 + 4] = 3 \\times 8 = 24$"
    }
  }
];

async function addMoreProblems() {
  console.log(`Adding ${additionalProblems.length} more problems to the database...`);
  
  // Insert problems one by one to handle errors better
  for (const problem of additionalProblems) {
    const { data, error } = await supabase
      .from('math_problems')
      .upsert(problem, { onConflict: 'id' })
      .select('id');
      
    if (error) {
      console.error(`Error adding problem ${problem.id}:`, error);
    } else {
      console.log(`Added problem ${problem.id}`);
    }
  }
  
  console.log('Finished adding problems!');
}

// Run the function
addMoreProblems()
  .catch(console.error)
  .finally(() => process.exit());
