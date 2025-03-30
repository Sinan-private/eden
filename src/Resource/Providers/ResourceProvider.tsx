import React from "react";
import {TickProvider} from "../context/tick.context.ts";

type ResourceProviderProps = {
  children: React.ReactNode;
  // initialState?: any;
}

export const ResourceProvider = ({children}: ResourceProviderProps) => {
  return (
      <TickProvider>
          {children}
      </TickProvider>
  )
}