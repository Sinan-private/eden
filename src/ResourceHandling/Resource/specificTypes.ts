import {resourceKeys} from "../generated/resourceKeys.ts";
import {resourceTypes} from "../generated/resourceTypes.ts";
import {
  ResourceState as GenericState,
  ResourceUpdateProps as GenericUpdateProps
} from "./genericTypes.ts";

export type ResourceTypes = typeof resourceTypes[number];
export type ResourceKeys = typeof resourceKeys[number];
export type ResourceState = GenericState<ResourceKeys, ResourceTypes>;
export type ResourceUpdateProps = GenericUpdateProps<ResourceKeys, ResourceTypes>;