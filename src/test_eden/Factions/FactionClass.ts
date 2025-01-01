import {ResourceClass, ResourceStoreClass} from "../../Resource";


export class FactionClass {
  public image: string;
  public active: boolean;
  public visible: boolean;
  protected _loyalty!: ResourceClass;
  protected _influence!: ResourceClass;
  protected _progress!: ResourceClass;
  constructor(
    public _resourceStore: ResourceStoreClass
  ) {
    this.image = '';
    this.active = false;
    this.visible = false;
    // this._loyalty = get('slave_hunter_loyalty');
    // this._influence = get('slave_hunter_influence');
    // this._progress = get('slave_hunter_progress');
  }

  get loyalty() {
    return Number(this._loyalty.value.toFixed())
  }
  get influence() {
    return Number(this._influence.value.toFixed())
  }
  get progress() {
    return Number(this._progress.value.toFixed())
  }
}
