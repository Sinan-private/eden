import {createContainer} from "unstated-next";
import {ResourceStore} from "./ResourceStore.ts";

const resources = new ResourceStore()

const useResourceBase = () => {

  return resources
}

const useResourceContainer = createContainer(useResourceBase);
export const useResources = useResourceContainer.useContainer;
export const ResourcesProvider = useResourceContainer.Provider;
