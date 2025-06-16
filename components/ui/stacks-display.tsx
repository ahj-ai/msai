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
    <span
      className="flex items-center gap-2 px-2 py-1"
      title="Your available stacks for premium features"
      style={{ minWidth: 70 }}
    >
      <Zap className="w-4 h-4 text-[#6C63FF]" strokeWidth={2} />
      <span className="text-sm font-semibold bg-gradient-to-r from-[#6C63FF] to-[#5E60CE] bg-clip-text text-transparent">
        Stacks
      </span>
      <span className="ml-1 text-sm font-bold text-[#242740]">
        {isLoading ? (
          <span className="inline-block w-4 h-3 bg-gray-200 rounded animate-pulse" />
        ) : (
          stacks !== null ? stacks : '0'
        )}
      </span>
    </span>
  );
}
