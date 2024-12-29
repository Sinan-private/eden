import React from "react";
import {ResourceRawProvider} from "../context/resource.context.ts";
import {TickProvider} from "../context/tick.context.ts";
import {Child} from "../Child.tsx";

type ResourceProviderProps = {
  children: React.ReactNode;
  // initialState?: any;
}

export const ResourceProvider = ({children}: ResourceProviderProps) => {

  return (
    <ResourceRawProvider>
      <TickProvider>
        <Child>
          {children}
        </Child>
      </TickProvider>
    </ResourceRawProvider>
  )
}