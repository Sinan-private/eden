import {useMemo} from "react";
import {createContainer} from "unstated-next";
import {useResource, useTickSubscription} from "../../Resource";
import {BehemothClass} from "../Behemoth/BehemothClass.ts";
import {SlaveClass} from "../Slaves/SlaveClass.ts";

const useGameBase = () => {
  const {resources} = useResource();
  const behemoth = useMemo(() => new BehemothClass(resources), [resources]);
  const slaves = useMemo(() => new SlaveClass(resources), [resources]);
  useTickSubscription(behemoth.turnUpdate);
  useTickSubscription(slaves.turnUpdate);

  return {
    resources,
    behemoth,
    slaves,
  };
}

const useGameContainer = createContainer(useGameBase);
export const useGame = useGameContainer.useContainer;
export const GameProvider = useGameContainer.Provider;
