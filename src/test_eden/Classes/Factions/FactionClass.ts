import {ResourceClass, ResourceStoreClass} from "../../../Resource";
import {SlaveClass} from "../Slaves/SlaveClass.ts";

export class FactionClass {
  public image: string;
  public active: boolean;
  public visible: boolean;
  protected _loyalty!: ResourceClass;
  protected _influence!: ResourceClass;
  protected _progress!: ResourceClass;
  protected _level!: ResourceClass;
  constructor(
    public _resourceStore: ResourceStoreClass,
    public _slaves: SlaveClass,
  ) {
    this.image = '';
    this.active = false;
    this.visible = true;
  }

  public setActive = () => this.active = true;
  public setVisible = () => this.visible = true;

  get loyalty() {
    return Number(this._loyalty.value.toFixed())
  }
  get influence() {
    return Number(this._influence.value.toFixed())
  }
  get progress() {
    return Number(this._progress.value.toFixed())
  }
  get level() {
    return Number(this._level.value.toFixed())
  }
}
