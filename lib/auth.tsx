"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"

interface User {
  id: string
  name: string
  email: string
  // isPremium field removed
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  // Use Clerk's useUser hook to get the current authenticated user
  const { user: clerkUser, isLoaded: clerkIsLoaded } = useUser()

  // Set up user state based on Clerk authentication
  useEffect(() => {
    if (clerkIsLoaded && clerkUser) {
      // User is authenticated with Clerk
      setUser({
        id: clerkUser.id,
        name: clerkUser.firstName || clerkUser.username || clerkUser.emailAddresses[0]?.emailAddress.split('@')[0] || 'User',
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        // Premium status removed
      })
    } else if (clerkIsLoaded && !clerkUser) {
      // User is not authenticated
      setUser(null)
    }
  }, [clerkUser, clerkIsLoaded])

  // These functions are now just placeholders since Clerk handles auth
  // You can use them for additional logic specific to your app
  const login = async (email: string, password: string) => {
    // Clerk handles actual authentication
    console.log('Custom login logic would go here if needed')
    // Actual login is handled by Clerk components
  }

  const logout = () => {
    // Clerk handles logout
    console.log('Custom logout logic would go here if needed')
    // Actual logout is handled by Clerk components
  }

  return <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

