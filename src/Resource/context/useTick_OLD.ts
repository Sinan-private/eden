import {useEffect, useMemo, useState} from "react";
import {MS_TO_TICK, TICK_AUTO_START} from "../../constants/config.ts";
import {ResourceStoreClass} from "../ResourceHandler/specificTypes.ts";

type Subscriber = (resources: ResourceStoreClass) => void;

// Todo this needs to be excluded and become its own part.
//  And fuck it, I am not a better developer so I just do it by listening to the tick count.
//  Maybe at least I find some way to capsule that.

export const useTick_OLD = (resources: ResourceStoreClass) => {
  const memoizedResources = useMemo(() => resources, [resources]);
  const [isActive, setIsActive] = useState(TICK_AUTO_START);
  const [current, setCurrent] = useState(0);
  const start = () => setIsActive(true);
  const stop = () => setIsActive(false);
  const subscribers = useMemo(() => new Set<Subscriber>(), []); // Hold subscribers
  const mana = memoizedResources?.get('liquid_mana_level_1');
  mana && console.log('liquid_mana_level_1', mana.id + '_' + mana.value)

  useEffect(() => {
    let id: any = null;
    // let id: NodeJS.Timeout | null = null;

    if (isActive) {
      id = setInterval(() => {
        setCurrent((prev) => {
          const newTick = prev + 1;
          subscribers.forEach((callback) => callback(memoizedResources)); // Notify subscribers
          return newTick;
        });
      }, MS_TO_TICK);
    }

    return () => {
      if (id) clearInterval(id);
    };
  }, [isActive, subscribers]);

  useEffect(() => {
    console.log("useEffect triggered. isActive:", isActive);
    return () => console.log("Cleanup executed");
  }, [isActive]);


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
