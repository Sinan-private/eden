import {updateResourceTypes} from "./updateResourceTypes.js";

export const writeKeys = (newResources) => {
  const onUpdateResourceKeys = () => {
    const keys = newResources.map(({key}) => key);
    return getUniqueValues(keys)
  }
  updateResourceTypes('resourceKeys', onUpdateResourceKeys);
}

const getUniqueValues = (arr) => {
  return Array.from(new Set(arr));
}
