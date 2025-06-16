import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";
import { PlanType } from "@/lib/stripe";

export type SubscriptionStatus = {
  isLoading: boolean;
  isPro: boolean;
  plan: PlanType;
}

// Custom hook to check the user's subscription status
export function useSubscription(): SubscriptionStatus {
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
      const response = await fetch('/api/stripe/subscription-status');
      const data = await response.json();
      
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

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [fetchSubscriptionStatus]);

  return status;
}
