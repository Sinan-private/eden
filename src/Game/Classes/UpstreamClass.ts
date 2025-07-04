import {ResourceClass, ResourceEngineClass} from "@/GameEngine"

import {GameBaseProps} from "@/Game/types.ts";

export class UpstreamClass {
  private _height: ResourceClass;
  private _resourceStore: ResourceEngineClass

  constructor({_resourceStore}: GameBaseProps) {
    this._resourceStore = _resourceStore;
    this._height = _resourceStore.getByKey('upstream_height')
  }
  get height() {
    return this._resourceStore.getByKey('upstream_height')
  }
  get distance() {
    return this._resourceStore.getByKey('behemoth_climb_height').value - this.height.value
  }

  get danger() {
    const dangerLevel = (1200 - this.distance) / 10
    return dangerLevel > 100
      ? 100
      : dangerLevel < 0
        ? 0
        : dangerLevel
  }

  public turnUpdate = () => {
    if(this.distance > 0) {
      this._height.updateValueBy(3)
    }
    if (this.distance < 300) {
      const damage = (300 - this.distance) / 50
      this._resourceStore.getByKey('behemoth_hp').updateValueBy(-damage)
    }
  }
}
