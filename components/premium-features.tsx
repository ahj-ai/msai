import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import Link from "next/link"

export const PremiumFeatures = () => {
  const features = [
    { name: "Mental Math Game", free: true, premium: true },
    { name: "Custom Problem Sets", free: true, premium: true },
    { name: "Personalized Insights", free: false, premium: true },
    { name: "Leaderboards & Badges", free: false, premium: true },
    { name: "AI-Generated Features", free: false, premium: true },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-gray-900 to-purple-900/50">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center mb-12 text-purple-200"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Unlock the Power of AI with Premium
        </motion.h2>
        <div className="overflow-x-auto mb-12">
          <table className="w-full max-w-3xl mx-auto">
            <thead>
              <tr className="border-b border-purple-500/20">
                <th className="py-4 px-6 text-left text-purple-300">Feature</th>
                <th className="py-4 px-6 text-center text-purple-300">Free Version</th>
                <th className="py-4 px-6 text-center text-purple-300">Premium Version</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <motion.tr
                  key={index}
                  className="border-b border-purple-500/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <td className="py-4 px-6 text-purple-200">{feature.name}</td>
                  <td className="py-4 px-6 text-center">
                    {feature.free ? (
                      <Check className="inline-block text-green-400" />
                    ) : (
                      <X className="inline-block text-red-400" />
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {feature.premium ? (
                      <Check className="inline-block text-green-400" />
                    ) : (
                      <X className="inline-block text-red-400" />
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="max-w-3xl mx-auto bg-gray-800/50 rounded-lg p-8 border border-purple-500/20">
          <h3 className="text-2xl font-bold text-center mb-6 text-purple-200">Premium Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="text-center">
              <h4 className="text-xl font-semibold text-purple-300 mb-2">Monthly Plan</h4>
              <p className="text-3xl font-bold text-white mb-4">
                $11.99<span className="text-sm text-gray-400">/month</span>
              </p>
            </div>
            <div className="text-center">
              <h4 className="text-xl font-semibold text-purple-300 mb-2">Annual Plan</h4>
              <p className="text-3xl font-bold text-white mb-4">
                $120<span className="text-sm text-gray-400">/year</span>
              </p>
              <p className="text-green-400 text-sm mb-4">Save 16% with yearly subscription</p>
            </div>
          </div>
          <div className="text-center">
            <Link href="/signup">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

