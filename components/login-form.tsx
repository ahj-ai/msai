"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"

export const LoginForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      await login(email, password)
      router.push("/dashboard")
    } catch (err) {
      setError("Invalid email or password")
    }
  }

  return (
    <section className="py-24 bg-transparent">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-md mx-auto bg-gray-800 rounded-lg p-8 border border-purple-500/20 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-center mb-2 text-purple-100">Welcome Back</h1>
          <p className="text-center text-gray-300 text-base mb-8">Log in to your MathStack AI account.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-purple-200">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                className="bg-gray-700 border-purple-500/20 text-white"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-purple-200">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                className="bg-gray-700 border-purple-500/20 text-white"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
              Log In
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/forgot-password" className="text-sm text-purple-300 hover:underline">
              Forgot your password?
            </Link>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don’t have an account?{' '}
              <a href="/signup" className="text-purple-300 hover:underline font-semibold">Sign Up</a>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

