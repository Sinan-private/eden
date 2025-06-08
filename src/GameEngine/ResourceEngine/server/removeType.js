import {updateResourceTypes} from "./updateResourceTypes.js";

export const removeType = (types) => {
  const onUpdateResourceTypes = (existingTypes) => {
    const toRemove = [].concat(types);
    const newTypes = existingTypes
      .filter(type => !toRemove.includes(type));
    return getUniqueValues(newTypes);
  }
  updateResourceTypes('resourceTypes', onUpdateResourceTypes);
}

const getUniqueValues = (arr) => {
  return Array.from(new Set(arr));
}
