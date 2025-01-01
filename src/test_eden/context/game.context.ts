import {useMemo} from "react";
import {createContainer} from "unstated-next";
import {useResource, useTickSubscription} from "../../Resource";
import {BehemothClass} from "../Behemoth/BehemothClass.ts";
import {SlaveClass} from "../Slaves/SlaveClass.ts";
import {DemonClass, GuardClass, DeceptionClass, SlaveHunterClass} from "../Factions";

const useGameBase = () => {
  const {resources} = useResource();
  const behemoth = useMemo(() => new BehemothClass(resources), [resources]);
  const slaves = useMemo(() => new SlaveClass(resources), [resources]);
  const factionDemon = useMemo(() => new DemonClass(resources), [resources])
  const factionMindBender = useMemo(() => new DeceptionClass(resources), [resources])
  const factionGuard = useMemo(() => new GuardClass(resources), [resources])
  const factionSlaveHunters = useMemo(() => new SlaveHunterClass(resources), [resources])
  useTickSubscription(behemoth.turnUpdate);
  useTickSubscription(slaves.turnUpdate);
  useTickSubscription(factionSlaveHunters.turnUpdate);

  return {
    resources,
    behemoth,
    slaves,
    factions: {
      slaveHunters: factionSlaveHunters,
      demons: factionDemon,
      guards: factionGuard,
      mindBenders: factionMindBender,
      all: [factionDemon, factionSlaveHunters, factionGuard, factionMindBender]
    }
  };
}

const useGameContainer = createContainer(useGameBase);
export const useGame = useGameContainer.useContainer;
export const GameProvider = useGameContainer.Provider;
