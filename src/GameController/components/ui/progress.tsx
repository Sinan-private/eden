"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import {cn} from "@/lib/utils.ts"
import {barClasses, bgClasses} from "@/GameController/components/ui/constants.ts";

export interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  color?: "green" | "yellow" | "red" | "blue" | "default";
  transition?: number | 'none';
  children?: React.ReactNode;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ children, transition, className, value, color = 'default', ...props }, ref) => {
  const bar_color = barClasses[color]
  const bg_color = bgClasses[color]
  const _transition = transition === 'none'
    ? ''
    : !transition
      ? 'transition-all'
      : `transition-all duration-${transition}`

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-1 w-full overflow-hidden rounded-full bg-primary/20",
        bg_color,
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn("h-full w-full flex-1 bg-primary", bar_color, _transition )}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
      {children}
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
