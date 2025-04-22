import {useState} from "react";
import {useApi} from "@/GameController/Resource/hooks/useApi.ts";
import {game} from "@/Game/Classes/Game/createSingletonGame.ts";
import {useComponentMount} from "@/GameController/Resource/hooks";
import {GameBaseControlledCreationProps} from "@/GameController/GameBaseClass.ts";

// This handles the loading of the resources and setting up everything that is needed for the game to work

export function useGameInitializer(config?: GameBaseControlledCreationProps) {
  const { fetchResources } = useApi();
  const [gameReady, setGameReady] = useState(false);

  useComponentMount(() => {
    const init = async () => {
      const rawResources = await fetchResources();
      game({ resources: rawResources, ...config });
      setGameReady(true);
    };
    init();
  });

  return gameReady;
}
