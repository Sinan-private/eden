import {useTick} from "../context/tick.context.ts";
import {usePrevious} from "./usePrevious.ts";
import {useEffect} from "react";

export type TickSubscription = (tick: number) => void;

export const useTickSubscription = (subscription?: TickSubscription) => {
  const tick = useTick();
  const {current, isActive} = tick;
  const prevTick = usePrevious(current);

  useEffect(() => {
    if (isActive && prevTick !== current) {
      if (subscription) {
        subscription(current)
      }
    }
  }, [current, isActive, prevTick, subscription]);

  return tick
}
