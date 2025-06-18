"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

// Loading component to show while suspended
function CheckoutSuccessLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-off-white">
      <div className="w-full max-w-3xl text-center px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Loading...</h1>
        <p className="mt-4 text-base text-gray-500">Verifying your purchase...</p>
      </div>
    </div>
  );
}

// Create a client component that uses the searchParams
function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchaseType, setPurchaseType] = useState<'subscription' | 'stacks' | null>(null);
  const [stackAmount, setStackAmount] = useState<number | null>(null);

  useEffect(() => {
    // Get the session ID from URL parameters
    const sessionIdParam = searchParams?.get("session_id");
    const purchaseTypeParam = searchParams?.get("type");
    const stackAmountParam = searchParams?.get("stacks");
    
    // Set purchase type from URL or default to subscription
    if (purchaseTypeParam === 'stacks' || stackAmountParam) {
      setPurchaseType('stacks');
      if (stackAmountParam) {
        setStackAmount(parseInt(stackAmountParam));
      }
    } else {
      setPurchaseType('subscription');
    }
    
    if (sessionIdParam) {
      setSessionId(sessionIdParam);
      
      // Optional: Verify the session with your API
      // This helps ensure the purchase was properly recorded
      const verifySession = async () => {
        try {
          const response = await fetch(`/api/stripe/verify-session?session_id=${sessionIdParam}`);
          const data = await response.json();
          
          if (!data.valid) {
            console.error("Invalid or expired session");
          }
        } catch (error) {
          console.error("Error verifying session:", error);
        } finally {
          setLoading(false);
        }
      };
      
      verifySession();
    } else {
      setLoading(false);
    }
  }, [searchParams, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-off-white">
      <div className="w-full max-w-3xl text-center px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {purchaseType === 'subscription' ? 
            <span className="bg-gradient-to-r from-[#6C63FF] to-[#5E60CE] bg-clip-text text-transparent">
              Thank you for your subscription!
            </span> : 
            'Stack Pack purchased successfully!'}
        </h1>
        
        <p className="mt-4 text-base text-gray-500">
          {purchaseType === 'subscription' ? (
            'Your subscription to MathStack Pro has been successfully activated. You now have full access to all premium features.'
          ) : (
            `${stackAmount || '75'} stacks have been added to your account. You can use these stacks to solve more problems on MathStack AI.`
          )}
        </p>
        
        <div className="mt-10">
          {loading ? (
            <p className="text-sm text-gray-500">Verifying your subscription...</p>
          ) : (
            <div className="flex justify-center">
              <Button asChild className="bg-gradient-to-r from-[#6C63FF] to-[#5E60CE]">
                <Link href="/dashboard">
                  Go to Dashboard
                </Link>
              </Button>
            </div>
          )}
          
          {sessionId && (
            <p className="mt-4 text-xs text-gray-400">
              Session ID: {sessionId}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Export a component that wraps the content in a Suspense boundary
export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<CheckoutSuccessLoading />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
