import { useState } from 'react';
import { GeminiJsonResponse } from '@/types/math';

interface UseSimilarProblemOptions {
  onSimilarProblemGenerated?: (problem: GeminiJsonResponse) => void;
}

export function useSimilarProblem(getToken: () => Promise<string | null>, options?: UseSimilarProblemOptions) {
  const [isGeneratingSimilar, setIsGeneratingSimilar] = useState(false);
  const [similarProblem, setSimilarProblem] = useState<GeminiJsonResponse | null>(null);
  const [similarProblemError, setSimilarProblemError] = useState<string | null>(null);
  const [showSimilarProblem, setShowSimilarProblem] = useState(false);

  const generateSimilarProblem = async (originalProblem: GeminiJsonResponse) => {
    setIsGeneratingSimilar(true);
    setSimilarProblemError(null);
    setSimilarProblem(null);

    try {
      const token = await getToken();
      if (!token) {
        throw new Error('You must be signed in to use this feature.');
      }

      const response = await fetch('/api/generate-similar-problem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ originalProblem }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        let errorMsg = 'Failed to generate similar problem.';
        try {
          const errorData = JSON.parse(responseText);
          if (errorData.code === 'INSUFFICIENT_STACKS') {
            errorMsg = `You don't have enough credits to use this feature. Each similar problem generation costs 3 credits. ${errorData.available ? `You currently have ${errorData.available} credits.` : ''} Visit the pricing page to get more credits.`;
          } else {
            errorMsg = errorData.error || errorMsg;
          }
        } catch (e) {
          console.error("Could not parse error response as JSON.", responseText);
        }
        throw new Error(errorMsg);
      }

      const data = JSON.parse(responseText);
      if (data.answer) {
        setSimilarProblem(data.answer);
        setShowSimilarProblem(true);
        
        // Call the callback if provided
        if (options?.onSimilarProblemGenerated) {
          options.onSimilarProblemGenerated(data.answer);
        }
      } else {
        throw new Error('Invalid response format from server.');
      }

    } catch (error: any) {
      console.error("Similar problem generation error:", error);
      const message = error.message || 'An unexpected error occurred.';
      setSimilarProblemError(message);
    } finally {
      setIsGeneratingSimilar(false);
    }
  };

  return {
    generateSimilarProblem,
    isGeneratingSimilar,
    similarProblem,
    similarProblemError,
    showSimilarProblem,
    setShowSimilarProblem,
    setSimilarProblem,
  };
}
