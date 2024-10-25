import {useState} from "react";
import {createContainer} from "unstated-next";
import {useApi} from "../../context/useApi.ts";
import {useComponentMount} from "../hooks/useComponentMount.ts";
import {Resource} from "../Resource.ts";
import {useResource} from "../useResource.ts";
import {ResourceKeys, ResourceState, ResourceTypes, ResourceUpdateProps} from "../specificTypes.ts";

const useAdminBase = () => {
  const {
    fetchResources,
    updateResources,
    addType,
    removeType,
  } = useApi();
  const {setState, state, ...resources} = useResource<ResourceKeys, ResourceTypes>([])
  const [isFetching, setIsFetching] = useState(true);

  useComponentMount(async () => {
    const rawState = await fetchResources();
    setState(getInitialState(rawState));
    setIsFetching(false);
  })

  const write__initialResources = (newState?: ResourceState[]) => {
    if (!newState) return;
    updateResources(newState).then(() => (
      setState(newState)
    ))
  }

  const write__removeResource = (key: ResourceKeys) => {
    const updatedState = resources.removeResource(key);
    console.log(updatedState)
    if (updatedState) {
      updateResources(updatedState)
    }
  }

  const write__addType = (type: string | string[]) =>
    addType(([] as string[]).concat(type))

  const write__removeType = (type: ResourceTypes | ResourceTypes[]) => {
    const usedTypes = state.map(({type}) => type);
    const typesToRemove = ([] as ResourceTypes[]).concat(type);
    const matches = typesToRemove.filter(value => usedTypes.includes(value!));
    if (matches.length) {
      console.error('These Types are being in used and can not be removed', matches)
      return;
    }
    removeType(typesToRemove)
  }

  return {
    resources,
    isFetching,
    write__addType,
    write__removeType,
    write__removeResource,
    write__initialResources
  }
}

const useAdminContainer = createContainer(useAdminBase);
export const useAdmin = useAdminContainer.useContainer;
export const AdminProvider = useAdminContainer.Provider;

const getInitialState = (raw_state: ResourceUpdateProps[]) => raw_state.map(rawResource =>
  new Resource(rawResource).state
);
