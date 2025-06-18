/**
 * Utility to ensure LaTeX expressions are properly delimited for rendering
 * This fixes issues where raw LaTeX like \frac{3}{4} appears in the UI
 */

/**
 * Ensures all LaTeX expressions in the text are properly delimited with $ signs
 * @param text Text that may contain LaTeX expressions
 * @returns Text with properly delimited LaTeX expressions
 */
export function ensureLatexDelimiters(text: string): string {
  if (!text) return '';
  
  // Replace LaTeX fractions that aren't already delimited
  // This handles cases like "(\frac{3}{4})" that should be "$(\frac{3}{4})$"
  text = text.replace(/(\(?)\\frac\{([^{}]+)\}\{([^{}]+)\}(\)?)(?!\$)/g, '$$$1\\frac{$2}{$3}$4$$');
  
  // Add other LaTeX pattern replacements here as needed
  
  return text;
}
