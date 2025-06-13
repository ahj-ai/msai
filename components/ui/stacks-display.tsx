'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';

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
    <Link 
      href="/pricing" 
      className="flex items-center gap-2 px-2.5 py-1 rounded-full hover:bg-gray-50 transition-colors group relative"
      title="Your available stacks for premium features (click to get more)"
    >
      <span className="text-sm font-medium bg-gradient-to-r from-[#6C63FF] to-[#5E60CE] bg-clip-text text-transparent">
        Stacks
      </span>
      <div className="h-6 w-7 flex items-center justify-center rounded-full bg-gradient-to-r from-[#6C63FF] to-[#5E60CE] text-white font-medium text-xs">
        {isLoading ? (
          <div className="h-3 w-4 bg-white/30 rounded-sm animate-pulse" />
        ) : (
          stacks !== null ? stacks : '0'
        )}
      </div>
    </Link>
  );
}
