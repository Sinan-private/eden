import {updateResourceTypes} from "./updateResourceTypes.js";

export const writeKeys = (newKeys) => {
  const onUpdateResourceKeys = () => {
    const keys = newKeys.map(({key}) => key);
    return getUniqueValues(keys)
  }
  updateResourceTypes('resourceKeys', onUpdateResourceKeys);
}

const getUniqueValues = (arr) => {
  return Array.from(new Set(arr));
}
