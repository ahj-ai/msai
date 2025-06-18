'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Zap } from 'lucide-react';

export function StacksDisplay() {
  const { isLoaded: userLoaded, userId, getToken } = useAuth();
  const [stacks, setStacks] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userLoaded || !userId) {
      setIsLoading(false);
      return;
    }
    
    const fetchStacks = async () => {
      try {
        const token = await getToken();
        const response = await fetch('/api/user/stacks', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStacks(data.stacks);
        }
      } catch (error) {
        console.error('Error fetching stacks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStacks();
  }, [userLoaded, userId, getToken]);

  if (!userId) return null;

  return (
    <div
      className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm min-w-0"
      title="Your available stacks for premium features"
    >
      <Zap className="w-4 h-4 text-[#6C63FF] flex-shrink-0" strokeWidth={2} />
      <span className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#6C63FF] to-[#5E60CE] bg-clip-text text-transparent whitespace-nowrap">
        Stacks
      </span>
      <span className="text-xs sm:text-sm font-bold text-[#242740] min-w-[20px] text-center">
        {isLoading ? (
          <span className="inline-block w-4 h-3 bg-gray-200 rounded animate-pulse" />
        ) : (
          stacks !== null ? stacks : '0'
        )}
      </span>
    </div>
  );
}
