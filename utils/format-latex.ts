/**
 * Utility to ensure LaTeX expressions are properly delimited for rendering
 * This fixes issues where raw LaTeX like \frac{3}{4} appears in the UI
 * and ensures proper rendering in different contexts (React components, Gemini output, etc.)
 */

/**
 * Ensures all LaTeX expressions in the text are properly delimited with $ signs
 * @param text Text that may contain LaTeX expressions
 * @returns Text with properly delimited LaTeX expressions
 */
export function ensureLatexDelimiters(text: string): string {
  if (!text) return '';

  // --- Start of AGGRESSIVE TEXT PROCESSING ---
  
  // AGGRESSIVE dictionary-based word splitter for concatenated text
  function breakLongWords(str: string): string {
    // Skip if it's likely a LaTeX expression
    if (str.includes('\\')) {
      return str;
    }

    // Dictionary of common words to look for - order is important (longer words first)
    const commonWords = [
      // Longer compound words first
      'senior', 'citizen', 'ticket', 'price', 'child', 'should', 'equal', 'second', 'day', 'first',
      // Then shorter common words
      'the', 'of', 'a', 'and', 'is', 'to', 'for', 'by', 'from', 'both', 'sides', 'text'
    ];

    // Start with the input string
    let result = str;
    let prevResult = '';
    
    // Keep trying to split until no more progress is made
    while (result !== prevResult) {
      prevResult = result;
      
      // Try each word in our dictionary
      commonWords.forEach(word => {
        // Case insensitive global search
        const regex = new RegExp(word, 'gi');
        
        // Find all matches
        let match;
        let indices = [];
        while ((match = regex.exec(result)) !== null) {
          indices.push(match.index);
        }
        
        // Process matches from end to start to avoid index shifting
        indices.reverse().forEach(index => {
          // Only insert space if not already surrounded by spaces
          const needSpaceBefore = index > 0 && result[index - 1] !== ' ';
          const needSpaceAfter = index + word.length < result.length && result[index + word.length] !== ' ';
          
          // Build the replacement with appropriate spaces
          let replacement = '';
          if (needSpaceBefore) replacement += ' ';
          replacement += result.substr(index, word.length);
          if (needSpaceAfter) replacement += ' ';
          
          // Replace the original text with the spaced version
          result = result.substring(0, index) + 
                  (needSpaceBefore ? ' ' : '') + 
                  result.substr(index, word.length) + 
                  (needSpaceAfter ? ' ' : '') + 
                  result.substring(index + word.length);
        });
      });
      
      // Clean up any double spaces
      result = result.replace(/\s+/g, ' ').trim();
    }
    
    return result;
  }
  
  // Process text to handle periods and long concatenated text
  function processText(chunk: string): string {
    // Handle leading periods that join to text (e.g., ".Theprice")
    chunk = chunk.replace(/\.(\w)/g, '. $1');
    
    // Split words longer than 15 chars that aren't LaTeX commands
    const words = chunk.split(/\s+/);
    return words.map(word => breakLongWords(word)).join(' ');
  }
  
  // Direct fixes for the exact problem patterns we keep seeing
  text = text.replace(/\.Thepriceof/g, '. The price of');
  text = text.replace(/andthepriceof/g, 'and the price of');
  text = text.replace(/Forthesecondday/g, 'For the second day');
  text = text.replace(/shouldequal/g, 'should equal');
  
  // Apply text processing to non-LaTeX parts
  text = text.replace(/([^$]+)|\$(.*?)\$/g, (match, textPart, latexPart) => {
    if (textPart) {
      return processText(textPart);
    } else {
      return `$${latexPart}$`; // Preserve LaTeX parts
    }
  });
  
  // --- Start of Standard Cleanup Stage ---

  // 1. Split text based on camelCase, which often indicates missing spaces.
  text = text.replace(/([a-z])([A-Z])/g, '$1 $2');

  // 2. Add space between numbers and text.
  text = text.replace(/(\d)([a-zA-Z])/g, '$1 $2');
  text = text.replace(/([a-zA-Z])(\d)/g, '$1 $2');

  // 3. Add spaces around operators, but not if they are part of a LaTeX command.
  text = text.replace(/\s*([=\+\-\*\/])\s*/g, ' $1 ');
  
  // 4. Correct malformed delimiters like "38$$3s" into "38 $$3s$$".
  text = text.replace(/(\d+)\$\$([^\s$]+)/g, '$1 $$$2$$');
  
  // 5. Handle stray backslashes followed by numbers (e.g., \38 -> $38$).
  text = text.replace(/\\(\d+)/g, '$$$1$');

  // 6. Remove dollar signs around plain words that are not math (e.g., "$Divide$").
  // This avoids incorrectly removing delimiters from single variables like "$s$".
  text = text.replace(/\$([a-zA-Z]{2,}(\s[a-zA-Z]{2,})*)\$/g, '$1');

  // 7. Handle long concatenated text with a dollar value at the end.
  text = text.replace(/([a-zA-Z]+)\$(\d+)\$/g, '$1 \$$2\$');

  // 8. Separate words from numbers followed by a single delimiter (e.g., "and2$").
  text = text.replace(/([a-zA-Z]+)(\d+)\$/g, '$1 \$$2\$');
  
  // 9. Fix the specific pattern for price formatting (.Thepriceofachildticketis$14$.)
  text = text.replace(/\.([A-Z][a-z]+)([a-z]+)(\$\d+\$)/g, '. $1 $2 $3');

  // 10. Fix common unbalanced delimiters - specifically target \frac issues
  text = text.replace(/(\\frac\{\d+\}\{\d+\})\$\$(\s*=\s*\d+)/g, '$$$$1$$$2$$');
  
  // 11. Make sure $ and $$ delimiters are balanced in the entire text
  const singleCount = (text.match(/(?<!\$)\$(?!\$)/g) || []).length;
  if (singleCount % 2 !== 0) {
    // Find the last single $ and check if it's missing a closing delimiter
    const lastIndex = text.lastIndexOf('$');
    if (lastIndex !== -1 && text[lastIndex-1] !== '$' && (lastIndex === text.length - 1 || text[lastIndex+1] !== '$')) {
      // Missing a closing delimiter - add it at the end of the word or number
      const afterDollar = text.substring(lastIndex + 1);
      const wordEnd = afterDollar.search(/[\s.,;:!?)]}]/);
      
      if (wordEnd !== -1) {
        text = text.substring(0, lastIndex + 1 + wordEnd) + '$' + text.substring(lastIndex + 1 + wordEnd);
      } else {
        // If we can't find the end of the word, just add it at the end
        text += '$';
      }
    }
  }

  // --- End of Comprehensive Cleanup Stage ---

  const placeholders = new Map<string, string>();

  // Protect existing delimited LaTeX with unique placeholders.
  text = text.replace(/\$\$(.*?)\$\$|\$([^\$]+?)\$/g, (match) => {
    const placeholder = `__LATEXPLACEHOLDER${Math.random().toString(36).slice(2)}__`;
    placeholders.set(placeholder, match);
    return placeholder;
  });

  // Handle common LaTeX commands that aren't already delimited
  const latexCommands = [
    { pattern: /(\(?)\\frac\{([^{}]+)\}\{([^{}]+)\}(\)?)/g, replacement: '$$$1\\frac{$2}{$3}$4$$' },
    { pattern: /(\(?)\\sqrt\{([^{}]+)\}(\)?)/g, replacement: '$$$1\\sqrt{$2}$3$$' },
    { pattern: /\\pi(?![a-zA-Z])/g, replacement: '$\\pi$' },
    { pattern: /\\theta(?![a-zA-Z])/g, replacement: '$\\theta$' },
    { pattern: /\\alpha(?![a-zA-Z])/g, replacement: '$\\alpha$' },
    { pattern: /\\beta(?![a-zA-Z])/g, replacement: '$\\beta$' },
    { pattern: /\\gamma(?![a-zA-Z])/g, replacement: '$\\gamma$' },
    { pattern: /\\delta(?![a-zA-Z])/g, replacement: '$\\delta$' },
    { pattern: /\\sum(?![a-zA-Z])/g, replacement: '$\\sum$' },
    { pattern: /\\int(?![a-zA-Z])/g, replacement: '$\\int$' },
    { pattern: /\\lim(?![a-zA-Z])/g, replacement: '$\\lim$' },
    { pattern: /\\infty(?![a-zA-Z])/g, replacement: '$\\infty$' },
    { pattern: /([a-zA-Z0-9])\^(\d+|[a-zA-Z])/g, replacement: '$$$1^$2$$' },
    { pattern: /([a-zA-Z0-9])_(\d+|[a-zA-Z])/g, replacement: '$$$1_$2$$' },
  ];
  
  latexCommands.forEach(({ pattern, replacement }) => {
    text = text.replace(pattern, replacement);
  });
  
  // Special case for inline math with no spaces
  text = text.replace(/([a-zA-Z])\$(\d+)\$([a-zA-Z])/g, '$1 $$$2$$ $3');
  
  // Restore the original delimited expressions
  placeholders.forEach((original, placeholder) => {
    text = text.replace(new RegExp(placeholder, 'g'), original);
  });
  
  // Final cleanup: trim whitespace
  return text.trim();
}

/**
 * Formats LaTeX specifically for Gemini output where markdown processing might interfere
 * @param text Text containing LaTeX to be displayed in Gemini output
 * @returns Text with LaTeX formatted to display correctly in Gemini
 */
export function formatLatexForGemini(text: string): string {
  if (!text) return '';
  
  // First ensure all LaTeX is properly delimited
  text = ensureLatexDelimiters(text);
  
  // For Gemini output, we need to escape backslashes and use different delimiters
  // Replace $...$ with \(...\) for inline math
  text = text.replace(/\$(.*?)\$/g, '\\($1\\)');
  
  // Double escape backslashes inside LaTeX delimiters
  text = text.replace(/\\\((.*?)\\\)/g, (match, p1) => {
    return '\\(' + p1.replace(/\\/g, '\\\\') + '\\)';
  });
  
  return text;
}
