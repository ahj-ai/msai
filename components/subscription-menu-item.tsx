"use client";

import { Crown } from "lucide-react";
import Link from "next/link";
import { useSubscription } from "@/hooks/use-subscription";
import { Button } from "./ui/button";

export function SubscriptionMenuItem() {
  const { isPro, plan, isLoading } = useSubscription();
  
  if (isLoading) return null;
  
  return (
    <div className="px-2 my-1">
      <Link href="/pricing">
        <Button 
          variant="ghost" 
          size="sm" 
          className={`w-full justify-start gap-2 ${isPro ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50' : 'text-[#6C63FF] hover:text-[#5E60CE] hover:bg-purple-50'}`}
        >
          <Crown className={`h-4 w-4 ${isPro ? 'text-amber-500' : 'text-[#6C63FF]'}`} />
          <span>
            {isPro ? 'Pro Subscription' : 'Upgrade to Pro'}
          </span>
        </Button>
      </Link>
    </div>
  );
}
