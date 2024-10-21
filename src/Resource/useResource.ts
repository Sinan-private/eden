import {useCallback, useState} from "react";
import {Trade} from "./Trade.ts";
import {ResourceState, ResourceUpdateProps} from "./types.ts";
import {GetTurnUpdate, nextTurn} from "./helpers/nextTurn.ts";
import {get as _get} from "./helpers/getResource.ts";
import {mergeChangeToState as _mergeChangeToState} from "./helpers/stateUpdate.ts";
import {useIcons} from "./useIcons.ts";
import {Resource} from "./Resource.ts";

export type Update<K, T> = ResourceUpdateProps<K, T>;
export type TradeUpdate<K, T> = {
  give: Update<K, T>[];
  gain: Update<K, T>[];
  multiplier?: number
}

export const useResource = <K extends string, T extends string>(initialState: ResourceState<K, T>[]) => {
  const [state, setState] = useState(initialState);
  const icons = useIcons(state);

  // Get the full EditResource class
  const get = useCallback(
    (key: K, _state = state) => _get(key, _state),
    [state]);

  const getType = useCallback((type?: T | '') => type && type.length
    ? state.filter(resource => type === resource.type)
    : state,
    [state])

  // Update a single EditResource
  const onUpdate = (update: Update<K, T>) => {
    const newState = get(update.key).updateBy(update)
    setState(mergeChangeToState(newState));
  }

  const onSetTo = (update: Update<K, T>) => {
    const newState = get(update.key).setTo(update)
    setState(mergeChangeToState(newState));
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
    const thisTrade = trade(update);
    console.log(thisTrade)
    if (thisTrade.isPartlyPossible) {
      setState(thisTrade.newState)
    }
  };

  // Todo This needs cleaning. Some parts are provided, some are not
  // The exposed get method only returns the state of the resource
  const getExternal = (key: K): Resource<K, T> => {
    // const _this = get(key);
    const _this = stateToRichState(get(key).state)[0];
    // const cleanResource =
    return _this;
  }

  const next = (getTurnUpdate: GetTurnUpdate<K, T>) =>
    setState(nextTurn(getTurnUpdate, state))

  const mergeChangeToState = (update: ResourceState<K, T> | ResourceState<K, T>[]): ResourceState<K, T>[] => {
    const arr: ResourceState<K, T>[] = [];
    return _mergeChangeToState(arr.concat(update), state);
  }

  const getState = (newState = state): ResourceState<K, T>[] => {
    // Todo the idea here is that this will always return a proper clean state to handle and store. If no update is
    //  provided it will just return the current state
    return newState;
  }

  const stateToRichState = (newState: ResourceState<K, T> | ResourceState<K, T>[] = state) => {
    const toEnrich = ([] as ResourceState<K, T>[]).concat(newState);
    return toEnrich.map(resource => new Resource(resource, state))
  }

  // const getResources = (resources = state) => {
  //   return resources.map((resource) => new Resource(resource, state))
  // }

  return {
    // state,
    // This includes the state as well as some methods to update the resource
    get: getExternal,
    getType,
    // This returns the full EditResource for deeper evaluations
    check: get,
    onUpdate,
    onSetTo,
    // checkTrade: trade,
    onTrade,
    nextTurn: next,
    setState,
    mergeChangeToState,
    getState,
    icons,
  }
}

// type GetResource<K extends string, T extends string> = {
//   increment(amount: number): void;
//   update(update: Partial<ResourceTypeRaw<K, T>>): void;
//   // checkTrade(amount: number): Trade<K, T>;
// } & Resource<K, T>
