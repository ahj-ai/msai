import { PricingContent } from "@/components/pricing-content"
import { Suspense } from "react"

// Simple loading component
function PricingLoading() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Loading pricing options...</h2>
        <p className="text-gray-500">Please wait while we prepare our pricing details.</p>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={<PricingLoading />}>
      <PricingContent />
    </Suspense>
  );
}
