import {useCallback, useMemo, useState} from "react";
import {Trade} from "./Trade.ts";
import {ResourceState, ResourceUpdateProps} from "./genericTypes.ts";
import {GetTurnUpdate, nextTurn as getNextTurn} from "./helpers/nextTurn.ts";
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

  const setSafeState = (raw_state: (ResourceUpdateProps<K, T> | ResourceState<K, T>)[]) => {
    const safeState = raw_state.map(rawResource =>
      new Resource(rawResource).state
    );
    setState(safeState)
    return safeState;
  }

  type StateUpdatePossibilities = ResourceUpdateProps<K, T> | ResourceState<K, T> | (ResourceUpdateProps<K, T> | ResourceState<K, T>)[]
  const mergeChangeToState = useCallback((update: StateUpdatePossibilities): ResourceState<K, T>[] =>
    _mergeChangeToState(update, state), [state])

  // Get the full EditResource class
  const get = useCallback(
    (key: K, _state = state) => _get(key, _state),
    [state]);

  // const existingTypes = useMemo(() => resourceTypes, [])

  const usedTypes = useMemo(() =>
      getUniqueValues(state.map(({type}) => type)),
    [state])

  const getByType = useCallback((type?: T | '') => type && type.length
    ? state.filter(resource => type === resource.type)
    : state,
    [state])

  const onSetTo = useCallback((update: Update<K, T>) => {
    const newState = get(update.key).setTo(update)
    setState(mergeChangeToState(newState));
  }, [get, mergeChangeToState]);

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
  // This should be extended to offer more flexibility
  const onTrade = (update: TradeUpdate<K, T>) => {
    const thisTrade = trade(update);
    if (thisTrade.isPartlyPossible) {
      setState(thisTrade.newState)
    }
  };

  const nextTurn = useCallback((getTurnUpdate: GetTurnUpdate<K, T>) =>
    setState(getNextTurn(getTurnUpdate, state)), [state]);

  // Update a single EditResource
  const onUpdate = useCallback((update: Update<K, T>) => {
    const newState = get(update.key).updateBy(update)
    setState(mergeChangeToState(newState));
  }, [get, mergeChangeToState]);

  const canRemoveResource = (key: K) => {
    const newResources = removeResourceByKey(key, state)
    return safeToRemoveResource(key, newResources);
  }

  const removeResource = (key: K): ResourceState<K, T>[] | undefined => {
    const newResources = removeResourceByKey(key, state)
    // It is important to use the newState here since otherwise the resource will possibly block its own deletion
    if (safeToRemoveResource(key, newResources)) {
      setState(newResources);
      return newResources;
    }
  }

  const getByCost = useCallback((key?: K) => getResourcesWithCost(key, state), [state])

  return {
    state,
    get,
    getByType,
    onUpdate,
    onSetTo,
    onTrade,
    nextTurn: nextTurn,
    setState: setSafeState,
    usedTypes,
    // existingTypes,
    mergeChangeToState,
    canRemoveResource,
    removeResource,
    icons,
    getResourcesWithCost: getByCost,
  }
}

const getUniqueValues = <T>(arr: T[]): T[] => {
  return Array.from(new Set(arr));
}

const removeResourceByKey = <K, T>(key: K, state: ResourceState<K, T>[]): ResourceState<K, T>[] => {
  const index = state.findIndex(state => state.key === key);
  return [
    ...state.slice(0, index),
    ...state.slice(index + 1),
  ]
}

const safeToRemoveResource = <K, T>(key: K, state: ResourceState<K, T>[]): boolean => {
  return !getResourcesWithCost(key, state).length
}

const getResourcesWithCost = <K, T>(key: K | undefined, state: ResourceState<K, T>[]): ResourceState<K, T>[] => {
  if (!key) {
    return []
  }
  const resourcesUsingKey: ResourceState<K, T>[] = [];

  state.forEach(resource => {
    const { cost } = resource;
    if (!cost) return;

    const flatCost = Object.values(cost).flat();
    const isKeyUsed = flatCost.some(cost => cost.key === key);

    if (isKeyUsed) {
      resourcesUsingKey.push(resource);
    }
  });

  return resourcesUsingKey.filter(used => used.key !== key);
};
