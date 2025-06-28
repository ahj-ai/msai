/**
 * Static list of topics that have problems available in the database.
 * This list is based on a direct query of the math_problems table in Supabase.
 * Last updated: June 27, 2025
 */

// Topics organized by subject
export const availableTopicsBySubject: Record<string, string[]> = {
  "pre-algebra": [
    "Adding and Subtracting Integers",
    "Big & Small: Scientific Notation",
    "Combining Like Terms",
    "Decimal Place Value Mastery",
    "Decimals",
    "Decimals 🤝 Percents",
    "Divisibility Rules & Factors",
    "Evaluating Variable Expressions",
    "Exponent Expertise: Multiplication & Division Properties",
    "Exponent Expertise: Powers of Products & Quotients",
    "Finding GCF",
    "Fractions",
    "Fractions 🤝 Percents",
    "Multi-Step Equations",
    "Nailing LCM",
    "One-Step Equations",
    "Order of Operations",
    "Prime Factorization Power",
    "Root Camp: Understanding Square Roots",
    "Simplifying by Combining Like Terms",
    "Tackling Multi-Step Equations",
    "The Distributive Property in Action",
    "Two-Step Equations",
    "Variables & Expressions"
  ],
  "algebra-1": [
    "Absolute Value",
    "Absolute Value Equations",
    "Compound & Absolute Value Inequalities",
    "Decimals: Add, Subtract",
    "Decimals: Multiply, Divide",
    "Distributive Property",
    "Evaluating Expressions",
    "Finding Slope",
    "Fractions & Mixed Numbers: Add, Subtract",
    "Integers: Add and Subtract",
    "Integers: Multiply, Divide",
    "Literal Equations",
    "One-Step Equations",
    "One-Step Equation Word Problems",
    "One-Step, Two-Step, Multi-Step Inequalities",
    "Order of Operations",
    "Properties of Exponents",
    "Pythagorean Theorem",
    "Radical Expressions: Simplify, Add/Subtract, Multiply, Divide",
    "Scientific Notation",
    "Simplifying Variable Expressions",
    "Solving by Graphing",
    "Solving Elimination",
    "Solving Radical Equations",
    "Solving Substitution",
    "Square Roots",
    "Systems of Equations Word Problems",
    "Two-Step & Multi-Step Equations",
    "Word Problems",
    "Word Problems with Inequalities",
    "Writing Linear Equations"
  ],
  "algebra-2": [
    "Absolute value functions and equations",
    "Applications and word problems",
    "Arithmetic sequences and series",
    "Completing the square",
    "Domain and range",
    "Even and odd functions",
    "Function composition",
    "Function notation and evaluation",
    "Geometric sequences and series",
    "Infinite geometric series",
    "Inverse functions",
    "Parallel and perpendicular lines",
    "Quadratic formula and discriminant",
    "Quadratic Functions: Factored form",
    "Quadratic Functions: Standard form",
    "Quadratic Functions: Vertex form",
    "Sigma notation",
    "Slope-intercept and point-slope forms",
    "Solving quadratic equations by factoring",
    "Systems of linear equations: elimination",
    "Systems of linear equations: substitution"
  ]
};

// Flat list of all available topics
export const availableTopics: string[] = Object.values(availableTopicsBySubject).flat();
