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
import {GameState} from "@/test_eden/Classes/GameState.ts";
import {GameBaseProps} from "@/Resource/ResourceHandler/specificTypes.ts";

const useGameBase = (resources?: ResourceStoreClass) => {
  if (!resources) {
    throw new Error("ResourceStore is required but was not provided.");
  }
  const tick = useTick();
  const gameState = useMemo(() => new GameState(), []);
  const gameBaseProps: GameBaseProps = useMemo(() => ({
    _resourceStore: resources,
    _gameState: gameState,
  }), [gameState, resources]);
  console.log(gameBaseProps._gameState.mana_flushing)
  const player = useMemo(() => new PlayerClass(gameBaseProps), [gameBaseProps]);
  const slaves = useMemo(() => new SlaveClass(gameBaseProps), [gameBaseProps]);
  const mana = useMemo(() => new ManaClass(gameBaseProps), [gameBaseProps])
  const behemoth = useMemo(() => new BehemothClass(gameBaseProps), [gameBaseProps]);
  const upstream = useMemo(() => new UpstreamClass(gameBaseProps), [gameBaseProps]);
  const gameClasses: GameBaseClasses = useMemo(() => ({
    gameState,
    resources,
    slaves,
    mana,
    behemoth,
    upstream,
    player,
  }), [player, behemoth, mana, resources, slaves, upstream, gameState])
  const factionIfrit = useMemo(() => new IfritClass(gameClasses), [gameClasses])
  const factionArwa = useMemo(() => new ArwaClass(gameClasses), [gameClasses])
  const factionGhoul = useMemo(() => new GhoulClass(gameClasses), [gameClasses])
  const factionMarid = useMemo(() => new MaridClass(gameClasses), [gameClasses])
  const interfaceClass = useMemo(() => new InterfaceController(gameClasses), [gameClasses])

  const game: Game = {
    ...tick,
    gameState,
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
  gameState: GameState;
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
