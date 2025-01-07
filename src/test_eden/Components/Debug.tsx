import React from 'react';
import {DEBUG} from "../../constants/config.ts";

export const Debug = ({children}: { children: React.ReactNode }) => {
  return !DEBUG ? null : (
    <div style={{zIndex: 5000, pointerEvents: 'initial'}}>
    {children}
    </div>
  )
}
