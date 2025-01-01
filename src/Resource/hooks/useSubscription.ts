import {useTick} from "../context/tick.context.ts";
import {usePrevious} from "./usePrevious.ts";
import {useEffect, useMemo} from "react";

export type TickSubscription = (tick: number) => void;

export const useTurnSubscription = (subscription: TickSubscription = () => {}) => {
  return useBaseTickSubscription(subscription, false)
}

export const useAnimationSubscription = (subscription: TickSubscription = () => {}) => {
  return useBaseTickSubscription(subscription, true)
}


const useBaseTickSubscription = (subscription: TickSubscription, isAnimation: boolean) => {
  const tick = useTick();
  const {currentTick, isActive, currentTurn} = tick;
  const prevTick = usePrevious(currentTick);
  const prevTurn = usePrevious(currentTurn);
  const updateTick = useMemo(() =>!isAnimation
    ? isActive && prevTurn !== currentTurn
    : isActive && prevTick !== currentTick,
    [currentTick, currentTurn, isActive, isAnimation, prevTick, prevTurn])

  useEffect(() => {
    if (updateTick) {
      if (subscription) {
        subscription(currentTick)
      }
    }
  }, [currentTick, isActive, prevTick, subscription, updateTick]);

  return tick
}
