import {useState} from "react";
import {createContainer} from "unstated-next";
import {useApi} from "../../context/useApi.ts";
import {useComponentMount} from "../hooks/useComponentMount.ts";
import {ResourceKeys, ResourceState, ResourceTypes} from "../specificTypes.ts";
import {ResourceStore} from "../../Version 3/Resource/ResourceStore.ts";
import {useGame} from "../../context/game.context.ts";

const useAdminBase = () => {
  const {
    fetchResources,
    updateResources,
    addType,
    removeType,
  } = useApi();
  const originalResources = useGame().resources;
  const [resources, setResources] = useState<ResourceStore<ResourceKeys, ResourceTypes>>()
  // const {...resources} = useResource<ResourceKeys, ResourceTypes>([])
  const [isFetching, setIsFetching] = useState(true);

  useComponentMount(async () => {
    const rawState = await fetchResources();
    setResources(new ResourceStore(rawState));
    setIsFetching(false);
  })

  const write__initialResources = () => {
    updateResources(resources!.state).then(() => {

    })
  }

  const write__removeResource = (key: ResourceKeys) => {
    const updatedState = resources?.removeResource(key);
    if (updatedState) {
      updateResources(updatedState)
    }
  }

  const write__addType = (type: string | string[]) =>
    addType(([] as string[]).concat(type))

  const write__removeType = (type: ResourceTypes | ResourceTypes[]) => {
    const usedTypes = resources!.allResources.map(({type}) => type);
    const typesToRemove = ([] as ResourceTypes[]).concat(type);
    const matches = typesToRemove.filter(value => usedTypes.includes(value!));
    if (matches.length) {
      console.error('These Types are being in used and can not be removed', matches)
      return;
    }
    removeType(typesToRemove)
  }

  const canRemoveResource = (key: ResourceKeys) => {
    return !resources?.isResourceReferenced(key)
  }

  const isDisabled = (key: ResourceKeys) => {
    if (resources?.get(key) && originalResources.get(key)) {
      return areObjectsEqual(resources!.get(key).state, originalResources.get(key).state)
    }
    return false
  }



  return {
    resources: resources as ResourceStore<ResourceKeys, ResourceTypes>,
    isFetching,
    isDisabled,
    canRemoveResource,
    write__addType,
    write__removeType,
    write__removeResource,
    write__initialResources
  }
}

const useAdminContainer = createContainer(useAdminBase);
export const useAdmin = useAdminContainer.useContainer;
export const AdminProvider = useAdminContainer.Provider;

const areObjectsEqual = <K extends string, T extends string>(obj1: ResourceState<K, T>, obj2?: Partial<ResourceState<K, T>>): boolean => {
  if (obj1 === obj2) return true;

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false;
  }

  const keys1 = Object.keys(obj1) as K[];
  const keys2 = Object.keys(obj2) as K[];

  for (const key of keys1) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (!keys2.includes(key) || !areObjectsEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}
