import {useRef, useState, MutableRefObject} from "react";
import {createContainer} from "unstated-next";
import {useApi} from "../hooks/useApi.ts";
import {ResourceStoreClass} from "../ResourceHandler/specificTypes.ts";
import {useComponentMount} from "../hooks";
import {ResourceStore} from "../ResourceHandler/ResourceStore.ts";

export type Resources = ReturnType<typeof useResourceBase>['resources']

const useResourceBase = () => {
  const resourceRef = useRef<ResourceStoreClass | null>(null) as MutableRefObject<ResourceStoreClass | null>;
  const resources = resourceRef.current as ResourceStoreClass;
  // This is only needed to avoid a side refresh after every change
  const {fetchResources} = useApi();
  const [isFetching, setIsFetching] = useState(true);
  useComponentMount(async () => {
    const rawState = await fetchResources();
    resourceRef.current = new ResourceStore(rawState, 'resource.context');
    setIsFetching(false);
  })

  return {
    resources,
    isFetching,
  };
}


const useResourceContainer = createContainer(useResourceBase);
export const useResource = useResourceContainer.useContainer;
export const ResourceRawProvider = useResourceContainer.Provider;
