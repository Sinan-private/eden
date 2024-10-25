import {ResourceState, ResourceUpdateProps} from "../genericTypes.ts";

// Function to update the state based on partial updates
export function updateResourceState<K extends string, T extends string>(
  state: ResourceState<K, T>[],
  updates: ResourceUpdateProps<K, T>[]
): ResourceState<K, T>[] {
  // Start with the current state
  const newState = [...state];

  // Loop through each update and apply it immediately to ensure incremental updates
  updates.forEach(update => {
    if (!update.key) return; // Skip if 'key' is not present

    const stateIndex = newState.findIndex(resource => resource.key === update.key);

    if (stateIndex !== -1) {
      // Apply the update incrementally
      const currentState = newState[stateIndex];

      newState[stateIndex] = {
        ...currentState,
        value: update.value !== undefined
          ? Math.max(update.min ?? currentState.min, Math.min(update.value, update.max ?? currentState.max))
          : currentState.value,  // Only update value if provided, keep within min/max bounds
        min: update.min !== undefined ? update.min : currentState.min,
        max: update.max !== undefined ? update.max : currentState.max,
        label: update.label !== undefined ? update.label : currentState.label
      };
    }
  });

  return newState;
}
