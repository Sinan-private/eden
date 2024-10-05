import {State} from "../context/types.ts";
import {ResourceSingle} from "../Resource/ResourceSingle.ts";
import {get as _get} from "../context/helper/getResource.ts";
import {ResourceKeys, ResourceTypes} from "./types.ts";
import {UpdateFormat} from "../Resource/types.ts";
import {ResourceConversion} from "./ResourceConversion.ts";

export const getTurnUpdate = (state: State[]): UpdateFormat<ResourceKeys, ResourceTypes>[] => {
  const get = (key: ResourceKeys): ResourceSingle<ResourceKeys, ResourceTypes> => _get(key, state)
  const convert = new ResourceConversion(state);

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
      update: convert.bread(),
    },
    {
      type: "trade",
      update: convert.flour(),
    },
  ];
}