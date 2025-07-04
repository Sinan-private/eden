import {ResourceUpdateProps} from "@/GameEngine/ResourceEngine/ResourceHandler";
import {ResourceKeys, ResourceEngineClass, ResourceTypes} from "src/GameEngine/ResourceEngine";
import {AdminController, AdminControllerCreationProps} from "@/GameEngine/Admin/AdminController.ts";
import {id} from "@/GameEngine/ResourceEngine/helpers/id.ts";
import {Tick, TickCreationProps} from "@/GameEngine/Tick/Tick.ts";
import {createSingletonResourceStore} from "@/GameEngine/ResourceEngine/ResourceHandler/createSingletonResourceStore.ts";
import {unique} from "@/GameEngine/ResourceEngine/helpers/array.ts";
import {EventEngine} from "@/GameEngine/EventEngine/EventEngine.ts";
import {GameEventCreationProps} from "src/GameEngine";

export interface GameCreationProps {
  resources: ResourceUpdateProps<ResourceKeys, ResourceTypes>[];
  events: GameEventCreationProps[]
  resource_keys?: ResourceKeys[];
  resource_types?: ResourceTypes[];
  tick?: TickCreationProps;
  admin?: AdminControllerCreationProps;
}

export type GameBaseControlledCreationProps = Omit<GameCreationProps, 'resources'>

export class GameEngine {
  public id: string = id();
  public resources: ResourceEngineClass
  public events: EventEngine
  public admin: AdminController
  public tick: Tick
  public resource_keys: ResourceKeys[]
  public resource_types: ResourceTypes[]

  constructor(initialGame: GameCreationProps) {
    this.tick = new Tick(initialGame.tick)
    this.resources = createSingletonResourceStore<ResourceKeys, ResourceTypes>().getInstance(initialGame.resources)
    // Does this need to be its own singleton? Possibly not because EventEngine only seem to make sense together with resources
    this.events = new EventEngine(initialGame.events, this);
    this.resource_keys = initialGame.resource_keys || this.resources.allResources.map(({key}) => key)
    this.resource_types = initialGame.resource_types || this.resources.allResources
      .map(({type}) => type)
      .filter(unique)
    this.admin = AdminController.getInstance(this.resources, this.resource_keys, this.resource_types, initialGame.admin)
    this.tick.subscribeToTurn(() => {
      this.events.evaluate()
      // console.log('now')
    }, 'global_events')
  }

  public showContextMenu = () => this.admin.showContextMenu()
  public hideContextMenu = () => this.admin.hideContextMenu()
  public resourceChangePerSecond = (resource: ResourceKeys) =>
    this.resources.getByKey(resource).getChangePerTick * this.tick.ticks_per_second
}
