import {useCallback, useState} from "react";
import {Trade} from "./Trade.ts";
import {ResourceState, ResourceTypeRaw, ResourceUpdateProps} from "./types.ts";
import {GetTurnUpdate, nextTurn} from "./helpers/nextTurn.ts";
import {get as _get} from "./helpers/getResource.ts";
import {mergeChangeToState as _mergeChangeToState} from "./helpers/stateUpdate.ts";
import {ResourceBase} from "./ResourceBase.ts";
// import {Resource} from "../gameRules/Resource.ts";

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

  const getType = (type: T) =>
    state.filter(resource => type === resource.type)

  // Update a single Resource
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
  const getExternal = (key: K): GetResource<K, T> => {
    const _this = get(key);
    // const cleanResource =
    return {
    // ...JSON.parse(JSON.stringify(get(key))),
      // ...removeFunctionProperties(get(key)),
      ..._this,
      update: (update) => onUpdate({...update, key}),
      increment: (amount = 1) => onUpdate({value: amount, key}),
      // checkTrade: (amount = 1) => {
      //   const x = trade(_this.cost || {} as TradeUpdate<K, T>).limitingResources;
      //   if (key === 'windmill') {
      //   //   console.log(_this.cost)
      //   // console.log(trade(_this.cost || {} as TradeUpdate<K, T>))
      //   }
      //   if (x.length) {
      //
      //   }
      //   return trade(_this.cost || {} as TradeUpdate<K, T>)
      // }
    }
  };
  const next = (getTurnUpdate: GetTurnUpdate<K, T>) =>
    setState(nextTurn(getTurnUpdate, state))

  const mergeChangeToState = (update: ResourceState<K, T> | ResourceState<K, T>[]): ResourceState<K, T>[] => {
    const arr: ResourceState<K, T>[] = [];
    return _mergeChangeToState(arr.concat(update), state);
  }

  return {
    state,
    // This includes the state as well as some methods to update the resource
    get: getExternal,
    getType,
    // This returns the full Resource for deeper evaluations
    check: get,
    onUpdate,
    onSetTo,
    // checkTrade: trade,
    onTrade,
    nextTurn: next,
    setState,
    mergeChangeToState,
  }
}

type GetResource<K extends string, T extends string> = {
  increment(amount: number): void;
  update(update: Partial<ResourceTypeRaw<K, T>>): void;
  checkTrade(amount: number): Trade<K, T>;
} & ResourceBase<K, T>
