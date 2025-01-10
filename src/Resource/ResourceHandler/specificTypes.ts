import {resourceKeys} from "../generated/resourceKeys.ts";
import {resourceTypes} from "../generated/resourceTypes.ts";
import {Resource} from "./Resource.ts";
import {ResourceStore} from "./ResourceStore.ts";

export type ResourceTypes = typeof resourceTypes[number];
export type ResourceKeys = typeof resourceKeys[number];
export type ResourceClass = Resource<ResourceKeys, ResourceTypes>;
export type ResourceState = ResourceClass['state'];
export type ResourceStoreClass = ResourceStore<ResourceKeys, ResourceTypes>;
export type TradeChange = {key: ResourceKeys, value: number};
// export type ResourceKeysWithLevels = `${ResourceKeys}_level_${1 | 2 | 3 | 4 | 5}`;
// // Remove `_level_X` suffix if it exists, otherwise keep the key as-is
// export type ResourceKeysWithoutLevels = ResourceKeys extends `${infer Base}_level_${number}`
//   ? Base
//   : ResourceKeys;