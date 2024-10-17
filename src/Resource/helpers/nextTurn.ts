import {ResourceState, TurnUpdateFormat} from "../types.ts";
import {get} from "./getResource.ts";
import {mergeChangeToState, singleChange} from "./stateUpdate.ts";
import {ResourceBase} from "../ResourceBase.ts";

export type GetTurnUpdate<K extends string, T extends string> = (get: (key: K) => ResourceBase<K, T>, state: ResourceState<K, T>[]) =>
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
