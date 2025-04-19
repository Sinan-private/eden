import {id} from "@/Resource/helpers/id.ts";
import {ResourceUpdateProps} from "@/Resource/ResourceHandler";
import {ResourceStore} from "@/Resource/ResourceHandler/ResourceStore.ts";
import {createSingletonResourceStore} from "@/Resource/ResourceHandler/createSingletonResourceStore.ts";
import {GameState} from "@/test_eden/Classes/GameState.ts";
import {PlayerClass} from "@/test_eden/Classes/Player/PlayerClass.ts";
import {SlaveClass} from "@/test_eden/Classes/Slaves/SlaveClass.ts";
import {ManaClass} from "@/test_eden/Classes/Mana/ManaClass.ts";
import {BehemothClass} from "@/test_eden/Classes/Behemoth/BehemothClass.ts";
import {UpstreamClass} from "@/test_eden/Classes/UpstreamClass.ts";
import {GameBaseProps} from "@/Resource/ResourceHandler/specificTypes.ts";


export interface GameCreationProps<K extends string, T extends string> {
  resources: ResourceUpdateProps<K, T>[]
}

export class GameClass<K extends string, T extends string> {
  public id: string = id();
  public resources: ResourceStore<K, T>
  public gameState: GameState<K, T>
  public player: PlayerClass
  public slaves: SlaveClass
  public mana: ManaClass
  public behemoth: BehemothClass
  public upstream: UpstreamClass
  constructor(initialGame: GameCreationProps<K, T>) {
    this.resources = createSingletonResourceStore<K, T>().getInstance(initialGame.resources)
    this.gameState = new GameState(this.resources)
    const baseProps: GameBaseProps = {
      _resourceStore: this.resources as any,
      _gameState: this.gameState,
    }
    this.player = new PlayerClass(baseProps)
    this.slaves = new SlaveClass(baseProps)
    this.mana = new ManaClass(baseProps)
    this.behemoth = new BehemothClass(baseProps)
    this.upstream = new UpstreamClass(baseProps)
    console.log(this)
  }
}