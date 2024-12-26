import {GameProvider} from "./context/game.context.ts";
import {AdminProvider} from "./Admin";
import {Child} from "./Child.tsx";
import React from "react";

type ResourceProviderProps = {
  children: React.ReactNode;
  initialState?: any;
}

export const ResourceProvider = ({children, initialState}: ResourceProviderProps)=> {

  return (
    <GameProvider initialState={initialState}>
      <AdminProvider>
        <Child>
          {children}
        </Child>
      </AdminProvider>
    </GameProvider>
  )
}