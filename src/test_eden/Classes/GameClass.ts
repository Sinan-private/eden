import {ResourceStoreClass} from "@/Resource";
import {HarvestRenderClass} from "@/test_eden/Gaja/HarvestRenderClass.ts";

declare global {
  interface Window {
    __game?: GameClass;
  }
}

export class GameClass {
  private static instance: GameClass;
  public readonly harvestRender: HarvestRenderClass;

  constructor(_resourceStore: ResourceStoreClass) {
    console.log('GameClass', _resourceStore.id)
    this.harvestRender = new HarvestRenderClass(_resourceStore)
  }
  public static getInstance(_resourceStore?: ResourceStoreClass): GameClass {
    if (typeof window !== "undefined") {
      if (!window.__game) {
        if (!_resourceStore) throw new Error("First call must provide resourceStore");
        window.__game = new GameClass(_resourceStore);
      }
      return window.__game;
    }
    // fallback (non-browser, SSR, etc.)
    if (!GameClass.instance) {
      if (!_resourceStore) throw new Error("First call must provide resourceStore");
      GameClass.instance = new GameClass(_resourceStore);
    }
    return GameClass.instance;
  }
}