import {id} from "@/GameController/Resource/helpers/id.ts";
import {ResourceUpdateProps} from "@/GameController/Resource/ResourceHandler";
import {createSingletonResourceStore} from "@/GameController/Resource/ResourceHandler/createSingletonResourceStore.ts";
import {GameState} from "@/test_eden/Classes/Game/GameState.ts";
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
} from "@/GameController/Resource/ResourceHandler/specificTypes.ts";
import {ArwaClass, GhoulClass, IfritClass, MaridClass} from "@/test_eden/Classes/Factions";
import {GameBaseClasses} from "@/test_eden/Classes/Game/gameTypes.ts";
import {InterfaceController} from "@/test_eden/Interface/InterfaceController.ts";
import {AdminController} from "@/GameController/Resource/Admin/AdminController.ts";
import {makeAutoObservable} from "mobx";
import {Tick} from "@/GameController/components/Constructors/Tick.ts";

// Here all the logic of the game is bundled into a single class that can be imported everywhere

export interface GameCreationProps {
  resources: ResourceUpdateProps<ResourceKeys, ResourceTypes>[]
}

export class GameClass {
  public id: string = id();
  public resources: ResourceStoreClass
  public admin: AdminController
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
  public tick: Tick = new Tick()

  constructor(initialGame: GameCreationProps) {
    this.interface = new InterfaceController();
    this.resources = createSingletonResourceStore<ResourceKeys, ResourceTypes>().getInstance(initialGame.resources)
    this.admin = AdminController.getInstance(this.resources)
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
    this.tick.subscribeToTurn(this.turn, this.id)
    makeAutoObservable(this)
  }

  private turn = () => {
    this.slaves.turnUpdate()
    this.upstream.turnUpdate()
    this.behemoth.turnUpdate(this)
    this.faction_marid.turnUpdate(this)
    this.faction_arwa.turnUpdate(this)

  }
}
