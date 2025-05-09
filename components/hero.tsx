import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Elevate Your Math Skills with AI-Powered Tools
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl text-purple-200 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Sharpen mental math, tackle custom problem sets, and track your progress—all in one platform.
        </motion.p>
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link href="/signup">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-xl py-6 px-8">
              Try MathStack AI Free
            </Button>
          </Link>
        </motion.div>
      </div>
      <HeroBackground />
    </div>
  )
}

const HeroBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden">
    <svg
      className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="e813992c-7d03-4cc4-a2bd-151760b470a0"
          width="200"
          height="200"
          x="50%"
          y="-1"
          patternUnits="userSpaceOnUse"
        >
          <path d="M100 200V.5M.5 .5H200" fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth="0" fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)" />
    </svg>
  </div>
)

