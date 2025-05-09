"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  isPremium: boolean
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

  useEffect(() => {
    // Check if user is logged in (e.g., by checking for a token in localStorage)
    const token = localStorage.getItem("authToken")
    if (token) {
      // In a real application, you would validate the token and fetch user data from your API
      // For this example, we'll just set some mock user data
      setUser({
        id: "1",
        name: "Alex",
        email: "alex@example.com",
        isPremium: token === "premium_token",
      })
    }
  }, [])

  const login = async (email: string, password: string) => {
    // Implement your login logic here
    // For this example, we'll just set a token in localStorage and some mock user data
    localStorage.setItem("authToken", "user_token")
    setUser({
      id: "1",
      name: "Alex",
      email: email,
      isPremium: false,
    })
  }

  const logout = () => {
    localStorage.removeItem("authToken")
    setUser(null)
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

