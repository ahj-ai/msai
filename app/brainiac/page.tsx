"use client"

import dynamic from "next/dynamic"

const MathGame = dynamic(() => import("@/components/math-game"), { ssr: false })

export default function BrainiacPage() {
  return <MathGame />
}