import {useRef, useState, MutableRefObject, useEffect} from "react";
import {createContainer} from "unstated-next";
import {useTick} from "./useTick.ts";
import {useApi} from "./useApi.ts";
import {useComponentMount, usePrevious} from "../Resource/hooks";
import {ResourceStore, ResourceStoreClass} from "../Resource";
import {resourceTurnUpdate} from "../gameRules/getResourceTurnUpdate.ts";

const useGameBase = () => {
  const resourceRef = useRef<ResourceStoreClass | null>(null) as MutableRefObject<ResourceStoreClass | null>;
  const resources = resourceRef.current as ResourceStoreClass;
  // This is only needed to avoid a side refresh after every change
  const {fetchResources} = useApi();
  const [isFetching, setIsFetching] = useState(true);
  const tick = useTick();
  const prevTick = usePrevious(tick.current);

  const subscribeToTick = (callback: (tick: number) => void) => {
    return tick.subscribe(callback); // Directly use useTick's subscription mechanism
  };
  useComponentMount(async () => {
    const rawState = await fetchResources();
    resourceRef.current = new ResourceStore(rawState);
    setIsFetching(false);
  })

  useEffect(() => {
    const nextTick = tick.isActive && tick.current && tick.current !== prevTick;
    if (nextTick) {
      resourceTurnUpdate(resources)
    }
  }, [prevTick, resources, tick]);


  return {
    resources,
    isFetching,
    tick,
    subscribeToTick,
  };
}


const useGameContainer = createContainer(useGameBase);
export const useGame = useGameContainer.useContainer;
export const GameProvider = useGameContainer.Provider;
