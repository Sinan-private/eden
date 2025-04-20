import {useState} from "react";
import {useApi} from "@/Resource/hooks/useApi.ts";
import {game} from "@/test_eden/Classes/Game/createSingletonGame.ts";
import {AdminController} from "@/Resource/Admin/AdminController.ts";
import {useComponentMount} from "@/Resource/hooks";

// This handles the loading of the resources and setting up everything that is needed for the game to work

export function useGameInitializer() {
  const { fetchResources } = useApi();
  const [gameReady, setGameReady] = useState(false);

  useComponentMount(() => {
    const init = async () => {
      const rawResources = await fetchResources();
      const gameInstance = game({ resources: rawResources });
      AdminController.getInstance(gameInstance.resources);
      setGameReady(true);
    };
    init();
  });

  return gameReady;
}
