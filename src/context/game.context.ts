import {useRef, useState, MutableRefObject, useEffect} from "react";
import {createContainer} from "unstated-next";
import {useTick} from "./tick.ts";
import {useApi} from "./useApi.ts";
import {useComponentMount, usePrevious} from "../ResourceHandling/hooks";
import {ResourceStore, ResourceStoreClass} from "../ResourceHandling";
import {resourceTurnUpdate} from "../gameRules/getResourceTurnUpdate.ts";


const useGameBase = () => {
  const resourceRef = useRef<ResourceStoreClass | null>(null) as MutableRefObject<ResourceStoreClass | null>;
  const resources = resourceRef.current as ResourceStoreClass;
  const {fetchResources} = useApi();
  const [isFetching, setIsFetching] = useState(true);
  const tick = useTick();
  const prevTick = usePrevious(tick.current);
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
  };
}


const useGameContainer = createContainer(useGameBase);
export const useGame = useGameContainer.useContainer;
export const GameProvider = useGameContainer.Provider;
