import React from "react";
import {useResource} from "./context/resource.context.ts";

export const Child  = ({children}: {children: React.ReactNode})=> {
  const {isFetching} = useResource();

  return isFetching ? null : children
}