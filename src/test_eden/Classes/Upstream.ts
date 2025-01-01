import {ResourceClass, ResourceStoreClass} from "../../Resource";

export class Upstream {
  private _height: ResourceClass;
  constructor(private _resourceStore: ResourceStoreClass) {
    this._height = _resourceStore.get('upstream_height')
  }
  get height() {
    return this._resourceStore.get('upstream_height')
  }
  public turnUpdate = () => {
    this._height.updateValueBy(3)
  }
}