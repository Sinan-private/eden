"use client"

import * as React from "react"

export interface SegmentedBarProps extends Omit<ProgressProps, 'color' | 'value'> {
  thresholds?: HealthProps['thresholds'];
  color?: HealthProps['color'];
  value?: HealthProps['value'];
}

import {Progress, ProgressProps} from "@/components/ui/progress.tsx";
import {HealthCalculation, HealthProps} from "@/components/Constructors/HealthCalculation.ts";

export const SegmentedBar = React.forwardRef<
  React.ElementRef<typeof Progress>,
  SegmentedBarProps
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
    <div className="absolute bg-black/70 h-full w-0.5 top-0" style={{left: position + '%'}} />
  )
}