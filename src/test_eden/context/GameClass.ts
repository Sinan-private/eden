import {id} from "@/Resource/helpers/id.ts";
import {ResourceUpdateProps} from "@/Resource/ResourceHandler";
import {createSingletonResourceStore} from "@/Resource/ResourceHandler/createSingletonResourceStore.ts";
import {GameState} from "@/test_eden/Classes/GameState.ts";
import {PlayerClass} from "@/test_eden/Classes/Player/PlayerClass.ts";
import {SlaveClass} from "@/test_eden/Classes/Slaves/SlaveClass.ts";
import {ManaClass} from "@/test_eden/Classes/Mana/ManaClass.ts";
import {BehemothClass} from "@/test_eden/Classes/Behemoth/BehemothClass.ts";
import {UpstreamClass} from "@/test_eden/Classes/UpstreamClass.ts";
import {
  GameBaseProps,
  ResourceKeys,
  ResourceStoreClass,
  ResourceTypes
} from "@/Resource/ResourceHandler/specificTypes.ts";
import {ArwaClass, GhoulClass, IfritClass, MaridClass} from "@/test_eden/Classes/Factions";

import {GameBaseClasses} from "@/test_eden/context/gameTypes.ts";
import {InterfaceController} from "@/test_eden/Interface/InterfaceController.ts";


export interface GameCreationProps {
  resources: ResourceUpdateProps<ResourceKeys, ResourceTypes>[]
}

export class GameClass {
  public id: string = id();
  public resources: ResourceStoreClass
  public gameState: GameState
  public player: PlayerClass
  public slaves: SlaveClass
  public mana: ManaClass
  public behemoth: BehemothClass
  public upstream: UpstreamClass
  public faction_ifrit: IfritClass
  public faction_marid: MaridClass
  public faction_arwa: ArwaClass
  public faction_ghoul: GhoulClass
  public interface: InterfaceController

  constructor(initialGame: GameCreationProps) {
    this.interface = new InterfaceController();
    this.resources = createSingletonResourceStore<ResourceKeys, ResourceTypes>().getInstance(initialGame.resources)
    this.gameState = new GameState(this.resources)
    const baseProps: GameBaseProps = {
      _resourceStore: this.resources,
      _gameState: this.gameState,
    }
    this.player = new PlayerClass(baseProps)
    this.slaves = new SlaveClass(baseProps)
    this.mana = new ManaClass(baseProps)
    this.behemoth = new BehemothClass(baseProps)
    this.upstream = new UpstreamClass(baseProps)
    console.log(this)
    const factionProps: GameBaseClasses = {
      gameState: this.gameState,
      resources: this.resources,
      slaves: this.slaves,
      mana: this.mana,
      behemoth: this.behemoth,
      upstream: this.upstream,
      player: this.player,
    }
    this.faction_arwa = new ArwaClass(factionProps)
    this.faction_marid = new MaridClass(factionProps)
    this.faction_ifrit = new IfritClass(factionProps)
    this.faction_ghoul = new GhoulClass(factionProps)
  }
}