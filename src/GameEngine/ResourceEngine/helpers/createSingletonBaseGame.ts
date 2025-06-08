import {GameCreationProps} from "@/GameEngine/GameEngine.ts";
import {GameEngine} from "@/GameEngine/GameEngine.ts";

// This is only making sure that there is always only 1 GameEngine object.
// This object is stored in the window object to enable hot reloading without any issues

const globalKey = "__singleton_game_base_instance__";

function getGlobalInstance(): GameEngine | null {
  if (typeof window !== "undefined") {
    return (window as any)[globalKey] ?? null;
  }
  return null;
}

function setGlobalInstance(instance: GameEngine) {
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
    getInstance(initialGame?: GameCreationProps): GameEngine {
      let instance = getGlobalInstance();
      if (!instance) {
        console.log(initialGame)
        if (!initialGame) throw new Error("First call must provide initial game");
        instance = new GameEngine(initialGame);
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
