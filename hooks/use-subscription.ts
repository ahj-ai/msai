import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import { PlanType } from "@/lib/stripe";

export type SubscriptionStatus = {
  isLoading: boolean;
  isPro: boolean;
  plan: PlanType;
}

// Custom hook to check the user's subscription status
export function useSubscription(): SubscriptionStatus & { refresh: () => Promise<void> } {
  const { userId, isLoaded, isSignedIn } = useAuth();
  const [status, setStatus] = useState<SubscriptionStatus>({
    isLoading: true,
    isPro: false,
    plan: 'free'
  });

  const fetchSubscriptionStatus = useCallback(async () => {
    if (!isLoaded || !isSignedIn || !userId) {
      setStatus(prev => ({
        ...prev, 
        isLoading: false,
        isPro: false,
        plan: 'free'
      }));
      return;
    }
    
    try {
      // Add a timestamp to bust cache
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/stripe/subscription-status?t=${timestamp}`);
      const data = await response.json();
      
      console.log('🔄 Subscription status refreshed:', data);
      
      setStatus({
        isLoading: false,
        isPro: data.isPro,
        plan: data.isPro ? 'pro' : 'free'
      });
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      setStatus(prev => ({...prev, isLoading: false}));
    }
  }, [userId, isLoaded, isSignedIn]);

  // Refresh on mount and whenever userId/auth status changes
  useEffect(() => {
    fetchSubscriptionStatus();
  }, [fetchSubscriptionStatus]);
  
  // Force refresh on visibility change (when user returns to tab)
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        console.log('🔄 Page visible, refreshing subscription status');
        fetchSubscriptionStatus();
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchSubscriptionStatus]);

  return {
    ...status,
    refresh: fetchSubscriptionStatus
  };
}
