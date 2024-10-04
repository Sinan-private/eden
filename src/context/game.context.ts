import {createContainer} from "unstated-next";
import {useCallback, useEffect, useState} from "react";
import {initialState, ResourceKeys} from "./gameInit.ts";
import {ResourceState, ResourceUpdateProps} from "../Resource/types.ts";
import {useTick} from "./tick.ts";
import {usePrevious} from "../hooks/usePrevious.ts";
import {isTradeFormat, UpdateFormat} from "../Resource/updateFormat.ts";
import {ResourceSingle} from "../NEW_Resource/ResourceSingle.ts";
import {Trade} from "../NEW_Resource/Trade.ts";
import {Resources} from "../Resource/Resources.ts";

const useGameBase = () => {
  const {current, isTicking, startGlobalTick, pauseGlobalTick} = useTick();
  const [state, setState] = useState(initialState);
  const prevTick = usePrevious(current);

  const get = useCallback((key: ResourceKeys, _state = state): ResourceSingle<ResourceKeys> => {
    const _this = _state.find(resource => resource.key === key);
    if (!_this) throw new Error("Could not find resource key " + key);
    return new ResourceSingle<ResourceKeys>(_this)
  }, [state]);

  const onUpdate = (update: ResourceUpdateProps<ResourceKeys>) => {
    setState(state => new Resources(state).update(update))
  }

  const trade = useCallback((
    give: ResourceUpdateProps<ResourceKeys>[],
    gain: ResourceUpdateProps<ResourceKeys>[],
    multiplier = 1
  ) => new Trade(give, gain, state, multiplier),
  [state]);

  const onTrade = (
    give: ResourceUpdateProps<ResourceKeys>[],
    gain: ResourceUpdateProps<ResourceKeys>[],
    multiplier = 1
  ) => setState(trade(give, gain, multiplier).newState);

  const getExternal = (key: ResourceKeys) => get(key).state;

  const singleChange = useCallback((
    change: UpdateFormat<ResourceKeys>,
    _state: ResourceState<ResourceKeys>[],
  ): ResourceState<ResourceKeys>[] => {
    if (isTradeFormat(change)) {
      const {give, gain, multiplier = 1} = change.update
      return new Trade(give, gain, _state, multiplier).stateUpdates
    }
    const {type, update} = change;
    switch (type) {
      case "increment":
        return [get(update.key, _state).updateValueBy(update.value!)]
      case "decrement":
        // console.log(type, get(update.key, _state))
        return [get(update.key, _state).updateValueBy(-Math.abs(update.value!))]
      case "update":
        return []
      case "set":
        return []
      // case "trade":
      //   return []
      default:
        return []
    }
  }, [get])

  const mergeChangeToState = (updates: ResourceState<ResourceKeys>[], _state: ResourceState<ResourceKeys>[]) => {
    // Create a map for quick lookup of updates by key
    const updatesMap = new Map(updates.map(update => [update.key, update]));
    // Iterate through the state and either take the update (if exists) or keep the current state item
    return _state.map(item => updatesMap.get(item.key) || item);
  }

  useEffect(() => {
    // Here the problem is again that one change is overwriting the other
    if (isTicking && prevTick !== current) {
      const changes: UpdateFormat<ResourceKeys>[] = [
        {
          type: "increment",
          update: {
            key: 'corn',
            value: get('field').value
          }
        },
        {
          type: "trade",
          update: {
            give: [{key: 'corn', value: 1}, {key: 'water', value: 2}],
            gain: [{key: 'bread', value: 1}],
            multiplier: get('bakery').value
          }
        },
        // {
        //   type: "decrement",
        //   update: {
        //     key: 'corn',
        //     value: 20
        //   }
        // },
      ];

      const newState = changes.reduce((newState, change) => {
        // const a = singleChange(change, state)
        newState = mergeChangeToState(singleChange(change, newState), newState);
        return newState
      }, [...state]);
      console.log(state, newState)
      setState(newState)
    }
  }, [isTicking, current, prevTick, get, state, singleChange]);

  return {
    state,
    get: getExternal,
    // resources,
    trade,
    onUpdate,
    onTrade,
    // onBakeBread,
    // onBuildField,
    // onBuildWindmill,
    // onBuildBakery,
    currentTick: current,
    startGlobalTick,
    pauseGlobalTick,
    isTicking
  };
}



const useGameContainer = createContainer(useGameBase);
export const useGame = useGameContainer.useContainer;
export const GameProvider = useGameContainer.Provider;
