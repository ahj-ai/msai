"use client"

import { Card } from "@/components/ui/card"

interface ProblemDisplayProps {
  problem: {
    question: string
    solution: string
    hints?: string[]
  }
}

export function ProblemDisplay({ problem }: ProblemDisplayProps) {
  // ... component code ...
}

