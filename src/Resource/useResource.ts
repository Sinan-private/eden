import {useCallback, useState} from "react";
import {Trade} from "./Trade.ts";
import {ResourceState, ResourceUpdateProps} from "./types.ts";
import {GetTurnUpdate, nextTurn as getNextTurn} from "./helpers/nextTurn.ts";
import {get as _get} from "./helpers/getResource.ts";
import {mergeChangeToState as _mergeChangeToState} from "./helpers/stateUpdate.ts";
import {useIcons} from "./useIcons.ts";

export type Update<K, T> = ResourceUpdateProps<K, T>;
export type TradeUpdate<K, T> = {
  give: Update<K, T>[];
  gain: Update<K, T>[];
  multiplier?: number
}

export const useResource = <K extends string, T extends string>(initialState: ResourceState<K, T>[]) => {
  const [state, setState] = useState(initialState);
  const icons = useIcons(state);

  const mergeChangeToState = useCallback((update: ResourceState<K, T> | ResourceState<K, T>[]): ResourceState<K, T>[] =>
    _mergeChangeToState(update, state), [state])

  // Get the full EditResource class
  const get = useCallback(
    (key: K, _state = state) => _get(key, _state),
    [state]);

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
  }, [get, mergeChangeToState])

  return {
    get,
    getByType,
    onUpdate,
    onSetTo,
    onTrade,
    nextTurn: nextTurn,
    setState,
    mergeChangeToState,
    icons,
  }
}
