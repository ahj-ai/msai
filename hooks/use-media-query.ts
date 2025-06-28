'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook for handling media queries
 * @param query The media query string (e.g., '(max-width: 768px)')
 * @returns Boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check for window to ensure this only runs on the client
    if (typeof window === 'undefined') return;

    // Create media query list
    const media = window.matchMedia(query);
    
    // Set initial value
    setMatches(media.matches);

    // Define listener function
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener
    media.addEventListener('change', listener);

    // Cleanup function
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}
