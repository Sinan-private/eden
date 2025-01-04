import {ResourceStoreClass} from "../../../Resource";
import image from '../../../assets/images/Faction2.png';
import {FactionClass} from "./FactionClass.ts";
import {SlaveClass} from "../Slaves/SlaveClass.ts";


export class SlaveHunterClass extends FactionClass {
  public crafting_requested: boolean = true;
  constructor(_resourceStore: ResourceStoreClass, _slaves: SlaveClass) {
    super(_resourceStore, _slaves)
    const {get} = _resourceStore;

    this.image = image;
    this.active = true;
    this.visible = true;
    this._loyalty = get('slave_hunter_loyalty');
    this._influence = get('slave_hunter_influence');
    this._progress = get('slave_hunter_progress');
    this._level = get('slave_hunter_level');
  }
}
