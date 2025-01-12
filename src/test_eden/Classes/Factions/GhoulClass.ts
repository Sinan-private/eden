import image from '../../../assets/images/Faction3.png';
import {FactionClass} from "./FactionClass.ts";
import {GameBaseClasses} from "../../context/game.context.ts";


export class GhoulClass extends FactionClass {
  constructor(gameClasses: GameBaseClasses) {
    super(gameClasses)
    const {get} = this.resources;
    this.image = image;
    this.visible = true;
    this.loyalty = get('guard_loyalty');
    this.influence = get('guard_influence');
    this.progress = get('guard_progress');
    this.level = get('guard_level');
  }
}
