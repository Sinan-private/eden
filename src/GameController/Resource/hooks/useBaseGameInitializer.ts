import {useState} from "react";
import {useComponentMount} from "@/GameController/Resource/hooks/useComponentMount.ts";
import {GameBaseClass, GameBaseControlledCreationProps} from "@/GameController/GameBaseClass.ts";
import {baseGame} from "@/GameController/Resource/helpers/createSingletonBaseGame.ts";
import * as api from "@/GameController/Resource/server/api/apiService.ts";
// import initialResources from '../generated/initialResources.json'

declare global {
  interface Window {
    baseGame: GameBaseClass;
  }
}

export const useBaseGameInitializer = (config?: GameBaseControlledCreationProps) => {
  const { fetchResources, fetchResourceKeys, fetchResourceTypes } = api;
  const [gameReady, setGameReady] = useState(false);

  // I should consider if I want to import the static keys and types here.
  // They were a reference to the original file to prevent reloading or fetching but this seems
  // obsolete by now
  useComponentMount(() => {
    const init = async () => {
      const rawResources = await fetchResources();
      const keys = await fetchResourceKeys()
      const types = await fetchResourceTypes()
      window.baseGame = baseGame({
        resources: rawResources,
        resource_keys: keys,
        resource_types: types,
        ...config
      });
      setGameReady(true);
    };
    init();
  });

  return gameReady;
}
