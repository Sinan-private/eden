import type {resourceKeys} from "../generated/resourceKeys.ts";
import type {resourceTypes} from "../generated/resourceTypes.ts";
import type {Resource} from "./Resource.ts";
import type {ResourceStore} from "./ResourceStore.ts";
import type {LevelUpdate as GenericLevelUpdate} from "./genericTypes.ts";
import type {ResourceCostUpdate as GenericResourceCostUpdate} from "./genericTypes.ts";

export type ResourceTypes = typeof resourceTypes[number];
export type ResourceKeys = typeof resourceKeys[number];
export type ResourceClass = Resource<ResourceKeys, ResourceTypes>;
export type ResourceState = ResourceClass['state'];
export type ResourceStoreClass = ResourceStore<ResourceKeys, ResourceTypes>;
export type TradeChange = {key: ResourceKeys} & Partial<ResourceClass>;
export type LevelUpdate = GenericLevelUpdate<ResourceKeys, ResourceTypes>;
export type ResourceCostUpdate = GenericResourceCostUpdate<ResourceKeys, ResourceTypes>;
