"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, FlaskRoundIcon as Flask, Trophy, Star, Zap, Lock } from "lucide-react"
import { useAuth } from "@/lib/auth"

// Mock user stats - in a real application, you would fetch this from your API
const mockUserStats = {
  streak: 5,
  totalProblems: 100,
  correctProblems: 75,
  lastLogin: "2023-07-01",
}

export function Dashboard() {
  const { user } = useAuth()
  const [userStats, setUserStats] = useState(mockUserStats)

  useEffect(() => {
    // Fetch user stats here
    // setUserStats(fetchedUserStats)
  }, [])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-4xl font-bold mb-8 text-purple-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Welcome back, {user.name}!
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <QuickAccessCard
          title="Brainiac Challenge"
          icon={Brain}
          description="Sharpen your mental math skills"
          linkHref="/brainiac"
          linkText="Start Challenge"
        />
        <QuickAccessCard
          title="Problem Lab"
          icon={Flask}
          description={user.isPremium ? "Explore AI-generated problems" : "Solve curated problem sets"}
          linkHref="/problem-lab"
          linkText="Enter Lab"
          isPremiumLocked={!user.isPremium}
        />
        <StatisticsCard userStats={userStats} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <DailyChallenge />
        <Achievements userStats={userStats} />
      </div>

      {!user.isPremium && <PremiumUpsell />}
    </div>
  )
}

function QuickAccessCard({ title, icon: Icon, description, linkHref, linkText, isPremiumLocked = false }) {
  return (
    <Card className="bg-gray-800/50 border-purple-500/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-2xl font-bold text-purple-200">{title}</CardTitle>
        <Icon className="w-8 h-8 text-purple-400" />
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 mb-4">{description}</p>
        <Link href={linkHref}>
          <Button className="w-full bg-purple-600 hover:bg-purple-700">
            {linkText}
            {isPremiumLocked && <Lock className="w-4 h-4 ml-2" />}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

function StatisticsCard({ userStats }) {
  const accuracy = ((userStats.correctProblems / userStats.totalProblems) * 100).toFixed(1)

  return (
    <Card className="bg-gray-800/50 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-purple-200">Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-purple-200">Accuracy</span>
            <span className="text-purple-300">{accuracy}%</span>
          </div>
          <Progress value={Number.parseFloat(accuracy)} className="h-2" />
        </div>
        <div className="flex justify-between">
          <span className="text-purple-200">Problems Solved</span>
          <span className="text-purple-300">{userStats.totalProblems}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-purple-200">Current Streak</span>
          <span className="text-purple-300">{userStats.streak} days</span>
        </div>
      </CardContent>
    </Card>
  )
}

function DailyChallenge() {
  return (
    <Card className="bg-gray-800/50 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-purple-200">Daily Challenge</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 mb-4">Solve today's challenge to earn bonus points!</p>
        <Link href="/daily-challenge">
          <Button className="w-full bg-purple-600 hover:bg-purple-700">Start Challenge</Button>
        </Link>
      </CardContent>
    </Card>
  )
}

function Achievements({ userStats }) {
  const achievements = [
    { name: "Problem Solver", icon: Zap, earned: true },
    { name: "Streak Master", icon: Star, earned: userStats.streak >= 5 },
    { name: "Accuracy Ace", icon: Trophy, earned: userStats.correctProblems / userStats.totalProblems >= 0.9 },
  ]

  return (
    <Card className="bg-gray-800/50 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-purple-200">Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around">
          {achievements.map((achievement, index) => (
            <div key={index} className="text-center">
              <achievement.icon
                className={`w-12 h-12 mx-auto mb-2 ${achievement.earned ? "text-yellow-400" : "text-gray-600"}`}
              />
              <p className={`text-sm ${achievement.earned ? "text-purple-200" : "text-gray-500"}`}>
                {achievement.name}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function PremiumUpsell() {
  return (
    <Card className="bg-gradient-to-r from-purple-900 to-indigo-900 border-purple-500/20">
      <CardContent className="p-6">
        <h3 className="text-2xl font-bold text-purple-200 mb-4">Upgrade to Premium</h3>
        <p className="text-gray-300 mb-4">Get full access to Problem Lab and unlock AI-generated problems!</p>
        <Link href="/pricing">
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900">Upgrade Now</Button>
        </Link>
      </CardContent>
    </Card>
  )
}

