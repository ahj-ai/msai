"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
    variant?: 'default' | 'primary' | 'secondary';
  }
>(({ className, variant = 'default', ...props }, ref) => {
  const variantClasses = {
    default: 'bg-primary/20',
    primary: 'bg-gradient-to-r from-indigo-500/30 to-purple-500/30',
    secondary: 'bg-slate-200/80',
  };

  const rangeClasses = {
    default: 'bg-gradient-to-r from-indigo-500 to-purple-500',
    primary: 'bg-gradient-to-r from-indigo-500 to-purple-500',
    secondary: 'bg-gradient-to-r from-slate-600 to-slate-800',
  };

  const thumbClasses = {
    default: 'border-indigo-500 bg-white hover:bg-indigo-50',
    primary: 'border-indigo-600 bg-white hover:bg-indigo-50 shadow-md',
    secondary: 'border-slate-600 bg-white hover:bg-slate-50',
  };

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center group",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className={`relative h-2.5 w-full grow overflow-hidden rounded-full ${variantClasses[variant]}`}>
        <SliderPrimitive.Range className={`absolute h-full ${rangeClasses[variant]} transition-all duration-200`} />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb 
        className={`block h-5 w-5 rounded-full border-2 ${thumbClasses[variant]} shadow-lg transition-all duration-200 
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 
                  disabled:pointer-events-none disabled:opacity-50`} 
      />
    </SliderPrimitive.Root>
  );
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
