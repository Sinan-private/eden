import {useState} from "react";
import {useApi} from "@/GameController/Resource/hooks/useApi.ts";
import {useComponentMount} from "@/GameController/Resource/hooks/useComponentMount.ts";
import {GameBaseClass, GameBaseControlledCreationProps} from "@/GameController/GameBaseClass.ts";
import {baseGame} from "@/GameController/Resource/helpers/createSingletonBaseGame.ts";

declare global {
  interface Window {
    baseGame: GameBaseClass;
  }
}

export const useBaseGameInitializer = (config?: GameBaseControlledCreationProps) => {
  const { fetchResources } = useApi();
  const [gameReady, setGameReady] = useState(false);

  useComponentMount(() => {
    const init = async () => {
      const rawResources = await fetchResources();
      window.baseGame = baseGame({ resources: rawResources, ...config });
      setGameReady(true);
    };
    init();
  });

  return gameReady;
}