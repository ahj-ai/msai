"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VerifyResult {
  success: boolean;
  mode?: "payment" | "subscription";
  message?: string;
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    
    if (!sessionId) {
      setError("No session ID provided");
      setIsLoading(false);
      return;
    }

    // Verify the checkout session
    const verifyCheckout = async () => {
      try {
        const response = await fetch(`/api/checkout/verify?session_id=${sessionId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to verify payment");
        }
        
        const result = await response.json();
        setVerifyResult(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    verifyCheckout();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <Loader2 className="h-12 w-12 animate-spin text-purple-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Verifying your payment...</h1>
        <p className="text-gray-600 text-center max-w-md">
          Please wait while we verify your payment with Stripe.
        </p>
      </div>
    );
  }

  if (error || !verifyResult?.success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="rounded-full bg-red-100 p-3 mb-4">
          <svg
            className="h-6 w-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Payment Verification Failed</h1>
        <p className="text-gray-600 text-center max-w-md mb-6">
          {error || verifyResult?.message || "There was an issue verifying your payment."}
        </p>
        <div className="flex space-x-4">
          <Button asChild variant="outline">
            <Link href="/pricing">Return to Pricing</Link>
          </Button>
          <Button asChild className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div className="rounded-full bg-green-100 p-3 mb-4">
        <Check className="h-6 w-6 text-green-500" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
      <p className="text-gray-600 text-center max-w-md mb-8">
        {verifyResult.mode === "subscription"
          ? "Thank you for subscribing to MathStackAI Pro! Your subscription has been activated."
          : "Thank you for your purchase! Your stack pack has been added to your account."}
      </p>
      <div className="flex space-x-4">
        <Button asChild className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
