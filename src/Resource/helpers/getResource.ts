import {Resource} from "../../gameRules/Resource.ts";
import {GenericResourceState} from "./stateUpdates.ts";
export type GetResource = <K>(key: K) => Resource

export const get = <K extends string, T extends string>(key: K, state: GenericResourceState<K, T>[]): Resource => {
  const _this = state.find(resource => resource.key === key);
  if (!_this) throw new Error("Could not find resource key " + key);
  return new Resource(_this)
}
