import { Difficulty } from '@/types/math';

export const subjects = {
  "pre-algebra": {
    name: "Pre-Algebra",
    available: true,
    topicGroups: {
      "Foundational Number Skills 🧱": [
        "Decimal Place Value Mastery"
      ],
      "Number Theory Unlocked 🔑": [
        "Decimals 🤝 Percents",
        "Divisibility Rules & Factors",
        "Finding GCF (Greatest Common Factor)"
      ],
      "Expressions & Variables 🚀": [
        "Evaluating Variable Expressions"
      ],
      "Equations & Inequalities 💡": [
        "One-Step Equations (Integers, Decimals, Fractions)",
        "Two-Step Equations (Integers, Decimals)",
        "Tackling Multi-Step Equations"
      ],
      "Exponents, Sci-No & Roots ⚡": [
        "Exponent Expertise: Multiplication & Division Properties",
        "Powers of Products & Quotients",
        "Big & Small: Scientific Notation"
      ],
      "🔜 Coming Soon": [
        "Rounding with Confidence",
        "Adding and Subtracting Integers",
        "Multiplying and Dividing Integers",
        "Adding and Subtracting Decimals",
        "Multiplying & Dividing Decimals",
        "Fractions Operations",
        "Mixed Number Operations",
        "Converting Fractions 🤝 Decimals",
        "Order of Operations",
        "Fractions 🤝 Percents",
        "Prime Factorization Power",
        "Nailing LCM (Least Common Multiple)",
        "The Language of Algebra: Variables & Verbal Expressions (Words to Algebra)",
        "The Distributive Property in Action",
        "Simplifying by Combining Like Terms",
        "Real-World Equation Challenges: One-Step & Two-Step Word Problems",
        "Root Camp: Understanding Square Root",
        "Ratio & Rate Fundamentals",
        "Proportional Relationships",
        "Unit Rate & Unit Price",
        "Solving Proportions",
        "The Coordinate Plane",
        "Factoring Monomials (Advanced)",
        "Adding & Subtracting Polynomials",
        "Multiplying Polynomials by Monomials",
        "Multiplying Binomials (FOIL & Beyond)"
      ]
    }
  },
  "algebra-1": {
    name: "Algebra I",
    available: true,
    topicGroups: {
      "🔢 Foundations & Arithmetic": [
        "Distributive Property",
        "Absolute Value",
        "Decimals: Add, Subtract",
        "Decimals: Multiply, Divide"
      ],
      "📐 Equations": [
        "One-Step Equations",
        "Two-Step Equations",
        "Multi-Step Equations",
        "Equations with Variables on Both Sides",
        "Absolute Value Equations",
        "Proportions"
      ],
      "📈 Inequalities": [
        "One-Step Inequalities",
        "Two-Step Inequalities",
        "Multi-Step Inequalities",
        "Compound Inequalities"
      ],
      "📉 Linear Equations & Graphing": [
        "Finding Slope",
        "Writing Linear Equations"
      ],
      "⚡ Exponents & Radicals": [
        "Properties of Exponents",
        "Scientific Notation",
        "Square Roots",
        "Radical Expressions: Simplify, Add/Subtract, Multiply, Divide",
        "Solving Radical Equations",
        "Pythagorean Theorem"
      ],
      "🔜 Coming Soon": [
        "Order of Operations",
        "Evaluating Expressions",
        "Simplifying Variable Expressions",
        "Integers: Add and Subtract",
        "Integers: Multiply, Divide",
        "Fractions: Add, Subtract, Multiply, Divide",
        "Word Problems",
        "Graphing: Slope-Intercept, Standard Form, Absolute Value Equations",
        "Graphing Linear Inequalities",
        "Graphing Single-Variable Inequalities",
        "Graphing Systems of Inequalities"
      ]
    }
  },
  "algebra-2": {
    name: "Algebra II",
    available: true,
    topicGroups: {
      "📊 Functions": [
        "Function notation and evaluation",
        "Domain and range",
        "Function composition",
        "Inverse functions",
        "Even and odd functions"
      ],
      "🎪 Quadratic Functions": [
        "Graphing quadratic functions",
        "Solving quadratic equations by factoring",
        "Solving quadratic equations by taking square roots",
        "The quadratic formula",
        "Completing the square",
        "The discriminant"
      ],
      "🌿 Polynomial Functions": [
        "Polynomial long division",
        "Synthetic division",
        "The remainder and factor theorems",
        "Finding zeros of polynomial functions"
      ],
      "📈 Systems of Equations": [
        "Systems of linear equations: substitution",
        "Systems of linear equations: elimination"
      ],
      "🔄 Sequences and Series": [
        "Arithmetic sequences and series",
        "Geometric sequences and series",
        "Infinite geometric series",
        "Sigma notation"
      ],
      "🔜 Coming Soon": [
        "Quadratic Functions: Vertex form",
        "Function transformations (translations, reflections, stretches, compressions)",
        "Factoring: Difference of Squares",
        "Factoring: GCF",
        "Factoring: Sum/Difference of Cubes",
        "Factoring: By Grouping",
        "Factoring: Trinomials (a=1)",
        "Factoring: Trinomials (a>1)",
        "Graphing linear inequalities",
        "Logarithmic Functions",
        "Properties of Logarithms",
        "Solving Exponential Equations",
        "Solving Logarithmic Equations"
      ]
    }
  }
};

export const difficulties: Difficulty[] = ['Regular', 'Challenging', 'Advanced'];

export const wordProblemTopics = [
  "Word Problems",
  "Word Problems with Inequalities",
  "One-Step Equation Word Problems",
  "Related Rates (word problems)",
];
