import {GameProvider} from "./context/game.context.ts";
import {AdminProvider} from "./Admin";
import {Child} from "./Child.tsx";
import React from "react";

export const ResourceProvider = ({children}: {children: React.ReactNode})=> {

  return (
    <GameProvider>
      <AdminProvider>
        <Child>
          {children}
        </Child>
      </AdminProvider>
    </GameProvider>
  )
}