import {ResourceEngine} from "@/GameEngine/ResourceEngine/ResourceHandler/ResourceEngine.ts";
import {ResourceUpdateProps} from "@/GameEngine/ResourceEngine/ResourceHandler/genericTypes.ts";

let instance: ResourceEngine<any, any> | null = null;
export function createSingletonResourceStore<K extends string, T extends string>() {

  return {
    getInstance(initialResources?: ResourceUpdateProps<K, T>[]): ResourceEngine<K, T> {
      if (!instance) {
        if (!initialResources) throw new Error("First call must provide initial resources");
        instance = new ResourceEngine(initialResources);
      }
      return instance as ResourceEngine<K, T>;
    },
    resetInstance() {
      instance = null; // for testing or HMR
    },
  };
}

export const resourceStore = <K extends string, T extends string>(initialResources?: ResourceUpdateProps<K, T>[]) =>
  createSingletonResourceStore<K, T>().getInstance(initialResources);