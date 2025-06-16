"use client";

import { Crown } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const proBadgeVariants = cva(
  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium gap-1",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-[#6C63FF] to-[#5E60CE] text-white",
        muted: "bg-amber-100 text-amber-800",
        outline: "bg-transparent border border-amber-500 text-amber-700"
      },
      size: {
        default: "h-6",
        sm: "h-5 text-[10px]",
        lg: "h-7"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

interface ProBadgeProps extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof proBadgeVariants> {
  showIcon?: boolean;
  showLabel?: boolean;
  label?: string;
}

export function ProBadge({
  className,
  variant,
  size,
  showIcon = true,
  showLabel = true,
  label = "PRO",
  ...props
}: ProBadgeProps) {
  return (
    <div className={cn(proBadgeVariants({ variant, size }), className)} {...props}>
      {showIcon && <Crown className="h-3 w-3" />}
      {showLabel && <span>{label}</span>}
    </div>
  );
}
