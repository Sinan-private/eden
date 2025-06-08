import {useState} from "react";
import {game} from "@/Game/Classes/Game/createSingletonGame.ts";
import{fetchResources} from "@/GameEngine/ResourceEngine/server/api/apiService.ts";
import {useComponentMount} from "@/GameEngine/ResourceEngine/hooks";
import {GameBaseControlledCreationProps, GameCreationProps} from "@/GameEngine/GameEngine.ts";

// This handles the loading of the resources and setting up everything that is needed for the game to work

export function useGameInitializer(config?: GameBaseControlledCreationProps) {
  const [gameReady, setGameReady] = useState(false);

  useComponentMount(() => {
    const init = async () => {
      const rawResources = await fetchResources();
      const initialProps = { resources: rawResources, ...config } as GameCreationProps
      console.log(initialProps)
      game(initialProps);
      setGameReady(true);
    };
    init();
  });

  return gameReady;
}
