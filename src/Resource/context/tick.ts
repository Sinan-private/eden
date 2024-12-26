import {useEffect, useState} from "react";
import {MS_TO_TICK, TICK_AUTO_START} from "../../constants/config.ts";

export const useTick = () => {
  const [isActive, setIsActive] = useState(TICK_AUTO_START);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let id: any;
    if (isActive) {
      id = setInterval(() => {
        setCurrent(current + 1);
      }, MS_TO_TICK);
    }

    return () => clearInterval(id);
  }, [isActive, current]);

  const startGlobalTick = () => {
    if (!isActive) {
      setIsActive(true);
    }
  }

  const pauseGlobalTick = () => {
    if (isActive) {
      setIsActive(false);
    }
  }

  return {
    start: startGlobalTick,
    stop: pauseGlobalTick,
    isActive,
    current,
  }
}