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
