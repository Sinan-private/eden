import {ResourceStore} from "@/Resource/ResourceHandler/ResourceStore.ts";
import {ResourceUpdateProps} from "@/Resource/ResourceHandler/genericTypes.ts";

export function createSingletonResourceStore<K extends string, T extends string>() {
  let instance: ResourceStore<K, T> | null = null;

  return {
    getInstance(initialResources?: ResourceUpdateProps<K, T>[]): ResourceStore<K, T> {
      if (!instance) {
        if (!initialResources) throw new Error("First call must provide initial resources");
        instance = new ResourceStore(initialResources);
      }
      return instance;
    },
    resetInstance() {
      instance = null; // for testing or HMR
    },
  };
}

