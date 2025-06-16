"use client"

import { useSubscription } from "@/hooks/use-subscription"
import { Badge } from "./ui/badge"
import { Star } from "lucide-react"

interface ProBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ProBadge = ({ className = '', size = 'md' }: ProBadgeProps) => {
  const { isPro, isLoading } = useSubscription();
  
  if (isLoading || !isPro) return null;
  
  const sizeClasses = {
    sm: "text-xs py-0.5 px-1.5",
    md: "text-sm py-1 px-2",
    lg: "text-base py-1 px-3"
  };
  
  return (
    <Badge 
      className={`
        bg-gradient-to-r from-amber-500 to-purple-600 
        text-white font-semibold 
        flex items-center gap-1
        border-0
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <Star className="w-3 h-3" />
      PRO
    </Badge>
  )
}
