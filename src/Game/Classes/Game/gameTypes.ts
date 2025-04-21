import {GameState} from "@/Game/Classes/Game/GameState.ts";
import {ResourceStoreClass} from "@/GameController/Resource";
import {BehemothClass} from "@/Game/Classes/Behemoth/BehemothClass.ts";
import {SlaveClass} from "@/Game/Classes/Slaves/SlaveClass.ts";
import {UpstreamClass} from "@/Game/Classes/UpstreamClass.ts";
import {ManaClass} from "@/Game/Classes/Mana/ManaClass.ts";
import {PlayerClass} from "@/Game/Classes/Player/PlayerClass.ts";
import {ArwaClass, GhoulClass, IfritClass, MaridClass} from "@/Game/Classes/Factions";
import {InterfaceController} from "@/Game/Interface/InterfaceController.ts";
import {Tick} from "@/GameController/components/Constructors/Tick.ts";

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