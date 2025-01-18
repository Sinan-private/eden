import {ResourceClass, ResourceStoreClass} from "../../../Resource";
import {GameBaseClasses} from "../../context/game.context.ts";
import {SlaveClass} from "../Slaves/SlaveClass.ts";
import {BehemothClass} from "../Behemoth/BehemothClass.ts";
import {ManaClass} from "../Mana/ManaClass.ts";
import {UpstreamClass} from "../UpstreamClass.ts";

export class FactionClass {
  public image: string;
  public active: boolean;
  public visible: boolean;
  public loyalty!: ResourceClass;
  public influence!: ResourceClass;
  public progress!: ResourceClass;
  public level!: ResourceClass;
  public skill_speed_primary!: ResourceClass;
  public skill_speed_secondary!: ResourceClass;
  public resources: ResourceStoreClass;
  public slaves: SlaveClass;
  public mana: ManaClass;
  public behemoth: BehemothClass;
  public upstream: UpstreamClass;
  constructor(gameClasses: GameBaseClasses) {
    this.resources = gameClasses.resources
    this.slaves = gameClasses.slaves
    this.mana = gameClasses.mana
    this.behemoth = gameClasses.behemoth
    this.upstream = gameClasses.upstream
    this.image = '';
    this.active = false;
    this.visible = true;
  }

  public setActive = () => this.active = true;
  public setVisible = () => this.visible = true;

}
