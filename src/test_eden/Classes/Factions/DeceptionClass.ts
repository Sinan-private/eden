import {ResourceStoreClass} from "../../../Resource";
import image from '../../../assets/images/Faction4.png';
import {FactionClass} from "./FactionClass.ts";
import {SlaveClass} from "../Slaves/SlaveClass.ts";


export class DeceptionClass extends FactionClass {
  constructor(_resourceStore: ResourceStoreClass, _slaves: SlaveClass) {
    const {get} = _resourceStore;
    super(_resourceStore, _slaves)
    this.image = image;
    this.visible = true;
    this._loyalty = get('deception_loyalty');
    this._influence = get('deception_influence');
    this._progress = get('deception_progress');
    this._level = get('deception_level');
  }
}
