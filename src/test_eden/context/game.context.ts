import {useMemo} from "react";
import {createContainer} from "unstated-next";
import {useResource, useTurnSubscription} from "../../Resource";
import {BehemothClass} from "../Behemoth/BehemothClass.ts";
import {SlaveClass} from "../Slaves/SlaveClass.ts";
import {DemonClass, GuardClass, DeceptionClass, SlaveHunterClass} from "../Factions";

const useGameBase = () => {
  const {resources} = useResource();
  const slaves = useMemo(() => new SlaveClass(resources), [resources]);
  const behemoth = useMemo(() => new BehemothClass(resources), [resources]);
  const factionDemon = useMemo(() => new DemonClass(resources, slaves), [resources, slaves])
  const factionMindBender = useMemo(() => new DeceptionClass(resources, slaves), [resources, slaves])
  const factionGuard = useMemo(() => new GuardClass(resources, slaves), [resources, slaves])
  const factionSlaveHunters = useMemo(() => new SlaveHunterClass(resources, slaves), [resources, slaves])
  useTurnSubscription(behemoth.turnUpdate);
  useTurnSubscription(slaves.turnUpdate);
  useTurnSubscription(factionSlaveHunters.turnUpdate);

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
