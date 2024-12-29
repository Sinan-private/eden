import {GameProvider} from "../context/game.context.ts";
import {Child} from "../Child.tsx";
import React from "react";
import {TickProvider} from "../context/tick.context.ts";

type ResourceProviderProps = {
  children: React.ReactNode;
  initialState?: any;
}

export const ResourceProvider = ({children, initialState}: ResourceProviderProps) => {

  return (
    <GameProvider initialState={initialState}>
      <TickProvider>
        <Child>
          {children}
        </Child>
      </TickProvider>
    </GameProvider>
  )
}