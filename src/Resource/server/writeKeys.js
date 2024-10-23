import {updateResourceTypes} from "./updateResourceTypes.js";

// Todo the types are actually not derived from the update. Only the keys are. The type needs its own endpoint to be handled

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
