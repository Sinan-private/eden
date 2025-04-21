import {ResourceKeys, ResourceState, ResourceTypes} from "@/GameController/Resource";
import {Resource} from "@/GameController/Resource/ResourceHandler";

export const areObjectsEqual = <K extends string>(obj1: ResourceState, obj2?: Partial<ResourceState>): boolean => {
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
export const getKeyAlreadyExists = (
  resources: Resource<ResourceKeys, ResourceTypes>[],
  resource: ResourceState & {id: string}
) => resources
  .filter(({id}) => id !== resource?.id)
  .map(({key}) => key)
  .includes(resource?.key as ResourceKeys);