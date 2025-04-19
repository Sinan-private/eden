import {GameClass, GameCreationProps} from "@/test_eden/context/GameClass.ts";

let instance: GameClass<any, any> | null = null;
export function createSingletonGame<K extends string, T extends string>() {

  return {
    getInstance(initialGame?: GameCreationProps<K, T>): GameClass<K, T> {
      if (!instance) {
        if (!initialGame) throw new Error("First call must provide initial resources");
        instance = new GameClass(initialGame);
      }
      return instance as GameClass<K, T>;
    },
    resetInstance() {
      instance = null;
    },
  };
}

export const game = createSingletonGame().getInstance