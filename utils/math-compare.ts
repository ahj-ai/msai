/**
 * Utility for comparing mathematical expressions for equality
 * beyond simple string matching
 */

import * as math from 'mathjs';

/**
 * Normalize a mathematical expression by parsing it with mathjs
 * and converting to a standardized form
 */
function normalizeMathExpression(expression: string): string {
  try {
    // Clean up the expression
    let cleaned = expression
      .toString()
      .trim()
      // Replace LaTeX fractions with division
      .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1)/($2)')
      // Remove dollar signs used for LaTeX delimitation
      .replace(/\$/g, '')
      // Remove whitespace
      .replace(/\s+/g, '');
    
    // Try to parse with mathjs and simplify
    try {
      // For numerical expressions, try to evaluate
      const parsed = math.parse(cleaned);
      const simplified = math.simplify(parsed).toString();
      return simplified;
    } catch {
      // If simplification fails, return the cleaned expression
      return cleaned;
    }
  } catch (error) {
    // If all parsing fails, return the original expression
    console.error('Error normalizing math expression:', error);
    return expression.trim();
  }
}

/**
 * Check if two mathematical expressions are equivalent
 * @param expression1 First expression to compare
 * @param expression2 Second expression to compare
 * @returns boolean indicating if the expressions are equivalent
 */
export function areMathExpressionsEquivalent(
  expression1: string | null | undefined,
  expression2: string | null | undefined
): boolean {
  // Handle null/undefined cases
  if (!expression1 || !expression2) return false;
  
  // Normalize both expressions
  const normalized1 = normalizeMathExpression(expression1);
  const normalized2 = normalizeMathExpression(expression2);
  
  // Direct comparison after normalization
  if (normalized1 === normalized2) return true;
  
  // Try numerical evaluation for both expressions
  try {
    const value1 = math.evaluate(normalized1);
    const value2 = math.evaluate(normalized2);
    
    // Check numerical equivalence with a small tolerance for floating point errors
    if (typeof value1 === 'number' && typeof value2 === 'number') {
      return Math.abs(value1 - value2) < 0.0001;
    }
    
    // For non-numeric results, compare string representation
    return value1.toString() === value2.toString();
  } catch {
    // If evaluation fails, they're not equivalent
    return false;
  }
}

/**
 * Simple text normalization for answer checking
 * @param text Text to normalize
 * @returns Normalized text
 */
export function normalizeText(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '');
}

/**
 * Check if two answers are equivalent, handling both
 * mathematical expressions and text answers
 */
export function checkAnswerEquivalence(
  userAnswer: string | null | undefined,
  correctAnswer: string | null | undefined
): boolean {
  // Handle null/undefined cases
  if (!userAnswer || !correctAnswer) return false;
  
  // First try strict string comparison (after basic normalization)
  if (normalizeText(userAnswer) === normalizeText(correctAnswer)) return true;
  
  // Then try mathematical comparison
  return areMathExpressionsEquivalent(userAnswer, correctAnswer);
}
