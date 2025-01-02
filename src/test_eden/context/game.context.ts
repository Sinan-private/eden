import {useMemo} from "react";
import {createContainer} from "unstated-next";
import {useResource, useTurnSubscription} from "../../Resource";
import {BehemothClass} from "../Classes/Behemoth/BehemothClass.ts";
import {SlaveClass} from "../Classes/Slaves/SlaveClass.ts";
import {DemonClass, GuardClass, DeceptionClass, SlaveHunterClass} from "../Classes/Factions";
import {Mana} from "../Classes/Mana/Mana.ts";
import {Upstream} from "../Classes/Upstream.ts";

const useGameBase = () => {
  const {resources} = useResource();
  const slaves = useMemo(() => new SlaveClass(resources), [resources]);
  const behemoth = useMemo(() => new BehemothClass(resources), [resources]);
  const mana = useMemo(() => new Mana(resources), [resources])
  const upstream = useMemo(() => new Upstream(resources), [resources])
  const factionDemon = useMemo(() => new DemonClass(resources, slaves), [resources, slaves])
  const factionMindBender = useMemo(() => new DeceptionClass(resources, slaves), [resources, slaves])
  const factionGuard = useMemo(() => new GuardClass(resources, slaves), [resources, slaves])
  const factionSlaveHunters = useMemo(() => new SlaveHunterClass(resources, slaves), [resources, slaves])
  const tick = useTurnSubscription();
  useTurnSubscription(behemoth.turnUpdate);
  useTurnSubscription(slaves.turnUpdate);
  useTurnSubscription(factionSlaveHunters.turnUpdate);
  useTurnSubscription(upstream.turnUpdate);

  return {
    ...tick,
    resources,
    behemoth,
    slaves,
    mana,
    upstream,
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
