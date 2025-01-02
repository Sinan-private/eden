import {ResourceClass, ResourceStoreClass} from "../../Resource";

export class Upstream {
  private _height: ResourceClass;
  constructor(private _resourceStore: ResourceStoreClass) {
    this._height = _resourceStore.get('upstream_height')
  }
  get height() {
    return this._resourceStore.get('upstream_height')
  }
  get distance() {
    return this._resourceStore.get('behemoth_climb_height').value - this.height.value
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
      this._resourceStore.get('behemoth_hp').updateValueBy(-damage)
    }
  }
}