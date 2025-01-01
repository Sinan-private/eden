import {ResourceStoreClass} from "../../../Resource";
import image from '../../../assets/images/Faction2.png';
import {FactionClass} from "./FactionClass.ts";
import {SlaveClass} from "../Slaves/SlaveClass.ts";

const SLAVE_CREATION = 1

export class SlaveHunterClass extends FactionClass {
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
  public turnUpdate = () => {
    const {get} = this._resourceStore;
    const progress = get('slave_hunter_progress')
    progress.updateValueBy(SLAVE_CREATION)
    if (progress.is_max && !this._slaves.is_max) {
      progress.setToMin()
      this._slaves.addSlave(1)
    }
  }
}
