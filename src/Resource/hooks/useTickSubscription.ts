import {useTick} from "../context/tick.context.ts";
import {usePrevious} from "./usePrevious.ts";
import {useEffect} from "react";

export type Subscription = (tick: number) => void;

export const useTickSubscription = (subscription: Subscription) => {
  const tick = useTick();
  const {current, isActive} = tick;
  const prevTick = usePrevious(current);

  useEffect(() => {
    if (isActive && prevTick !== current) {
      subscription(current)
    }
  }, [current, isActive, prevTick, subscription]);

  return tick
}
