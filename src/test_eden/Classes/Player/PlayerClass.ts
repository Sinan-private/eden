import {ResourceStoreClass} from "../../../Resource";
import {LevelClass} from "../LevelClass.ts";
import {playerLevel} from "./playerLevels.ts";

export class PlayerClass {
  public level: LevelClass;
  constructor(_resourceStore: ResourceStoreClass) {
    this.level = new LevelClass(_resourceStore, playerLevel)

  }
}