import {ResourceStoreClass} from "../../../Resource";
import image from '../../../assets/images/Faction1.png';
import {FactionClass} from "./FactionClass.ts";
import {SlaveClass} from "../Slaves/SlaveClass.ts";

// This is the one with the demon image
export class IfritClass extends FactionClass {
  constructor(_resourceStore: ResourceStoreClass, _slaves: SlaveClass) {
    const {get} = _resourceStore;
    super(_resourceStore, _slaves)
    this.image = image;
    this._loyalty = get('demon_loyalty');
    this._influence = get('demon_influence');
    this._progress = get('demon_progress');
    this._level = get('demon_level');
  }
}
