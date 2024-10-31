import {TurnUpdateFormat} from "../Resource/genericTypes.ts";
import {GetTurnUpdate} from "../Resource/helpers/nextTurn.ts";
import {ResourceKeys, ResourceTypes} from "../Resource/specificTypes.ts";

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
      type: "trade",
      update: {
        ...get('bread').cost!,
        multiplier: get('bakery').value
      },
    },
    {
      type: "trade",
      update: {
        ...get('flour').cost!,
        multiplier: get('windmill').value
      },
    },
    {
      type: "trade",
      update: {
        ...get('meat').cost!,
        multiplier: get('pasture').value
      },
    },
  ];
}
