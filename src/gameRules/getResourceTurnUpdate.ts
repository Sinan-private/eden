import {ResourceKeys, ResourceTypes} from "./types.ts";
import {TurnUpdateFormat} from "../Resource/types.ts";


import {GetTurnUpdate} from "../Resource/helpers/nextTurn.ts";

export const getResourceTurnUpdate: GetTurnUpdate<ResourceKeys, ResourceTypes> = (get): TurnUpdateFormat<ResourceKeys, ResourceTypes>[] => {

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
      type: "decrement",
      update: {
        key: 'water',
        value: 2
      }
    },
    {
      type: "trade",
      update: {
        ...get('bread').__cost,
        multiplier: get('bakery').value
      },
    },
    {
      type: "trade",
      update: {
        ...get('flour').__cost,
        multiplier: get('windmill').value
      },
    },
    {
      type: "trade",
      update: {
        ...get('meat').__cost,
        multiplier: get('pasture').value
      },
    },
  ];
}
