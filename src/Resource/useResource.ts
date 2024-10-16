import {useCallback, useState} from "react";
import {Trade} from "./Trade.ts";
import {ResourceState, ResourceTypeRaw, ResourceUpdateProps} from "./types.ts";
import {GetTurnUpdate, nextTurn} from "./helpers/nextTurn.ts";
import {get as _get} from "./helpers/getResource.ts";
import {mergeChangeToState} from "./helpers/stateUpdate.ts";
import {Resource} from "../gameRules/Resource.ts";

export type Update<K, T> = ResourceUpdateProps<K, T>;
export type TradeUpdate<K, T> = {
  give: Update<K, T>[];
  gain: Update<K, T>[];
  multiplier?: number
}

export const useResource = <K extends string, T extends string>(initialState: ResourceState<K, T>[]) => {
  const [state, setState] = useState(initialState);

  // Get the full Resource class
  const get = useCallback(
    (key: K, _state = state) => _get(key, _state),
    [state]);

  // Update a single Resource
  const onUpdate = (update: Update<K, T>) => {
    const newState = get(update.key).updateBy(update)
    setState(mergeChangeToState([newState], state));
  }

  // Only a simplification to pass the state in once
  const trade = useCallback((
      {
        give,
        gain,
        multiplier = 1
      }: TradeUpdate<K, T>) =>
      new Trade(give, gain, state, multiplier),
    [state]);

  // Expects the TradeUpdate object to handle a trade if at least a part of it can be executed
  const onTrade = (update: TradeUpdate<K, T>) => {
    if (trade(update).isPartlyPossible) {
      setState(trade(update).newState)
    }
  };

  // Todo This needs cleaning. Some parts are provided, some are not
  // The exposed get method only returns the state of the resource
  const getExternal = (key: K): GetResource<K, T> => {
    // const cleanResource =
    return {
    // ...JSON.parse(JSON.stringify(get(key))),
      // ...removeFunctionProperties(get(key)),
      ...get(key),
      update: (update) => onUpdate({...update, key}),
      increment: (amount = 1) => onUpdate({value: amount, key}),
    }
  };
  const next = (getTurnUpdate: GetTurnUpdate<K, T>) =>
    setState(nextTurn(getTurnUpdate, state))

  return {
    state,
    // This includes the state as well as some methods to update the resource
    get: getExternal,
    // This returns the full Resource for deeper evaluations
    check: get,
    onUpdate,
    checkTrade: trade,
    onTrade,
    nextTurn: next,
  }
}

type GetResource<K extends string, T extends string> = {
  increment(amount: number): void;
  update(update: Partial<ResourceTypeRaw<K, T>>): void;
} & Resource<K, T>
