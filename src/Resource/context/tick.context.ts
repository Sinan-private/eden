import {createContainer} from "unstated-next";
import {useEffect, useState} from "react";
import {MS_TO_TICK, TICK_AUTO_START} from "../../constants/config.ts";

const useTickBase = () => {
  const [isActive, setIsActive] = useState(TICK_AUTO_START);
  const [current, setCurrent] = useState(0);
  const start = () => setIsActive(true);
  const stop = () => setIsActive(false);

  useEffect(() => {
    let id: ReturnType<typeof setInterval> | null = null;
    // let id: NodeJS.Timeout | null = null;

    if (isActive) {
      id = setInterval(() => {
        setCurrent((prev) => {
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
    current,
  };
}


const useTickContainer = createContainer(useTickBase);
export const useTick = useTickContainer.useContainer;
export const TickProvider = useTickContainer.Provider;
