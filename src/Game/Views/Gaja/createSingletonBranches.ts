import {BranchConfig, BranchManager} from "@/Game/Views/Gaja/BranchManager.ts";

let instance: BranchManager | null = null;
export function createSingletonBranches() {

  return {
    getInstance(initial_height?: number, config?: Partial<BranchConfig>): BranchManager {
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
