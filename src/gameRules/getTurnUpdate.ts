import {State} from "../context/types.ts";
import {get as _get, GetResource} from "../context/helper/getResource.ts";
import {ResourceKeys, ResourceTypes} from "./types.ts";
import {UpdateFormat} from "../Resource/types.ts";

export const getTurnUpdate = (state: State[]): UpdateFormat<ResourceKeys, ResourceTypes>[] => {
  const get: GetResource = (key) => _get(key, state)
  console.log(get('bakery').trade)

  return [
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
        ...get('bread').trade,
        multiplier: get('bakery').value
      },
    },
    {
      type: "trade",
      update: {
        ...get('flour').trade,
        multiplier: get('windmill').value
      },
    },
    {
      type: "trade",
      update: {
        ...get('meat').trade,
        multiplier: get('pasture').value
      },
    },
  ];
}