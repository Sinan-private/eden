"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  color?: "success" | "error" | "warning" | "info" | "default";
}

import { cn } from "@/lib/utils"

const barClasses = {
  success: "bg-green-500",
  error: "bg-red-500",
  warning: "bg-yellow-500",
  info: "bg-blue-500",
  default: "bg-gray-50",
};

const bgClasses = {
  success: "bg-green-950",
  error: "bg-red-950",
  warning: "bg-yellow-950",
  info: "bg-blue-950",
  default: "bg-primary/20",
};


const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, color = 'default', ...props }, ref) => {
  console.log(color)
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
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
