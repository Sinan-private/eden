import {ResourceUpdateProps} from "@/GameController/Resource/ResourceHandler";
import {ResourceKeys, ResourceStoreClass, ResourceTypes} from "@/GameController/Resource";
import {AdminController} from "@/GameController/Resource/Admin/AdminController.ts";
import {id} from "@/GameController/Resource/helpers/id.ts";
import {Tick} from "@/GameController/components/Constructors/Tick.ts";
import {createSingletonResourceStore} from "@/GameController/Resource/ResourceHandler/createSingletonResourceStore.ts";

export interface GameCreationProps {
  resources: ResourceUpdateProps<ResourceKeys, ResourceTypes>[]
}

export class GameBaseClass {
  public id: string = id();
  public resources: ResourceStoreClass
  public admin: AdminController
  public tick: Tick = new Tick()
  constructor(initialGame: GameCreationProps) {
    this.resources = createSingletonResourceStore<ResourceKeys, ResourceTypes>().getInstance(initialGame.resources)
    this.admin = AdminController.getInstance(this.resources)
  }
}