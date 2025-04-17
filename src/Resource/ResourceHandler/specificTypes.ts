import {resourceKeys} from "../generated/resourceKeys.ts";
import {resourceTypes} from "../generated/resourceTypes.ts";
import {Resource} from "./Resource.ts";
import {ResourceStore} from "./ResourceStore.ts";
import {LevelUpdate as GenericLevelUpdate} from "./genericTypes.ts";
import {GameState} from "@/test_eden/Classes/GameState.ts";

export type ResourceTypes = typeof resourceTypes[number];
export type ResourceKeys = typeof resourceKeys[number];
export type ResourceClass = Resource<ResourceKeys, ResourceTypes>;
export type ResourceState = ResourceClass['state'];
export type ResourceStoreClass = ResourceStore<ResourceKeys, ResourceTypes>;
export type TradeChange = {key: ResourceKeys} & Partial<ResourceClass>;
export type LevelUpdate = GenericLevelUpdate<ResourceKeys, ResourceTypes>;
export type GameBaseProps = {
  _resourceStore: ResourceStoreClass;
  _gameState: GameState;
}
// export type ResourceKeysWithLevels = `${ResourceKeys}_level_${1 | 2 | 3 | 4 | 5}`;
// // Remove `_level_X` suffix if it exists, otherwise keep the key as-is
// export type ResourceKeysWithoutLevels = ResourceKeys extends `${infer Base}_level_${number}`
//   ? Base
//   : ResourceKeys;