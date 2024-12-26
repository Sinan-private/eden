import {updateResourceTypes} from "./updateResourceTypes.js";

export const writeTypes = (types) => {
  const onUpdateResourceTypes = (existingTypes) => {
    const newTypes = existingTypes
      .concat(types)
      .filter(Boolean)
    return getUniqueValues(newTypes);
  }
  updateResourceTypes('resourceTypes', onUpdateResourceTypes);
}

const getUniqueValues = (arr) => {
  return Array.from(new Set(arr));
}
