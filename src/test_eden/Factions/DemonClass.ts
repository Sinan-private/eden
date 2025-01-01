import {ResourceStoreClass} from "../../Resource";
import image from '../../assets/images/Faction1.png';
import {FactionClass} from "./FactionClass.ts";


export class DemonClass extends FactionClass {
  constructor(_resourceStore: ResourceStoreClass) {
    const {get} = _resourceStore;
    super(_resourceStore)
    this.image = image;
    this._loyalty = get('demon_loyalty');
    this._influence = get('demon_influence');
    this._progress = get('demon_progress');
  }
}
