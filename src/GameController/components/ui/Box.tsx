import {cva, type VariantProps} from "class-variance-authority";
import * as React from "react";
import {cn} from "@/lib/utils.ts";

const boxVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-slate-700 border-2 p-2 bg-slate-900/60 rounded-[8px]",
        // secondary:
        //   "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // destructive:
        //   "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "border-slate-700 border-2 p-2 rounded-[8px]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BoxProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof boxVariants> {}

export const Box = ({ className, variant, ...props }: BoxProps) =>  {
  return (
    <div className={cn(boxVariants({ variant }), className, "pointer-events-auto")} {...props} />
  )
}

// Todo -> You have to move
export const Container = ({children, className}: {children: React.ReactNode; className?: React.HTMLAttributes<HTMLDivElement>}) => (
  <div className={cn("flex gap-2 font-mono text-[12px] text-teal-200", className)}>
    {children}
  </div>
)