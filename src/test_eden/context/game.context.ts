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
import {game} from "@/test_eden/context/createSingletonGame.ts";

const useGameBase = () => {

  const tick = useTick();
  const _game = game();
  const {
    slaves,
    behemoth, upstream,
    faction_arwa,
    faction_marid,
  } = _game

  useTurnSubscription(slaves.turnUpdate);
  useTurnSubscription(upstream.turnUpdate);
  useTurnSubscription(() => behemoth.turnUpdate(_game));
  useTurnSubscription(() => faction_marid.turnUpdate(_game));
  useTurnSubscription(() => faction_arwa.turnUpdate(_game));

  return {
    ...tick,
    ..._game,
    ui: new InterfaceController()
  }
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
  faction_ifrit: IfritClass;
  faction_marid: MaridClass;
  faction_arwa: ArwaClass;
  faction_ghoul: GhoulClass;
}

export type Game = {
  ui: InterfaceController
} & GameBaseClasses & Tick & FactionClasses;
