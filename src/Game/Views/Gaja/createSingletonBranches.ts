import {ResourceEngine} from "@/GameEngine/ResourceEngine/ResourceHandler/ResourceEngine.ts";
import {ResourceUpdateProps} from "@/GameEngine/ResourceEngine/ResourceHandler/genericTypes.ts";
import {BranchConfig, BranchManager} from "@/Game/Views/Gaja/BranchManager.ts";

let instance: BranchManager | null = null;
export function createSingletonResourceStore<K extends string, T extends string>() {

  return {
    getInstance(initial_height?: number, config?: Partial<BranchConfig>): ResourceEngine<K, T> {
      if (!instance) {
        if (!initial_height) throw new Error("First call must provide initial resources");
        instance = new BranchManager(initial_height, config);
      }
      return instance as BranchManager;
    },
    resetInstance() {
      instance = null; // for testing or HMR
    },
  };
}

export const resourceStore = <K extends string, T extends string>(initialResources?: ResourceUpdateProps<K, T>[]) =>
  createSingletonResourceStore<K, T>().getInstance(initialResources);