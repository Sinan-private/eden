import React from 'react';
import {DEBUG} from "../../constants/config.ts";

export const Debug = ({children}: { children: React.ReactNode }) => {
  return !DEBUG ? null : children
}
