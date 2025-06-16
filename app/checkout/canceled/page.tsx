"use client";

import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function CheckoutCanceledPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-off-white">
      <div className="w-full max-w-3xl text-center px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <XCircle className="h-6 w-6 text-red-600" />
        </div>
        
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Subscription Canceled
        </h1>
        
        <p className="mt-4 text-base text-gray-500">
          Your subscription process was canceled. No charges have been made to your account.
        </p>
        
        <div className="mt-10 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 justify-center">
          <Button asChild>
            <Link href="/pricing">
              Return to Pricing
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link href="/">
              Go to Homepage
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
