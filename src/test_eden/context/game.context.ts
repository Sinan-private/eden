import {useMemo} from "react";
import {createContainer} from "unstated-next";
import {ResourceStoreClass, useTurnSubscription} from "@/Resource";
import {BehemothClass} from "../Classes/Behemoth/BehemothClass.ts";
import {SlaveClass} from "../Classes/Slaves/SlaveClass.ts";
import {IfritClass, GhoulClass, ArwaClass, MaridClass} from "../Classes/Factions";
import {ManaClass} from "../Classes/Mana/ManaClass.ts";
import {UpstreamClass} from "../Classes/UpstreamClass.ts";
import {Tick, useTick} from "@/Resource/context/tick.context.ts";
import {InterfaceController} from "../Interface/InterfaceController.ts";
import {PlayerClass} from "../Classes/Player/PlayerClass.ts";


const useGameBase = (resources?: ResourceStoreClass) => {
  if (!resources) {
    throw new Error("ResourceStore is required but was not provided.");
  }
  const tick = useTick();
  const player = useMemo(() => new PlayerClass(resources), [resources]);
  const slaves = useMemo(() => new SlaveClass(resources), [resources]);
  const mana = useMemo(() => new ManaClass(resources), [resources])
  const behemoth = useMemo(() => new BehemothClass(resources), [resources]);
  const upstream = useMemo(() => new UpstreamClass(resources), [resources]);
  const gameClasses: GameBaseClasses = useMemo(() => ({
    resources,
    slaves,
    mana,
    behemoth,
    upstream,
    player,
  }), [player, behemoth, mana, resources, slaves, upstream])
  const factionIfrit = useMemo(() => new IfritClass(gameClasses), [gameClasses])
  const factionArwa = useMemo(() => new ArwaClass(gameClasses), [gameClasses])
  const factionGhoul = useMemo(() => new GhoulClass(gameClasses), [gameClasses])
  const factionMarid = useMemo(() => new MaridClass(gameClasses), [gameClasses])
  const interfaceClass = useMemo(() => new InterfaceController(gameClasses), [gameClasses])

  const game: Game = {
    ...tick,
    ui: interfaceClass,
    resources,
    behemoth,
    slaves,
    mana,
    upstream,
    player,
    factions: {
      factionMarid,
      factionIfrit,
      factionGhoul,
      factionArwa,
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

export type GameBaseClasses = {
  resources: ResourceStoreClass;
  behemoth: BehemothClass;
  slaves: SlaveClass;
  upstream: UpstreamClass;
  mana: ManaClass;
  player: PlayerClass;
};

type FactionClasses = {
  factionIfrit: IfritClass;
  factionMarid: MaridClass;
  factionArwa: ArwaClass;
  factionGhoul: GhoulClass;
}

export type Game = {
  factions: FactionClasses;
  ui: InterfaceController
} & GameBaseClasses & Tick;
