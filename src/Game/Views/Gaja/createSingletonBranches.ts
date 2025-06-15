import {BranchConfig, BranchFactory} from "@/Game/Views/Gaja/BranchFactory.ts";

let instance: BranchFactory | null = null;
export function createSingletonBranches() {

  return {
    getInstance(initial_height?: number, config?: Partial<BranchConfig>): BranchFactory {
      if (!instance) {
        if (!initial_height) throw new Error("First call must provide initial resources");
        instance = new BranchFactory(initial_height, config);
      }
      return instance as BranchFactory;
    },
    resetInstance() {
      instance = null; // for testing or HMR
    },
  };
}
