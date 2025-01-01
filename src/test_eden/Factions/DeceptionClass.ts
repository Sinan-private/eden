import {ResourceStoreClass} from "../../Resource";
import image from '../../assets/images/Faction4.png';
import {FactionClass} from "./FactionClass.ts";


export class DeceptionClass extends FactionClass {
  constructor(_resourceStore: ResourceStoreClass) {
    const {get} = _resourceStore;
    super(_resourceStore)
    this.image = image;
    this.visible = true;
    this._loyalty = get('deception_loyalty');
    this._influence = get('deception_influence');
    this._progress = get('deception_progress');
  }
}
