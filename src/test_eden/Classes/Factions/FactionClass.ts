import {ResourceClass, ResourceStoreClass} from "../../../Resource";
import {GameClasses} from "../../context/game.context.ts";
import {SlaveClass} from "../Slaves/SlaveClass.ts";

export class FactionClass {
  public image: string;
  public active: boolean;
  public visible: boolean;
  public loyalty!: ResourceClass;
  public influence!: ResourceClass;
  public progress!: ResourceClass;
  public level!: ResourceClass;
  public _resourceStore: ResourceStoreClass;
  public _slaves: SlaveClass;
  constructor(gameClasses: GameClasses) {
    this._resourceStore = gameClasses.resources
    this._slaves = gameClasses.slaves
    this.image = '';
    this.active = false;
    this.visible = true;
  }

  public setActive = () => this.active = true;
  public setVisible = () => this.visible = true;

}
