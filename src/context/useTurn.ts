import {useEffect} from "react";
import {usePrevious} from "../hooks/usePrevious.ts";
import {mergeChangeToState, singleChange} from "./helper/stateUpdates.ts";
import {State} from "./types.ts";
import {ResourceKeys, ResourceTypes} from "../gameRules/types.ts";
import {get as _get} from "./helper/getResource.ts";
import {UpdateFormat} from "../Resource/types.ts";

export const useTurn = (
  current: number,
  isTicking: boolean,
  state: State[],
) => {
  const prevTick = usePrevious(current);
  let newState = [...state];
  const get = (key: ResourceKeys) => _get(key, state);
  useEffect(() => {

    if (isTicking && prevTick !== current) {
      const changes: UpdateFormat<ResourceKeys, ResourceTypes>[] = [
        // {
        //   type: "increment",
        //   update: {
        //     key: 'corn',
        //     value: get('field').value
        //   }
        // },
        // {
        //   type: "increment",
        //   update: {
        //     key: 'water',
        //     value: get('well').value
        //   }
        // },
        {
          type: "trade",
          update: {
            give: [{key: 'flour', value: 1}, {key: 'water', value: 2}],
            gain: [{key: 'bread', value: 1}],
            multiplier: get('bakery').value
          }
        },
        {
          type: "trade",
          update: {
            give: [{key: 'corn', value: 2}],
            gain: [{key: 'flour', value: 1}],
            multiplier: get('windmill').value
          }
        },
        {
          type: "decrement",
          update: {
            key: 'corn',
            value: 2
          }
        },
      ];

      const update = changes.reduce((newState, change) => {
        // const a = singleChange(change, state)
        newState = mergeChangeToState(singleChange(change, newState), newState);
        return newState
      }, [...state]);
      console.log(update)
      newState = update
      // setState(update)
    }
  }, [isTicking, current, prevTick, get, state, singleChange]);
  console.log(newState)
  return  newState
}