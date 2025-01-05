import {useMemo} from "react";
import {createContainer} from "unstated-next";
import {useResource, useTurnSubscription} from "../../Resource";
import {BehemothClass} from "../Classes/Behemoth/BehemothClass.ts";
import {SlaveClass} from "../Classes/Slaves/SlaveClass.ts";
import {IfritClass, GhoulClass, ArwaClass, MaridClass} from "../Classes/Factions";
import {ManaClass} from "../Classes/Mana/ManaClass.ts";
import {UpstreamClass} from "../Classes/UpstreamClass.ts";
import {Tick, useTick} from "../../Resource/context/tick.context.ts";
import {Resources} from "../../Resource/context/resource.context.ts";


const useGameBase = () => {
  const {resources} = useResource();
  const slaves = useMemo(() => new SlaveClass(resources), [resources]);
  const mana = useMemo(() => new ManaClass(resources), [resources])
  const behemoth = useMemo(() => new BehemothClass(resources), [resources]);
  const upstream = useMemo(() => new UpstreamClass(resources), [resources])
  const factionIfrit = useMemo(() => new IfritClass(resources, slaves), [resources, slaves])
  const factionArwa = useMemo(() => new ArwaClass(resources, slaves), [resources, slaves])
  const factionGhoul = useMemo(() => new GhoulClass(resources, slaves), [resources, slaves])
  const factionMarid = useMemo(() => new MaridClass(resources, slaves), [resources, slaves])
  const tick = useTick();

  const game = {
    ...tick,
    resources,
    behemoth,
    slaves,
    mana,
    upstream,
    factions: {
      factionMarid,
      factionIfrit,
      factionGhoul,
      factionArwa,
      all: [factionIfrit, factionMarid, factionGhoul, factionArwa]
    }
  };
  useTurnSubscription(slaves.turnUpdate);
  useTurnSubscription(upstream.turnUpdate);
  useTurnSubscription(() => behemoth.turnUpdate(game));
  useTurnSubscription(() => factionMarid.turnUpdate(game));
  useTurnSubscription(() => factionArwa.turnUpdate(game));


  return game
}

const useGameContainer = createContainer(useGameBase);
export const useGame = useGameContainer.useContainer;
export const GameProvider = useGameContainer.Provider;

type GameClasses = {
  resources: Resources;
  behemoth: BehemothClass;
  slaves: SlaveClass;
  upstream: UpstreamClass;
  mana: ManaClass;
};

type FactionClasses = {
  factionIfrit: IfritClass;
  factionMarid: MaridClass;
  factionArwa: ArwaClass;
  factionGhoul: GhoulClass;
}

export type Game = {
  resources: Resources;
  behemoth: BehemothClass;
  slaves: SlaveClass;
  upstream: UpstreamClass;
  mana: ManaClass;
} & FactionClasses & Tick;
