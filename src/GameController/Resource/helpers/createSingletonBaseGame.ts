import {GameBaseCreationProps} from "@/GameController/GameBaseClass.ts";
import {GameBaseClass} from "@/GameController/GameBaseClass.ts";

// This is only making sure that there is always only 1 GameController object.
// This object is stored in the window object to enable hot reloading without any issues

const globalKey = "__singleton_game_base_instance__";

function getGlobalInstance(): GameBaseClass | null {
  if (typeof window !== "undefined") {
    return (window as any)[globalKey] ?? null;
  }
  return null;
}

function setGlobalInstance(instance: GameBaseClass) {
  if (typeof window !== "undefined") {
    (window as any)[globalKey] = instance;
  }
}

function resetGlobalInstance() {
  if (typeof window !== "undefined") {
    delete (window as any)[globalKey];
  }
}

export function createSingletonBaseGame() {
  return {
    getInstance(initialGame?: GameBaseCreationProps): GameBaseClass {
      let instance = getGlobalInstance();
      if (!instance) {
        if (!initialGame) throw new Error("First call must provide initial resources");
        instance = new GameBaseClass(initialGame);
        setGlobalInstance(instance);
      }
      return instance;
    },
    resetInstance() {
      resetGlobalInstance();
    },
  };
}

export const baseGame = createSingletonBaseGame().getInstance;
