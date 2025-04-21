import { GameClass, GameCreationProps } from "@/Game/Classes/Game/GameClass.ts";

// This is only making sure that there is always only 1 GameController object.
// This object is stored in the window object to enable hot reloading without any issues

const globalKey = "__singleton_game_instance__";

function getGlobalInstance(): GameClass | null {
  if (typeof window !== "undefined") {
    return (window as any)[globalKey] ?? null;
  }
  return null;
}

function setGlobalInstance(instance: GameClass) {
  if (typeof window !== "undefined") {
    (window as any)[globalKey] = instance;
  }
}

function resetGlobalInstance() {
  if (typeof window !== "undefined") {
    delete (window as any)[globalKey];
  }
}

export function createSingletonGame() {
  return {
    getInstance(initialGame?: GameCreationProps): GameClass {
      let instance = getGlobalInstance();
      if (!instance) {
        if (!initialGame) throw new Error("First call must provide initial resources");
        instance = new GameClass(initialGame);
        setGlobalInstance(instance);
      }
      return instance;
    },
    resetInstance() {
      resetGlobalInstance();
    },
  };
}

export const game = createSingletonGame().getInstance;
