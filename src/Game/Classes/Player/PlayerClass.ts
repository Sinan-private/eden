import {LevelClass} from "../LevelClass.ts";
import {playerLevel} from "./playerLevels.ts";
import {GameBaseProps} from "@/GameController/Resource/ResourceHandler/specificTypes.ts";

export class PlayerClass {
  public level: LevelClass;
  constructor({_resourceStore}: GameBaseProps) {
    this.level = new LevelClass(_resourceStore, playerLevel)

  }
}