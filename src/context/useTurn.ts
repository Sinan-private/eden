import {useEffect} from "react";
import {UpdateFormat} from "../Resource/updateFormat.ts";
import {usePrevious} from "../hooks/usePrevious.ts";
import {mergeChangeToState, singleChange} from "./helper/stateUpdates.ts";
import {State} from "./types.ts";
import {ResourceSingle} from "../Resource/ResourceSingle.ts";
import {ResourceKeys, ResourceTypes} from "../gameRules/types.ts";

export const useTurn = (
  current: number,
  isTicking: boolean,
  state: State[],
  get: (key: ResourceKeys, state?: State[]) => ResourceSingle<ResourceKeys, ResourceTypes>,
) => {
  const prevTick = usePrevious(current);
  let newState = [...state];
  useEffect(() => {

    if (isTicking && prevTick !== current) {
      const changes: UpdateFormat<ResourceKeys>[] = [
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
        newState = mergeChangeToState(singleChange(change, newState, get), newState);
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