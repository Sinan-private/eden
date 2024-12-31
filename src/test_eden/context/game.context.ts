import {useMemo} from "react";
import {createContainer} from "unstated-next";
import {useResource, useTickSubscription} from "../../Resource";
import {BehemothClass} from "../Behemoth/BehemothClass.ts";

const useGameBase = () => {
  const {resources} = useResource();
  const behemoth = useMemo(() => new BehemothClass(resources), [resources]);
  useTickSubscription(behemoth.turnUpdate);

  return {
    resources,
    behemoth,
  };
}

const useGameContainer = createContainer(useGameBase);
export const useGame = useGameContainer.useContainer;
export const GameProvider = useGameContainer.Provider;
