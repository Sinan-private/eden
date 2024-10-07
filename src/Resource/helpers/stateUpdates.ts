import {ResourceState} from "../types.ts";
import {Trade} from "../../Resource/Trade.ts";
import {get} from "./getResource.ts";
import {isTradeFormat, UpdateFormat} from "../../Resource/types.ts";

export type GenericResourceState<K extends string, T extends string> = ResourceState<K, T>;


// export const nextTurn = (state: State[]) => {
//   const changes = getTurnUpdate(state);
//
//   return changes.reduce((newState, change) => {
//     newState = mergeChangeToState(singleChange(change, newState), newState);
//     return newState
//   }, [...state]);
// }


export const mergeChangeToState = <K extends string, T extends string>(updates: GenericResourceState<K, T>[], state: GenericResourceState<K, T>[]) => {
  // Create a map for quick lookup of updates by key
  const updatesMap = new Map(updates.map(update => [update.key, update]));
  // Iterate through the state and either take the update (if exists) or keep the current state item
  return state.map(item => updatesMap.get(item.key) || item);
}

export const singleChange = <K extends string, T extends string>(
  change: UpdateFormat<K, T>,
  state: GenericResourceState<K, T>[],
): GenericResourceState<K, T>[] => {
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
    // case "trade":
    //   return []
    default:
      return []
  }
}