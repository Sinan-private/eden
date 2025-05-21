import {ResourceUpdateProps} from "@/GameController/Resource/ResourceHandler";
import {ResourceKeys, ResourceStoreClass, ResourceTypes} from "@/GameController/Resource";
import {AdminController, AdminControllerCreationProps} from "@/GameController/Resource/Admin/AdminController.ts";
import {id} from "@/GameController/Resource/helpers/id.ts";
import {Tick, TickCreationProps} from "@/GameController/components/Constructors/Tick.ts";
import {createSingletonResourceStore} from "@/GameController/Resource/ResourceHandler/createSingletonResourceStore.ts";
import {unique} from "@/GameController/Resource/helpers/array.ts";

export interface GameBaseCreationProps {
  resources: ResourceUpdateProps<ResourceKeys, ResourceTypes>[];
  resource_keys?: ResourceKeys[];
  resource_types?: ResourceTypes[];
  tick?: TickCreationProps;
  admin?: AdminControllerCreationProps;
}

export type GameBaseControlledCreationProps = Omit<GameBaseCreationProps, 'resources'>

export class GameBaseClass {
  public id: string = id();
  public resources: ResourceStoreClass
  public admin: AdminController
  public tick: Tick
  public resource_keys: ResourceKeys[]
  public resource_types: ResourceTypes[];
  constructor(initialGame: GameBaseCreationProps) {
    this.resources = createSingletonResourceStore<ResourceKeys, ResourceTypes>().getInstance(initialGame.resources)
    this.resource_keys = initialGame.resource_keys || this.resources.allResources.map(({key}) => key)
    this.resource_types = initialGame.resource_types || this.resources.allResources
      .map(({type}) => type)
      .filter(unique)
    this.admin = AdminController.getInstance(this.resources, this.resource_keys, this.resource_types, initialGame.admin)
    this.tick = new Tick(initialGame.tick)
  }

  public showContextMenu = () => this.admin.showContextMenu()
  public hideContextMenu = () => this.admin.hideContextMenu()
}