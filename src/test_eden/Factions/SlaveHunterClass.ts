import {ResourceStoreClass} from "../../Resource";
import image from '../../assets/images/Faction2.png';
import {FactionClass} from "./FactionClass.ts";


export class SlaveHunterClass extends FactionClass {
  constructor(_resourceStore: ResourceStoreClass) {
    super(_resourceStore)
    const {get} = _resourceStore;
    this.image = image;
    this.active = true;
    this.visible = true;
    this._loyalty = get('slave_hunter_loyalty');
    this._influence = get('slave_hunter_influence');
    this._progress = get('slave_hunter_progress');
  }
  public turnUpdate = () => {
    this._resourceStore.get('slave_hunter_progress').updateValueBy(1)
  }
}
