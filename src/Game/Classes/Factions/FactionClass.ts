import {ResourceClass, ResourceStoreClass} from "@/GameController/Resource";
import {SlaveClass} from "../Slaves/SlaveClass.ts";
import {BehemothClass} from "../Behemoth/BehemothClass.ts";
import {ManaClass} from "../Mana/ManaClass.ts";
import {UpstreamClass} from "../UpstreamClass.ts";
import {GameBaseClasses} from "@/Game/Classes/Game/gameTypes.ts";

export type FactionKeys = 'ifrit' | 'marid' | 'arwa' | 'ghoul'

export abstract class FactionClass {
  public faction!: FactionKeys;
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
  constructor(_gameClasses: GameBaseClasses) {
    this.resources = _gameClasses.resources
    this.slaves = _gameClasses.slaves
    this.mana = _gameClasses.mana
    this.behemoth = _gameClasses.behemoth
    this.upstream = _gameClasses.upstream
    this.image = '';
    this.active = false;
    this.visible = true;
  }

  public setActive = () => this.active = true;
  public setVisible = () => this.visible = true;
}
