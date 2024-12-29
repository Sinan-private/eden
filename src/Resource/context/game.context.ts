import {useRef, useState, MutableRefObject} from "react";
import {createContainer} from "unstated-next";
import {useApi} from "./useApi.ts";
import {ResourceStoreClass} from "../ResourceHandler/specificTypes.ts";
import {useComponentMount} from "../hooks";
import {ResourceStore} from "../ResourceHandler/ResourceStore.ts";

const useGameBase = () => {
  const resourceRef = useRef<ResourceStoreClass | null>(null) as MutableRefObject<ResourceStoreClass | null>;
  const resources = resourceRef.current as ResourceStoreClass;
  // This is only needed to avoid a side refresh after every change
  const {fetchResources} = useApi();
  const [isFetching, setIsFetching] = useState(true);
  useComponentMount(async () => {
    const rawState = await fetchResources();
    resourceRef.current = new ResourceStore(rawState);
    setIsFetching(false);
  })

  return {
    resources,
    isFetching,
  };
}


const useGameContainer = createContainer(useGameBase);
export const useGame = useGameContainer.useContainer;
export const GameProvider = useGameContainer.Provider;
