import React from "react";
import {useGame} from "./context/game.context.ts";

export const Child  = ({children}: {children: React.ReactNode})=> {
  const {isFetching} = useGame();

  return isFetching ? null : children
}