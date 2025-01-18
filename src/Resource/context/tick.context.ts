import {createContainer} from "unstated-next";
import {useEffect, useState} from "react";

import {MS_TO_TICK, TICK_AUTO_START, TICKS_PER_SECOND} from "../../test_eden/constants/constants.ts";

export type Tick = ReturnType<typeof useTickBase>

const useTickBase = () => {
  const [isActive, setIsActive] = useState(TICK_AUTO_START);
  const [currentTick, setCurrentTick] = useState(0);
  const start = () => setIsActive(true);
  const stop = () => setIsActive(false);
  const currentTurn = Math.floor(currentTick / (1000 / MS_TO_TICK / TICKS_PER_SECOND));

  useEffect(() => {
    let id: ReturnType<typeof setInterval> | null = null;
    // let id: NodeJS.Timeout | null = null;

    if (isActive) {
      id = setInterval(() => {
        setCurrentTick((prev) => {
          return prev + 1;
        });
      }, MS_TO_TICK);
    }

    return () => {
      if (id) clearInterval(id);
    };
  }, [isActive]);

  return {
    start,
    stop,
    isActive,
    currentTick,
    currentTurn,
  };
}


const useTickContainer = createContainer(useTickBase);
export const useTick = useTickContainer.useContainer;
export const TickProvider = useTickContainer.Provider;
