import * as React from "react";
import {cn} from "@/lib/utils.ts";

export const Container = ({children, className}: {
  children: React.ReactNode;
  className?: React.HTMLAttributes<HTMLDivElement>
}) => (
  <div className={cn("flex gap-2 font-mono text-[12px] text-teal-200", className)}>
    {children}
  </div>
)