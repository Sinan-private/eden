import {GameState} from "@/Game/Classes/Game/GameState.ts";
import {PlayerClass} from "@/Game/Classes/Player/PlayerClass.ts";
import {SlaveClass} from "@/Game/Classes/Slaves/SlaveClass.ts";
import {ManaClass} from "@/Game/Classes/Mana/ManaClass.ts";
import {BehemothClass} from "@/Game/Classes/Behemoth/BehemothClass.ts";
import {UpstreamClass} from "@/Game/Classes/UpstreamClass.ts";
import {ArwaClass, GhoulClass, IfritClass, MaridClass} from "@/Game/Classes/Factions";
import {InterfaceController} from "@/Game/Interface/InterfaceController.ts";
import {GameBaseClasses} from "@/Game/Classes/Game/gameTypes.ts";
import {GameBaseProps} from "@/Game/types.ts";
import {GameEngine} from "@/GameEngine";
import {id} from "@/GameEngine/ResourceEngine/helpers/id.ts";
import {GameCreationProps} from "@/GameEngine/GameEngine.ts";

export class GameClass extends GameEngine {
  public id: string = id();
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
    super(initialGame)
    this.interface = new InterfaceController();
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
    this.tick.subscribeToTick(this._tick, this.id + '_tick')
    this.tick.subscribeToTurn(this._turn, this.id)
  }

  private _tick = () => {
    this.behemoth.tickUpdate(this)
  }

  private _turn = () => {
    this.slaves.turnUpdate()
    this.upstream.turnUpdate()
    this.behemoth.turnUpdate(this)
    this.faction_marid.turnUpdate(this)
    this.faction_arwa.turnUpdate(this)
  }
}