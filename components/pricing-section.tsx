export function PricingSection() {
  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-12">Unlock the Power of AI with Premium</h2>
      
      {/* Feature Comparison Table */}
      <div className="w-full mb-12 bg-gray-900/50 rounded-lg p-6">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="font-semibold">Feature</div>
          <div className="font-semibold text-center">Free Version</div>
          <div className="font-semibold text-center">Premium Version</div>
        </div>

        {/* Feature Rows */}
        {[
          { name: "Mental Math Game", free: true, premium: true },
          { name: "Custom Problem Sets", free: true, premium: true },
          { name: "Personalized Insights", free: false, premium: true },
          { name: "Leaderboards & Badges", free: false, premium: true },
          { name: "AI-Generated Features", free: false, premium: true },
        ].map((feature) => (
          <div key={feature.name} className="grid grid-cols-3 gap-4 py-4 border-t border-gray-700">
            <div>{feature.name}</div>
            <div className="text-center">
              {feature.free ? (
                <span className="text-green-500">✓</span>
              ) : (
                <span className="text-red-500">✕</span>
              )}
            </div>
            <div className="text-center">
              {feature.premium ? (
                <span className="text-green-500">✓</span>
              ) : (
                <span className="text-red-500">✕</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Plans */}
      <div className="grid grid-cols-2 gap-x-16 mb-8">
        {/* Monthly Plan Column */}
        <div className="flex flex-col items-center">
          <h3 className="text-xl mb-4">Monthly Plan</h3>
          <div className="text-4xl font-bold">
            $11.99<span className="text-lg text-gray-400">/month</span>
          </div>
        </div>

        {/* Annual Plan Column */}
        <div className="flex flex-col items-center">
          <h3 className="text-xl mb-4">Annual Plan</h3>
          <div className="text-4xl font-bold">
            $120<span className="text-lg text-gray-400">/year</span>
          </div>
          <div className="text-green-500 mt-2">Save 16% with yearly subscription</div>
        </div>
      </div>

      {/* Centered CTA Button */}
      <button className="bg-purple-500 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-purple-600 transition-colors">
        Get Started
      </button>
    </div>
  )
} 