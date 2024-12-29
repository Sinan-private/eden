import React from "react";
import {useResource} from "./index.ts";

export const Child  = ({children}: {children: React.ReactNode})=> {
  const {isFetching} = useResource();

  return isFetching ? null : children
}