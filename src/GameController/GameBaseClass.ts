import {ResourceUpdateProps} from "@/GameController/Resource/ResourceHandler";
import {ResourceKeys, ResourceStoreClass, ResourceTypes} from "@/GameController/Resource";
import {AdminController} from "@/GameController/Resource/Admin/AdminController.ts";
import {id} from "@/GameController/Resource/helpers/id.ts";
import {Tick, TickCreationProps} from "@/GameController/components/Constructors/Tick.ts";
import {createSingletonResourceStore} from "@/GameController/Resource/ResourceHandler/createSingletonResourceStore.ts";

export interface GameBaseCreationProps {
  resources: ResourceUpdateProps<ResourceKeys, ResourceTypes>[];
  tick?: TickCreationProps;
}

export type GameBaseControlledCreationProps = Omit<GameBaseCreationProps, 'resources'>

export class GameBaseClass {
  public id: string = id();
  public resources: ResourceStoreClass
  public admin: AdminController
  public tick: Tick
  constructor(initialGame: GameBaseCreationProps) {
    this.resources = createSingletonResourceStore<ResourceKeys, ResourceTypes>().getInstance(initialGame.resources)
    this.admin = AdminController.getInstance(this.resources)
    this.tick = new Tick(initialGame.tick)
  }
}