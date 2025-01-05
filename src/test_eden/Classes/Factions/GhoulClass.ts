import {ResourceStoreClass} from "../../../Resource";
import image from '../../../assets/images/Faction3.png';
import {FactionClass} from "./FactionClass.ts";
import {SlaveClass} from "../Slaves/SlaveClass.ts";


export class GhoulClass extends FactionClass {
  constructor(_resourceStore: ResourceStoreClass, _slaves: SlaveClass) {
    const {get} = _resourceStore;
    super(_resourceStore, _slaves)
    this.image = image;
    this.visible = true;
    this.loyalty = get('guard_loyalty');
    this.influence = get('guard_influence');
    this.progress = get('guard_progress');
    this.level = get('guard_level');
  }
}
