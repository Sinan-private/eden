import {LevelUpdate, ResourceStoreClass} from "@/GameController/Resource/ResourceHandler/specificTypes.ts";

type Level = `level_${ 1 | 2 | 3 | 4 | 5 }`;
export type Levels = {
  [L in Level]: LevelUpdate
};

export class LevelClass {
  constructor(
    private _resourceStore: ResourceStoreClass,
    public levels: Levels,
    public level = 1
  ) {
    // makeAutoObservable(this)
  }
  public levelUp = () => {
    if (this.meets_level_requirements) {
      this._resourceStore.levelUp(this.level_requirements)
      this.level++
    }
  }

  private _getLevel = (level: number): LevelUpdate => {
    const level_key = 'level_' + level as Level;
    return this.levels[level_key] || {};
  }

  get meets_level_requirements() {
    const {give, need} = this.level_requirements
    const {hasEnough} = this._resourceStore
    return hasEnough(give) && hasEnough(need)
  }

  get level_requirements(): LevelUpdate {
    return this._getLevel(this.level + 1)
  }

}