"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface StripeCheckoutButtonProps {
  priceId: string;
  mode: "payment" | "subscription";
  buttonText: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  disabled?: boolean;
}

export function StripeCheckoutButton({
  priceId,
  mode,
  buttonText,
  className,
  variant = "default",
  disabled = false,
}: StripeCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { userId, isSignedIn } = useAuth();
  const router = useRouter();

  const handleCheckout = async () => {
    if (!isSignedIn) {
      // Redirect to sign in if not signed in
      router.push("/sign-in?redirect=/pricing");
      return;
    }

    try {
      setIsLoading(true);
      console.log('Initiating checkout for:', { priceId, mode });

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          mode,
          successUrl: `${window.location.origin}/checkout/success`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Checkout API error:', response.status, errorText);
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Checkout response:', data);

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Missing checkout URL in response:', data);
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert(`Failed to create checkout session: ${error instanceof Error ? error.message : 'Unknown error'}. Please check that Stripe keys are configured correctly.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      className={className}
      variant={variant}
      disabled={disabled || isLoading}
    >
      {isLoading ? "Loading..." : buttonText}
    </Button>
  );
}
