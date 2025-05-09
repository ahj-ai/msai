'use client';

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle } from "lucide-react"

export const SignUpForm = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)

  const checkPasswordStrength = (pass: string) => {
    let strength = 0
    if (pass.length >= 8) strength++
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++
    if (pass.match(/\d/)) strength++
    if (pass.match(/[^a-zA-Z\d]/)) strength++
    setPasswordStrength(strength)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    checkPasswordStrength(newPassword)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically handle the form submission,
    // such as sending the data to your backend API
    console.log("Form submitted:", { username, email, password })
  }

  return (
    <section className="py-24 bg-gradient-to-b from-purple-900/50 to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-md mx-auto bg-gray-800/50 rounded-lg p-8 border border-purple-500/20 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-center mb-2 text-purple-100">Join MathStack AI</h1>
<p className="text-center text-gray-300 text-base mb-8">Create an account to start your math learning journey.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-purple-200">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-700 border-purple-500/20 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-purple-200">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700 border-purple-500/20 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-purple-200">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className="bg-gray-700 border-purple-500/20 text-white"
                required
              />
              <div className="mt-2">
                <PasswordStrengthIndicator strength={passwordStrength} />
              </div>
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-purple-200">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-gray-700 border-purple-500/20 text-white"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={password !== confirmPassword || passwordStrength < 3}
            >
              Try MathStack Free
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <a href="/login" className="text-purple-300 hover:underline font-semibold">Log In</a>
            </p>
          </div>
          <p className="text-center text-sm text-gray-400 mt-4">
            By signing up, you agree to our{' '}
            <a href="/terms" className="text-purple-300 hover:underline">Terms of Service</a>{' '}and{' '}
            <a href="/privacy" className="text-purple-300 hover:underline">Privacy Policy</a>.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

const PasswordStrengthIndicator = ({ strength }: { strength: number }) => {
  const getColor = () => {
    switch (strength) {
      case 0:
        return "bg-red-500"
      case 1:
        return "bg-orange-500"
      case 2:
        return "bg-yellow-500"
      case 3:
        return "bg-green-500"
      case 4:
        return "bg-green-600"
      default:
        return "bg-gray-500"
    }
  }

  const getMessage = () => {
    switch (strength) {
      case 0:
        return "Very Weak"
      case 1:
        return "Weak"
      case 2:
        return "Fair"
      case 3:
        return "Good"
      case 4:
        return "Strong"
      default:
        return ""
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full ${getColor()}`} style={{ width: `${strength * 25}%` }}></div>
      </div>
      <span className="text-sm text-gray-300">{getMessage()}</span>
      {strength >= 3 ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <AlertCircle className="w-4 h-4 text-red-500" />
      )}
    </div>
  )
}

