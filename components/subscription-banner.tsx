"use client";

import { Crown, Zap } from "lucide-react";
import { useSubscription } from "@/hooks/use-subscription";
import { Button } from "./ui/button";
import Link from "next/link";

export function SubscriptionBanner() {
  const { isPro, plan, isLoading } = useSubscription();
  
  if (isLoading) return null;
  
  if (!isPro) return null;
  
  return (
    <div className="relative bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex items-center">
            <span className="flex p-1.5 rounded-lg bg-amber-100 text-amber-600">
              <Crown className="h-5 w-5" />
            </span>
            <p className="ml-3 font-medium text-amber-700 truncate">
              <span className="hidden md:inline">You&apos;re a </span>
              <span className="font-bold">MathStack Pro</span>
              <span className="hidden md:inline"> subscriber</span>
            </p>
          </div>
          <div className="order-3 mt-2 w-full flex-shrink-0 sm:order-2 sm:mt-0 sm:w-auto">
            <Link href="/dashboard/account">
              <Button variant="outline" size="sm" className="border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800">
                Manage Subscription
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
