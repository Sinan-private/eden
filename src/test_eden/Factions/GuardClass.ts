import {ResourceStoreClass} from "../../Resource";
import image from '../../assets/images/Faction3.png';
import {FactionClass} from "./FactionClass.ts";


export class GuardClass extends FactionClass {
  constructor(_resourceStore: ResourceStoreClass) {
    const {get} = _resourceStore;
    super(_resourceStore)
    this.image = image;
    this.visible = true;
    this._loyalty = get('guard_loyalty');
    this._influence = get('guard_influence');
    this._progress = get('guard_progress');
  }
}
