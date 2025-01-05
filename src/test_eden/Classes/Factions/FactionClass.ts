import {ResourceClass, ResourceStoreClass} from "../../../Resource";
import {SlaveClass} from "../Slaves/SlaveClass.ts";

export class FactionClass {
  public image: string;
  public active: boolean;
  public visible: boolean;
  public loyalty!: ResourceClass;
  public influence!: ResourceClass;
  public progress!: ResourceClass;
  public level!: ResourceClass;
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

}
