import {GameClass, GameCreationProps} from "@/test_eden/context/GameClass.ts";

let instance: GameClass | null = null;
export function createSingletonGame() {

  return {
    getInstance(initialGame?: GameCreationProps): GameClass {
      if (!instance) {
        if (!initialGame) throw new Error("First call must provide initial resources");
        instance = new GameClass(initialGame);
      }
      return instance as GameClass;
    },
    resetInstance() {
      instance = null;
    },
  };
}

export const game = createSingletonGame().getInstance
