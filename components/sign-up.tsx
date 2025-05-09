import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export const SignUp = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-purple-900/50 to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-md mx-auto bg-gray-800/50 rounded-lg p-8 border border-purple-500/20 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-purple-200">Join the Math Revolution!</h2>
          <p className="text-center text-gray-300 mb-6">Create your account to start your journey in math mastery.</p>
          <form className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-purple-200">Name</Label>
              <Input id="name" type="text" className="bg-gray-700 border-purple-500/20 text-white" />
            </div>
            <div>
              <Label htmlFor="email" className="text-purple-200">Email</Label>
              <Input id="email" type="email" className="bg-gray-700 border-purple-500/20 text-white" />
            </div>
            <div>
              <Label htmlFor="password" className="text-purple-200">Password</Label>
              <Input id="password" type="password" className="bg-gray-700 border-purple-500/20 text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms" className="text-sm text-gray-300">
                I agree to the terms and conditions
              </Label>
            </div>
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
              Create Account
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">Or sign up with</p>
            <div className="flex justify-center space-x-4 mt-4">
              <Button variant="outline" className="text-purple-300 hover:text-purple-200">
                Google
              </Button>
              <Button variant="outline" className="text-purple-300 hover:text-purple-200">
                GitHub
              </Button>
              <Button variant="outline" className="text-purple-300 hover:text-purple-200">
                Microsoft
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

