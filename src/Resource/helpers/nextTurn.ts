import {ResourceState} from "../types.ts";
import {Trade} from "../Trade.ts";
import {get} from "./getResource.ts";
import {isTradeFormat, TurnUpdateFormat} from "../types.ts";
import {Resource} from "../../gameRules/Resource.ts";

export type GetTurnUpdate<K extends string, T extends string> = (get: (key: K) => Resource<K, T>, state: ResourceState<K, T>[]) =>
  TurnUpdateFormat<K, T>[];

export const nextTurn = <K extends string, T extends string>(
  getTurnUpdate: GetTurnUpdate<K, T>,
  state: ResourceState<K, T>[],
) => {
  // The change is coming from external. The callback to evaluate that change receives the get(key) as the first parameter and the raw state as a second
  const changes = getTurnUpdate((key: K) => get(key, state), state);

  return changes.reduce((newState, change) => {
    newState = mergeChangeToState(singleChange(change, newState), newState);
    return newState
  }, [...state]);
}

export const mergeChangeToState = <K extends string, T extends string>(updates: ResourceState<K, T>[], state: ResourceState<K, T>[]) => {
  // Create a map for quick lookup of updates by key
  const updatesMap = new Map(updates.map(update => [update.key, update]));
  // Iterate through the state and either take the update (if exists) or keep the current state item
  return state.map(item => updatesMap.get(item.key) || item);
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