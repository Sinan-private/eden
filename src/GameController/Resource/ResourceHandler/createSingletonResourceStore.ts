import {ResourceStore} from "@/GameController/Resource/ResourceHandler/ResourceStore.ts";
import {ResourceUpdateProps} from "@/GameController/Resource/ResourceHandler/genericTypes.ts";

let instance: ResourceStore<any, any> | null = null;
export function createSingletonResourceStore<K extends string, T extends string>() {

  return {
    getInstance(initialResources?: ResourceUpdateProps<K, T>[]): ResourceStore<K, T> {
      if (!instance) {
        if (!initialResources) throw new Error("First call must provide initial resources");
        instance = new ResourceStore(initialResources);
      }
      return instance as ResourceStore<K, T>;
    },
    resetInstance() {
      instance = null; // for testing or HMR
    },
  };
}

