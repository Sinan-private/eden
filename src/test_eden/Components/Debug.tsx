import React from 'react';
import {DEBUG} from "../../constants/config.ts";

export const Debug = ({children}: { children: React.ReactNode }) => {
  return !DEBUG ? null : (
    <div style={{position: 'relative', zIndex: 5000}}>
    {children}
    </div>
  )
}
