import {State} from "../context/types.ts";
import {UpdateFormat} from "../Resource/updateFormat.ts";
import {ResourceSingle} from "../Resource/ResourceSingle.ts";
import {get as _get} from "../context/helper/getResource.ts";
import {ResourceKeys, ResourceTypes} from "./types.ts";

export const getTurnUpdate = (state: State[]): UpdateFormat<ResourceKeys, ResourceTypes>[] => {
  const get = (key: ResourceKeys): ResourceSingle<ResourceKeys, ResourceTypes> => _get(key, state)

  const changes: UpdateFormat<ResourceKeys, ResourceTypes>[] = [
    {
      type: "increment",
      update: {
        key: 'corn',
        value: get('field').value
      }
    },
    {
      type: "increment",
      update: {
        key: 'water',
        value: get('well').value
      }
    },
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
    // {
    //   type: "decrement",
    //   update: {
    //     key: 'corn',
    //     value: 20
    //   }
    // },
  ];

  return changes
}