"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress";
import {Progress} from "@/Game/components/ui/progress.tsx";
import {HealthCalculation} from "@/Game/components/Constructors/HealthCalculation.ts";
import {HealthBar, HealthBarProps} from "@/Game/components/ui/HealthBar.tsx";
import {barClasses} from "@/Game/components/ui/constants.ts";
import {cn} from "@/lib/utils.ts";

export const SegmentedBar = React.forwardRef<
  React.ElementRef<typeof Progress>,
  HealthBarProps
>(({ className, value, thresholds, color = 'default', ...props }, ref) => {
  const status = new HealthCalculation({thresholds, color, value})
  const bar_color = barClasses[status.color!]
  return (
    <HealthBar
      ref={ref}
      className={className}
      value={status.achieved_thresholds.value}
      color={status.color}
      thresholds={status.thresholds}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn("opacity-30 absolute left-0 top-0 h-full w-full flex-1 transition-all bg-gray-50/30", bar_color)}
        color={status.color}
        style={{ transform: `translateX(-${100 - (status.value || 0)}%)` }}
      />
    </HealthBar>
  )
})
