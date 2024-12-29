import {useEffect, useMemo, useState} from "react";
import {MS_TO_TICK, TICK_AUTO_START} from "../constants/config.ts";

type Subscriber = (tick: number) => void;

export const useTick = () => {
  const [isActive, setIsActive] = useState(TICK_AUTO_START);
  const [current, setCurrent] = useState(0);
  const subscribers = useMemo(() =>new Set<Subscriber>(), []); // Hold subscribers

  useEffect(() => {
    let id: any = null;
    // let id: NodeJS.Timeout | null = null;

    if (isActive) {
      id = setInterval(() => {
        setCurrent((prev) => {
          const newTick = prev + 1;
          subscribers.forEach((callback) => callback(newTick)); // Notify subscribers
          return newTick;
        });
      }, MS_TO_TICK);
    }

    return () => {
      if (id) clearInterval(id);
    };
  }, [isActive, subscribers]);

  const start = () => setIsActive(true);
  const stop = () => setIsActive(false);
  // console.log(subscribers)

  const subscribe = (callback: Subscriber) => {
    subscribers.add(callback);
    return () => subscribers.delete(callback); // Unsubscribe when called
  };

  return {
    start,
    stop,
    isActive,
    current,
    subscribe, // Expose subscription mechanism
  };
};
