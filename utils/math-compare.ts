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
 * Normalizes text for comparison by removing extra spaces, LaTeX delimiters, etc.
 * @param text The text to normalize
 * @returns Normalized text
 */
function normalizeText(text: string): string {
  if (!text) return '';
  
  // Remove LaTeX delimiters
  let normalized = text.replace(/\$/g, '');
  
  // Remove extra spaces and trim
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  // Convert to lowercase
  normalized = normalized.toLowerCase();
  
  return normalized;
}

/**
 * Normalizes word-form decimal answers by standardizing spacing and hyphens
 * @param text The text to normalize
 * @returns Normalized text with standardized format
 */
function normalizeWordFormDecimal(text: string): string {
  if (!text) return '';
  
  // Convert to lowercase and trim
  let normalized = text.toLowerCase().trim();
  
  // Remove all hyphens
  normalized = normalized.replace(/-/g, ' ');
  
  // Normalize spaces
  normalized = normalized.replace(/\s+/g, ' ');
  
  return normalized;
}

/**
 * Determines if a string represents a descriptive answer containing multiple valid options
 * @param answer A string that may contain descriptive text about valid answers
 * @returns An array of valid answers extracted from the text, or null if not a descriptive answer
 */
function extractValidAnswersFromDescription(answer: string): string[] | null {
  // Special case for pa-dpvm-13: "$0.007$ or seven thousandths"
  if (answer.includes('0.007') && answer.toLowerCase().includes('thousandth')) {
    return ['0.007', 'seven thousandths'];
  }
  
  // Special case for pa-dpvm-27 and similar problems
  if (answer.includes('0.036') && answer.includes('0.037')) {
    // Extract all decimal numbers from the string
    const numbers = answer.match(/\d+\.\d+/g);
    if (numbers && numbers.length >= 2) {
      // Return all extracted numbers
      return numbers;
    }
  }

  // Handle the case where answer contains specific examples in decimal form
  // "Any number like $0.036$ or $0.037$ (e.g., $0.036$)"
  const examplePattern = /any number like\s+[$]?([0-9.]+)[$]?\s+or\s+[$]?([0-9.]+)[$]?/i;
  const exampleMatch = answer.match(examplePattern);
  if (exampleMatch) {
    return [exampleMatch[1], exampleMatch[2]];
  }

  // Extract decimal and word form when they're connected by "or"
  const decimalAndWordPattern = /\$([0-9.]+)\$\s+or\s+([a-z\s]+)/i;
  const decimalAndWordMatch = answer.match(decimalAndWordPattern);
  if (decimalAndWordMatch) {
    return [decimalAndWordMatch[1], decimalAndWordMatch[2].trim()];
  }

  // General pattern for answers with options separated by "or" with LaTeX formatting
  const orPattern = /\$([^$]+)\$(?: or | or (?:an?|the) )\$([^$]+)\$/i;
  const orMatch = answer.match(orPattern);
  if (orMatch) {
    return [orMatch[1], orMatch[2]];
  }

  // Range of values
  const betweenMatch = answer.match(/between \$([0-9.]+)\$ and \$([0-9.]+)\$/i);
  if (betweenMatch) {
    // For ranges, we'll return the bounds, and the actual comparison will be done separately
    return [betweenMatch[1], betweenMatch[2]];
  }

  // If no patterns match, it's not a descriptive multi-option answer
  return null;
}

/**
 * Check if a user answer matches any of the valid answers extracted from a description
 */
function isUserAnswerInValidSet(userAnswer: string, validAnswers: string[]): boolean {
  const normalizedUserAnswer = normalizeMathExpression(userAnswer);
  
  for (const validAnswer of validAnswers) {
    // Try direct string comparison after normalization
    if (normalizeText(normalizedUserAnswer) === normalizeText(validAnswer)) {
      return true;
    }
    
    // Try numeric comparison for decimal values
    try {
      const userValue = parseFloat(normalizedUserAnswer);
      const validValue = parseFloat(validAnswer);
      
      if (!isNaN(userValue) && !isNaN(validValue) && Math.abs(userValue - validValue) < 0.0001) {
        return true;
      }
      
      // Try mathematical comparison for expressions
      if (areMathExpressionsEquivalent(normalizedUserAnswer, validAnswer)) {
        return true;
      }
    } catch {
      // Continue checking other valid answers if this comparison fails
    }
  }
  
  return false;
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

  // Special case for pa-dpvm-14: "Sixty-one hundred-thousandths"
  if (correctAnswer.toLowerCase().includes('sixty') && 
      correctAnswer.toLowerCase().includes('hundred') && 
      correctAnswer.toLowerCase().includes('thousandth')) {
    const normalizedCorrect = normalizeWordFormDecimal(correctAnswer);
    const normalizedUser = normalizeWordFormDecimal(userAnswer);
    
    // Check if all key parts are present
    const hasAllParts = ['sixty', 'one', 'hundred', 'thousandth'].every(part => 
      normalizedUser.includes(part)
    );
    
    // Direct comparison after normalization
    return normalizedUser === normalizedCorrect || hasAllParts;
  }

  // Special case for pa-dpvm-13: "$0.007$ or seven thousandths"
  if (correctAnswer.includes('0.007') && correctAnswer.toLowerCase().includes('thousandth')) {
    const normalizedUserAnswer = userAnswer.trim().toLowerCase();
    return normalizedUserAnswer === '0.007' || 
           normalizedUserAnswer === '.007' ||
           normalizedUserAnswer.includes('seven') && normalizedUserAnswer.includes('thousandth');
  }

  // Special case for pa-dpvm-27: hardcoded validation for 0.036 and 0.037
  if (correctAnswer.includes('Any number like') && 
      (correctAnswer.includes('0.036') || correctAnswer.includes('0.037'))) {
    const normalizedUserAnswer = userAnswer.trim().replace(/^0+(?=\d)/, '');
    return normalizedUserAnswer === '0.036' || normalizedUserAnswer === '0.037' || 
           normalizedUserAnswer === '.036' || normalizedUserAnswer === '.037';
  }
  
  // Check if the correct answer is a descriptive text containing multiple valid answers
  const validAnswers = extractValidAnswersFromDescription(correctAnswer);
  if (validAnswers && validAnswers.length > 0) {
    return isUserAnswerInValidSet(userAnswer, validAnswers);
  }
  
  // Check if this is a word-form decimal answer (contains words like hundredth, thousandth, etc.)
  if (correctAnswer.toLowerCase().match(/\b(ten|hundred|thousand|million)th/)) {
    const normalizedCorrect = normalizeWordFormDecimal(correctAnswer);
    const normalizedUser = normalizeWordFormDecimal(userAnswer);
    if (normalizedUser === normalizedCorrect) return true;
  }
  
  // First try strict string comparison (after basic normalization)
  if (normalizeText(userAnswer) === normalizeText(correctAnswer)) return true;
  
  // Then try mathematical comparison
  return areMathExpressionsEquivalent(userAnswer, correctAnswer);
}
