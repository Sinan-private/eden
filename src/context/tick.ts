import {useEffect, useState} from "react";
import {MS_TO_TICK, TICK_AUTO_START} from "../constants/config.ts";

export const useTick = () => {
  const [isTicking, setIsTicking] = useState(TICK_AUTO_START);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let id: any;
    if (isTicking) {
      id = setInterval(() => {
        setCurrent(current + 1);
      }, MS_TO_TICK);
    }

    return () => clearInterval(id);
  }, [isTicking, current]);

  const startGlobalTick = () => {
    if (!isTicking) {
      setIsTicking(true);
    }
  }

  const pauseGlobalTick = () => {
    if (isTicking) {
      setIsTicking(false);
    }
  }

  return {
    startGlobalTick,
    pauseGlobalTick,
    isTicking,
    current,
  }
}