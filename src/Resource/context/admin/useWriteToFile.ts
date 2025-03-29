import {useCallback} from "react";
import {ResourceKeys, ResourceState, ResourceStoreClass, ResourceTypes} from "@/Resource";
import {useApi} from "@/Resource/hooks/useApi.ts";

export const useWriteToFile = (resources?: ResourceStoreClass) => {
    const {
      addType,
      removeType,
    } = useApi();

  const updateResources = async (newResources?: ResourceState[]) => {
    if (!newResources) return;
    try {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newResources),
      });
      const result = await response.json();

      console.log(result.message);  // Success message
    } catch (error) {
      console.error('Error updating resources:', error);
    }
  };

  const write__initialResources = useCallback(() => {
    // console.log(resources?.state.length)
    const state = resources!.state.filter(({key}) => key.length)
    updateResources(state)
  }, [updateResources])

  const write__removeResource = (key: ResourceKeys) => {
    resources?.removeResource(key);
    updateResources(resources!.state)
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

  return {
    write__initialResources,
    write__removeResource,
    write__addType,
    write__removeType,
  }
}
