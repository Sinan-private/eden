"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

export interface HealthBarProps extends Omit<ProgressProps, 'color' | 'value'> {
  thresholds?: HealthProps['thresholds'];
  color?: HealthProps['color'];
  value?: HealthProps['value'];
}

import {Progress, ProgressProps} from "@/components/ui/progress.tsx";
import {HealthCalculation, HealthProps} from "@/components/Constructors/HealthCalculation.ts";

export const HealthBar = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  HealthBarProps
>(({ className, value, thresholds, color = 'default', ...props }, ref) => {
  const status = new HealthCalculation({thresholds, color, value})
  return (
    <Progress
      ref={ref}
      className={className}
      value={status.value}
      color={status.color}
      {...props}
    >
      {status.thresholds.map((threshold) => (
        <Segment key={threshold} position={threshold} />
      ))}
    </Progress>
  )
})
const Segment = ({position}: {position: number}) => {
  return (
    <div className="absolute bg-black h-full w-0.5 top-0" style={{left: position + '%'}} />
  )
}