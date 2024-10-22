import {isTradeFormat, ResourceState, TurnUpdateFormat} from "../types.ts";
import {Trade} from "../Trade.ts";
import {get} from "./getResource.ts";
import {Resource} from "../Resource.ts";

export const mergeChangeToState = <K extends string, T extends string>(
  update: ResourceState<K, T> | ResourceState<K, T>[],
  state: ResourceState<K, T>[],
  ): ResourceState<K, T>[] => {
  const arr: ResourceState<K, T>[] = [];
  const _update = arr.concat(update).map(change => new Resource(change).state)
  return changeToState(_update, state);
}

const changeToState = <K extends string, T extends string>(updates: ResourceState<K, T>[], state: ResourceState<K, T>[]) => {
  // Todo since the state is mapped new items will not be stored
  // Create a map for quick lookup of updates by key
  const updatesMap = new Map(updates.map(update => [update.key, update]));
  const resourceKeys = state.map(({key}) => key);
  const newResources = updates.filter(({key}) => !resourceKeys.includes(key));
  console.log(newResources)
  // Iterate through the state and either take the update (if exists) or keep the current state item
  return state
    .map(item => updatesMap.get(item.key) || item)
    .concat(newResources);
}
export const singleChange = <K extends string, T extends string>(
  change: TurnUpdateFormat<K, T>,
  state: ResourceState<K, T>[],
): ResourceState<K, T>[] => {
  if (isTradeFormat(change)) {
    const {give, gain, multiplier = 1} = change.update
    return new Trade(give, gain, state, multiplier).stateUpdates
  }
  const {type, update} = change;
  switch (type) {
    case "increment":
      return [get(update.key, state).updateValueBy(update.value!)]
    case "decrement":
      // console.log(type, get(update.key, _state))
      return [get(update.key, state).updateValueBy(-Math.abs(update.value!))]
    case "update":
      return []
    case "set":
      return []
    default:
      return []
  }
}