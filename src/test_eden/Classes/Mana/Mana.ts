import {ResourceStoreClass, ResourceTypes} from "../../../Resource";

export class Mana {
  constructor(private _resourceStore: ResourceStoreClass) {
  }
  public getTypeSum = (type: ResourceTypes) => {
    const resources = this._resourceStore.getByType(type)
    const sum = resources.reduce((sum, {value}) => (sum + Math.floor(value)), 0)
    return Math.floor(Math.floor(sum))
  }

  get mana_count() {
    return this.getTypeSum('mana')
  }
}