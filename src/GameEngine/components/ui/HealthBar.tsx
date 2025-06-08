"use client"

import * as React from "react"

export interface HealthBarProps extends Omit<ProgressProps, 'color' | 'value'> {
  thresholds?: HealthProps['thresholds'];
  color?: HealthProps['color'];
  value?: HealthProps['value'];
  children?: React.ReactNode;
}

import {Progress, ProgressProps} from "@/GameEngine/components/ui/progress.tsx";
import {HealthCalculation, HealthProps} from "@/GameEngine/components/Constructors/HealthCalculation.ts";

export const HealthBar = React.forwardRef<
  React.ElementRef<typeof Progress>,
  HealthBarProps
>(({ children, className, value, thresholds, color = 'default', ...props }, ref) => {
  const status = new HealthCalculation({thresholds, color, value})
  return (
    <Progress
      ref={ref}
      className={className}
      value={status.value}
      color={status.color}
      {...props}
    >
      {children}
      {status.thresholds.map((threshold) => (
        <Segment key={threshold} position={threshold} />
      ))}
    </Progress>
  )
})
const Segment = ({position}: {position: number}) => {
  return (
    <div className="absolute bg-black/70 h-full w-0.5 top-0 z-10" style={{left: position + '%'}} />
  )
}