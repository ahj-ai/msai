/**
 * Static list of topics that have problems available in the database.
 * This list is based on a direct query of the math_problems table in Supabase.
 * Last updated: June 27, 2025
 */

// Topics organized by subject
export const availableTopicsBySubject: Record<string, string[]> = {
  "pre-algebra": [
    // Foundational Number Skills
    "Decimal Place Value Mastery",
    "Decimals",
    
    // Number Theory Unlocked
    "Decimals 🤝 Percents",
    "Divisibility Rules & Factors",
    "Finding GCF",
    "Prime Factorization Power",
    "Nailing LCM",
    "Fractions 🤝 Percents",
    
    // Expressions & Variables
    "Evaluating Variable Expressions",
    "Variables & Expressions",
    "Combining Like Terms",
    "Simplifying by Combining Like Terms",
    
    // Equations & Inequalities
    "One-Step Equations",
    "Two-Step Equations",
    "Multi-Step Equations",
    "Tackling Multi-Step Equations",
    
    // Exponents, Sci-No & Roots
    "Exponent Expertise: Multiplication & Division Properties",
    "Exponent Expertise: Powers of Products & Quotients",
    "Big & Small: Scientific Notation",
    "Root Camp: Understanding Square Roots",
    
    // Other topics
    "Adding and Subtracting Integers",
    "The Distributive Property in Action",
    "Fractions",
    "Order of Operations"
  ],
  "algebra-1": [
    // Foundations & Arithmetic
    "Distributive Property",
    "Absolute Value",
    "Decimals: Add, Subtract",
    "Decimals: Multiply, Divide",
    "Integers: Add and Subtract",
    "Integers: Multiply, Divide",
    "Fractions & Mixed Numbers: Add, Subtract",
    "Order of Operations",
    "Evaluating Expressions",
    "Simplifying Variable Expressions",
    
    // Equations
    "One-Step Equations",
    "Two-Step & Multi-Step Equations",
    "Absolute Value Equations",
    "Literal Equations",
    "One-Step Equation Word Problems",
    
    // Inequalities
    "One-Step, Two-Step, Multi-Step Inequalities",
    "Compound & Absolute Value Inequalities",
    "Word Problems with Inequalities",
    
    // Linear Equations & Graphing
    "Finding Slope",
    "Writing Linear Equations",
    "Solving by Graphing",
    "Solving Substitution",
    "Solving Elimination",
    "Systems of Equations Word Problems",
    
    // Exponents & Radicals
    "Properties of Exponents",
    "Scientific Notation",
    "Square Roots",
    "Radical Expressions: Simplify, Add/Subtract, Multiply, Divide",
    "Solving Radical Equations",
    "Pythagorean Theorem",
    
    // Other topics
    "Word Problems"
  ],
  "algebra-2": [
    // Functions
    "Function notation and evaluation",
    "Function composition",
    "Inverse functions",
    
    // Quadratic Functions
    "Quadratic Functions: Standard form",
    "Quadratic Functions: Factored form",
    "Quadratic formula and discriminant",
    
    // Sequences and Series
    "Arithmetic sequences and series",
    "Geometric sequences and series",
    
    // Linear Equations
    "Slope-intercept and point-slope forms",
    "Parallel and perpendicular lines",
    
    // Systems of Equations
    "Systems of linear equations: substitution",
    "Systems of linear equations: elimination",
    
    // Other topics
    "Applications and word problems"
  ]
};

// Flat list of all available topics
export const availableTopics: string[] = Object.values(availableTopicsBySubject).flat();
