import {GameState} from "@/test_eden/Classes/Game/GameState.ts";
import {ResourceStoreClass} from "@/Resource";
import {BehemothClass} from "@/test_eden/Classes/Behemoth/BehemothClass.ts";
import {SlaveClass} from "@/test_eden/Classes/Slaves/SlaveClass.ts";
import {UpstreamClass} from "@/test_eden/Classes/UpstreamClass.ts";
import {ManaClass} from "@/test_eden/Classes/Mana/ManaClass.ts";
import {PlayerClass} from "@/test_eden/Classes/Player/PlayerClass.ts";
import {ArwaClass, GhoulClass, IfritClass, MaridClass} from "@/test_eden/Classes/Factions";
import {InterfaceController} from "@/test_eden/Interface/InterfaceController.ts";
import {Tick} from "@/Resource/context/Tick.ts";

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
  tick: Tick
} & GameBaseClasses & FactionClasses;