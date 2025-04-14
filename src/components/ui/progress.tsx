"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

export interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  color?: "green" | "yellow" | "red" | "blue" | "default";
  children?: React.ReactNode;
}

import { cn } from "@/lib/utils"

const barClasses = {
  green: "bg-emerald-600",
  yellow: "bg-amber-500",
  red: "bg-rose-600",
  blue: "bg-sky-500",
  default: "bg-gray-50",
};

const bgClasses = {
  green: "bg-emerald-950",
  yellow: "bg-amber-950",
  red: "bg-rose-950",
  blue: "bg-sky-950",
  default: "bg-primary/20",
};

export const PROGRESS_COLORS = {
  bar: barClasses,
  background: bgClasses,
}


const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ children, className, value, color = 'default', ...props }, ref) => {
  const bar_color = barClasses[color]
  const bg_color = bgClasses[color]

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        bg_color,
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn("h-full w-full flex-1 bg-primary transition-all", bar_color)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
      {children}
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
